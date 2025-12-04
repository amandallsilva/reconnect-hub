import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Send, Trash2, Users, Sparkles, Shield, MessageCircle, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCommunity, Post } from "@/hooks/useCommunity";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  name: string;
  avatar: string | null;
  level: number;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    name: string;
    avatar: string | null;
  };
}

export default function Community() {
  const { user } = useAuth();
  const { isAdmin, isSpecialist } = useUserRole();
  const { posts, addPost, toggleLike, deletePost, loading } = useCommunity();
  const [newPostContent, setNewPostContent] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [chatMessage, setChatMessage] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState<{id: string, name: string} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('name, avatar, level')
      .eq('id', user.id)
      .single();

    if (data) {
      setUserProfile(data);
    }
  };

  const fetchComments = async (postId: string) => {
    const { data } = await (supabase as any)
      .from('post_comments')
      .select(`*, profiles:user_id (name, avatar)`)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (data) {
      setComments(prev => ({ ...prev, [postId]: data as Comment[] }));
    }
  };

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
    setExpandedComments(newExpanded);
  };

  const handleSubmitComment = async (postId: string) => {
    const content = newComment[postId]?.trim();
    if (!content || !user) return;

    const { error } = await (supabase as any)
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content
      });

    if (error) {
      toast({ title: "Erro ao comentar", description: error.message, variant: "destructive" });
    } else {
      setNewComment(prev => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
      toast({ title: "Comentário adicionado!" });
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    const { error } = await (supabase as any)
      .from('post_comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      fetchComments(postId);
    }
  };

  const handleSubmitPost = async () => {
    if (newPostContent.trim().length < 10) {
      toast({ title: "Post muito curto", description: "Escreva pelo menos 10 caracteres", variant: "destructive" });
      return;
    }

    const { error } = await addPost(newPostContent);
    if (error) {
      toast({ title: "Erro ao publicar", description: error.message, variant: "destructive" });
    } else {
      setNewPostContent("");
      toast({ title: "Post publicado!" });
    }
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await deletePost(postId);
    if (!error) {
      toast({ title: "Post deletado" });
    }
  };

  const handleSendMessageToSpecialist = async () => {
    if (!chatMessage.trim() || !user || !selectedSpecialist) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        specialist_id: selectedSpecialist.id,
        message: chatMessage,
        is_from_user: true
      });

    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Mensagem enviada!", description: `${selectedSpecialist.name} receberá sua mensagem` });
      setChatMessage("");
      setSelectedSpecialist(null);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Agora";
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Comunidade ReConectar
          </h1>
        </div>
        <p className="text-muted-foreground">Compartilhe e conecte-se com especialistas</p>
      </div>

      {/* Create Post - Only specialists */}
      {userProfile && (isSpecialist || isAdmin) && (
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">Criar Publicação (Especialista)</span>
          </div>
          <div className="flex gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-primary">
              <AvatarImage src={userProfile.avatar || ''} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(userProfile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Compartilhe dicas, reflexões ou apoio..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[100px]"
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{newPostContent.length}/1000</span>
                <Button onClick={handleSubmitPost} disabled={newPostContent.trim().length < 10}>
                  <Send className="w-4 h-4 mr-2" />
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Contact Specialist Modal */}
      {selectedSpecialist && (
        <Card className="p-4 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="font-semibold">Enviar mensagem para {selectedSpecialist.name}</span>
          </div>
          <Textarea
            placeholder="Escreva sua mensagem privada..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="min-h-[80px] mb-3"
          />
          <div className="flex gap-2">
            <Button onClick={handleSendMessageToSpecialist} disabled={!chatMessage.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
            <Button variant="outline" onClick={() => setSelectedSpecialist(null)}>
              Cancelar
            </Button>
          </div>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum post ainda</p>
          </Card>
        ) : (
          posts.map((post) => {
            const canDelete = user && (post.author_id === user.id || isAdmin || isSpecialist);
            const postComments = comments[post.id] || [];
            const isExpanded = expandedComments.has(post.id);

            return (
              <Card key={post.id} className="p-4 sm:p-6">
                {/* Author Header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                      <AvatarImage src={post.author.avatar || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                        {getInitials(post.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{post.author.name}</span>
                        {post.is_specialist && (
                          <Badge className="bg-primary text-primary-foreground gap-1">
                            <Shield className="w-3 h-3" />
                            Especialista
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{formatTimestamp(post.created_at)}</span>
                    </div>
                  </div>

                  {canDelete && (
                    <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Content */}
                <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id)}
                    className={post.liked_by_user ? "text-red-500" : "text-muted-foreground"}
                  >
                    <Heart className={`w-5 h-5 mr-1 ${post.liked_by_user ? "fill-current" : ""}`} />
                    {post.likes}
                  </Button>

                  <Button variant="ghost" size="sm" onClick={() => toggleComments(post.id)} className="text-muted-foreground">
                    <MessageSquare className="w-5 h-5 mr-1" />
                    {postComments.length || "Comentar"}
                  </Button>

                  {post.is_specialist && user && post.author_id !== user.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSpecialist({ id: post.author_id, name: post.author.name })}
                      className="text-primary ml-auto"
                    >
                      <MessageCircle className="w-5 h-5 mr-1" />
                      Mensagem Privada
                    </Button>
                  )}
                </div>

                {/* Comments Section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    {postComments.map((comment) => (
                      <div key={comment.id} className="flex gap-2 bg-muted/50 p-3 rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.profiles?.avatar || ''} />
                          <AvatarFallback>{comment.profiles?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{comment.profiles?.name}</span>
                            {(user?.id === comment.user_id || isAdmin || isSpecialist) && (
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id, post.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-foreground">{comment.content}</p>
                          <span className="text-xs text-muted-foreground">{formatTimestamp(comment.created_at)}</span>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    {user && (
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Escreva um comentário..."
                          value={newComment[post.id] || ""}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                          className="min-h-[60px]"
                        />
                        <Button onClick={() => handleSubmitComment(post.id)} disabled={!newComment[post.id]?.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
