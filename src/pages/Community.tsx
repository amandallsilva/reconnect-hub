import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Send, Trash2, Award } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Community() {
  const { profile, posts, addPost, toggleLike, deletePost } = useData();
  const [newPostContent, setNewPostContent] = useState("");
  const { toast } = useToast();

  const handleSubmitPost = () => {
    if (newPostContent.trim().length < 10) {
      toast({
        title: "Post muito curto",
        description: "Escreva pelo menos 10 caracteres",
        variant: "destructive"
      });
      return;
    }

    addPost(newPostContent);
    setNewPostContent("");
    toast({
      title: "Post publicado! 🎉",
      description: "Sua publicação foi compartilhada com a comunidade"
    });
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

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-reconnect-green bg-clip-text text-transparent">
          Comunidade ReConectar
        </h1>
        <p className="text-muted-foreground text-lg">
          Compartilhe sua jornada e inspire outras pessoas 💬
        </p>
      </div>

      {/* Create Post */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-md">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Compartilhe sua experiência, conquista ou reflexão..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px] resize-none border-primary/20 focus:border-primary"
            />
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newPostContent.length} / 500 caracteres
              </span>
              <Button
                onClick={handleSubmitPost}
                disabled={newPostContent.trim().length < 10}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md"
              >
                <Send className="w-4 h-4 mr-2" />
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className={`p-6 hover:shadow-lg transition-all ${
              post.author.isExpert
                ? "bg-gradient-to-br from-golden/10 to-primary/10 border-golden/30"
                : "bg-card border-border"
            }`}
          >
            <div className="space-y-4">
              {/* Author Header */}
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className={
                      post.author.isExpert
                        ? "bg-gradient-to-br from-golden to-primary text-white"
                        : "bg-gradient-to-br from-primary to-secondary text-white"
                    }>
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{post.author.name}</span>
                      {post.author.isExpert && (
                        <Badge className="bg-golden/20 text-golden border-golden/30 gap-1">
                          <Award className="w-3 h-3" />
                          Especialista
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>@{post.author.username}</span>
                      {post.author.isExpert && post.author.expertise && (
                        <>
                          <span>•</span>
                          <span>{post.author.expertise}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(post.timestamp)}
                  </span>
                  {!post.author.isExpert && post.author.username === profile.username && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        deletePost(post.id);
                        toast({
                          title: "Post excluído",
                          description: "Sua publicação foi removida"
                        });
                      }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>

              {post.image && (
                <img
                  src={post.image}
                  alt="Post image"
                  className="rounded-lg w-full max-h-96 object-cover"
                />
              )}

              {/* Actions */}
              <div className="flex items-center gap-6 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(post.id)}
                  className={`gap-2 ${
                    post.likedByUser
                      ? "text-destructive hover:text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${post.likedByUser ? "fill-current" : ""}`}
                  />
                  {post.likes > 0 && <span>{post.likes}</span>}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground"
                >
                  <MessageCircle className="w-5 h-5" />
                  {post.comments > 0 && <span>{post.comments}</span>}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
