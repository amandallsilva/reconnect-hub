import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Send, Trash2, Users, Sparkles, Shield, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  name: string;
  avatar: string | null;
  level: number;
}

export default function Community() {
  const { user } = useAuth();
  const { isAdmin, isSpecialist } = useUserRole();
  const { posts, addPost, toggleLike, deletePost, loading } = useCommunity();
  const [newPostContent, setNewPostContent] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('name, avatar, level')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setUserProfile(data);
    }
  };

  const handleSubmitPost = async () => {
    if (newPostContent.trim().length < 10) {
      toast({
        title: "Post muito curto",
        description: "Escreva pelo menos 10 caracteres",
        variant: "destructive"
      });
      return;
    }

    const { error } = await addPost(newPostContent);
    
    if (error) {
      toast({
        title: "Erro ao publicar",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setNewPostContent("");
      toast({
        title: "Post publicado! 🎉",
        description: "Sua publicação foi compartilhada com a comunidade"
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await deletePost(postId);
    
    if (error) {
      toast({
        title: "Erro ao deletar",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Post deletado",
        description: "Sua publicação foi removida"
      });
    }
  };

  const handleContactSpecialist = async (specialistId: string) => {
    if (!chatMessage.trim() || !user) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        specialist_id: specialistId,
        message: chatMessage,
        is_from_user: true
      });

    if (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Mensagem enviada!",
        description: "O especialista receberá sua mensagem em breve"
      });
      setChatMessage("");
      setChatOpen(false);
      setSelectedSpecialistId(null);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Agora há pouco";
    if (diffInHours < 24) return `Há ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Ontem";
    if (diffInDays < 7) return `Há ${diffInDays} dias`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando comunidade...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Comunidade ReConectar
          </h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Compartilhe suas conquistas e inspire outros
        </p>
      </div>

      {/* Create Post Card */}
      {userProfile && (
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20">
          <div className="flex gap-3 sm:gap-4">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-primary/20">
              <AvatarImage src={userProfile.avatar || ''} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                {getInitials(userProfile.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Compartilhe sua experiência, conquista ou reflexão..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] resize-none border-primary/20 focus:border-primary text-sm sm:text-base"
                maxLength={500}
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {newPostContent.length} / 500 caracteres
                </span>
                <Button
                  onClick={handleSubmitPost}
                  disabled={newPostContent.trim().length < 10}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="text-sm">Publicar</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Seja o primeiro a compartilhar algo na comunidade!
            </p>
          </Card>
        ) : (
          posts.map((post) => {
            const canDelete = user && (post.author_id === user.id || isAdmin || isSpecialist);

            return (
              <Card
                key={post.id}
                className="p-4 sm:p-6 hover:shadow-lg transition-all bg-card border-border"
              >
                <div className="space-y-4">
                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-2 sm:gap-3 min-w-0 flex-1">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-primary/20 flex-shrink-0">
                        <AvatarImage src={post.author.avatar || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                          {getInitials(post.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm sm:text-base truncate">
                            {post.author.name}
                          </span>
                          {post.is_specialist && (
                            <Badge className="bg-primary text-primary-foreground text-xs flex-shrink-0 gap-1">
                              <Shield className="w-3 h-3" />
                              Especialista
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            Nível {post.author.level}
                          </Badge>
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {formatTimestamp(post.created_at)}
                        </span>
                      </div>
                    </div>

                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Content */}
                  <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post image"
                      className="rounded-lg w-full max-h-64 sm:max-h-96 object-cover"
                    />
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 sm:gap-6 pt-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={`gap-2 ${
                        post.liked_by_user
                          ? "text-red-500 hover:text-red-600"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          post.liked_by_user ? "fill-current" : ""
                        }`}
                      />
                      <span className="text-sm">{post.likes}</span>
                    </Button>

                    {post.is_specialist && user && post.author_id !== user.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSpecialistId(post.author_id);
                          setChatOpen(true);
                        }}
                        className="gap-2 text-primary hover:text-primary/80"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm">Contatar</span>
                      </Button>
                    )}
                  </div>

                  {/* Contact Modal */}
                  {chatOpen && selectedSpecialistId === post.author_id && (
                    <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Enviar mensagem para {post.author.name}</span>
                      </div>
                      <Textarea
                        placeholder="Escreva sua mensagem..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleContactSpecialist(post.author_id)}
                          disabled={!chatMessage.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Enviar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setChatOpen(false);
                            setChatMessage("");
                            setSelectedSpecialistId(null);
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}