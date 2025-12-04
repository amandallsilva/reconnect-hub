import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Post {
  id: string;
  author_id: string;
  content: string;
  image: string | null;
  likes: number;
  created_at: string;
  author: {
    name: string;
    avatar: string | null;
    level: number;
    bio?: string | null;
  };
  liked_by_user: boolean;
  is_specialist: boolean;
}

export function useCommunity() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPosts([]);
      setLoading(false);
      return;
    }

    fetchPosts();

    // Subscribe to new posts
    const channel = supabase
      .channel('community-posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchPosts = async () => {
    if (!user) return;

    const { data: postsData, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles!community_posts_author_id_fkey (name, avatar, level, bio)
      `)
      .order('created_at', { ascending: false });

    if (!error && postsData) {
      // Get user's likes
      const { data: likesData } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);

      // Get specialist/admin roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['specialist', 'admin']);

      const likedPostIds = new Set(likesData?.map(l => l.post_id) || []);
      const specialistIds = new Set(rolesData?.map(r => r.user_id) || []);

      setPosts(
        postsData.map(post => ({
          ...post,
          author: post.profiles,
          liked_by_user: likedPostIds.has(post.id),
          is_specialist: specialistIds.has(post.author_id)
        })) as Post[]
      );
    }
    setLoading(false);
  };

  const addPost = async (content: string, image?: string) => {
    if (!user) return { error: new Error('User not authenticated') };

    const { error } = await supabase
      .from('community_posts')
      .insert({
        author_id: user.id,
        content,
        image: image || null
      });

    if (!error) {
      await fetchPosts();
    }

    return { error };
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.liked_by_user) {
      // Unlike
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      await supabase
        .from('community_posts')
        .update({ likes: Math.max(0, post.likes - 1) })
        .eq('id', postId);
    } else {
      // Like
      await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        });

      await supabase
        .from('community_posts')
        .update({ likes: post.likes + 1 })
        .eq('id', postId);
    }

    await fetchPosts();
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    if (!error) {
      await fetchPosts();
    }

    return { error };
  };

  return {
    posts,
    loading,
    addPost,
    toggleLike,
    deletePost
  };
}