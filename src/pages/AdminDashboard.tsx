import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, MessageSquare, Users, Ban, LogOut, 
  PenSquare, Trophy, User, Send, Camera, Save
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_from_user: boolean;
  read: boolean;
  created_at: string;
  profiles: {
    name: string;
    avatar: string | null;
  };
}

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  level: number;
  is_blocked: boolean;
}

interface SpecialistProfile {
  name: string;
  bio: string;
  avatar: string | null;
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { isAdmin, isSpecialist, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Post creation
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Challenge creation
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    total_days: 7,
    reward_xp: 100,
    reward_badge: "",
    icon: "Trophy"
  });
  const [isSubmittingChallenge, setIsSubmittingChallenge] = useState(false);

  // Specialist profile
  const [profile, setProfile] = useState<SpecialistProfile>({
    name: "",
    bio: "",
    avatar: null
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isAdmin && !isSpecialist) {
      navigate('/dashboard');
    }
  }, [isAdmin, isSpecialist, roleLoading, navigate]);

  useEffect(() => {
    if (user && (isAdmin || isSpecialist)) {
      fetchChatMessages();
      fetchUsers();
      fetchProfile();

      const channel = supabase
        .channel('admin-chat-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages'
          },
          () => {
            fetchChatMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin, isSpecialist]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('name, bio, avatar')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        name: data.name || "",
        bio: data.bio || "",
        avatar: data.avatar
      });
    }
  };

  const fetchChatMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles!chat_messages_user_id_fkey (name, avatar)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && data) {
      setChatMessages(data as any);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!profilesError && profilesData) {
      const { data: blocksData } = await supabase
        .from('user_blocks')
        .select('user_id');

      const blockedIds = new Set(blocksData?.map(b => b.user_id) || []);

      setUsers(
        profilesData.map(p => ({
          ...p,
          is_blocked: blockedIds.has(p.id)
        }))
      );
    }
  };

  const handleReplyMessage = async (userId: string) => {
    if (!replyMessage.trim() || !user) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        specialist_id: user.id,
        message: replyMessage,
        is_from_user: false
      });

    if (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setReplyMessage("");
      toast({ title: "Mensagem enviada!" });
      fetchChatMessages();
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_blocks')
      .insert({
        user_id: userId,
        blocked_by: user.id,
        reason: "Violação das regras"
      });

    if (error) {
      toast({
        title: "Erro ao bloquear usuário",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Usuário bloqueado" });
      fetchUsers();
    }
  };

  const handleUnblockUser = async (userId: string) => {
    const { error } = await supabase
      .from('user_blocks')
      .delete()
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Erro ao desbloquear usuário",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Usuário desbloqueado" });
      fetchUsers();
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;
    setIsSubmittingPost(true);

    const { error } = await supabase
      .from('community_posts')
      .insert({
        author_id: user.id,
        content: newPostContent
      });

    if (error) {
      toast({
        title: "Erro ao criar post",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Post publicado com sucesso!" });
      setNewPostContent("");
    }
    setIsSubmittingPost(false);
  };

  const handleCreateChallenge = async () => {
    if (!newChallenge.title.trim() || !user) return;
    setIsSubmittingChallenge(true);

    const { error } = await supabase
      .from('challenges')
      .insert({
        title: newChallenge.title,
        description: newChallenge.description,
        total_days: newChallenge.total_days,
        reward_xp: newChallenge.reward_xp,
        reward_badge: newChallenge.reward_badge || null,
        icon: newChallenge.icon,
        created_by: user.id
      });

    if (error) {
      toast({
        title: "Erro ao criar desafio",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Desafio criado com sucesso!" });
      setNewChallenge({
        title: "",
        description: "",
        total_days: 7,
        reward_xp: 100,
        reward_badge: "",
        icon: "Trophy"
      });
    }
    setIsSubmittingChallenge(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Erro ao salvar perfil",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Perfil atualizado!" });
      setIsEditingProfile(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Imagem muito grande",
          description: "Máximo 2MB",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const userMessages = selectedUserId
    ? chatMessages.filter(m => m.user_id === selectedUserId)
    : [];

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-primary">
                <AvatarImage src={profile.avatar || ''} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profile.name?.charAt(0) || 'E'}
                </AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-1 -right-1 text-xs bg-primary">
                <Shield className="w-3 h-3" />
              </Badge>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{profile.name || 'Especialista'}</h1>
              <Badge variant="secondary" className="text-xs">
                {isAdmin ? 'Administrador' : 'Especialista'}
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="messages" className="text-xs sm:text-sm py-2">
              <MessageSquare className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="text-xs sm:text-sm py-2">
              <PenSquare className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="text-xs sm:text-sm py-2">
              <Trophy className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Desafios</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm py-2">
              <Users className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2">
              <User className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="p-4 lg:col-span-1">
                <h3 className="font-semibold mb-4">Conversas</h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {Array.from(new Set(chatMessages.map(m => m.user_id))).map(userId => {
                    const lastMsg = chatMessages.find(m => m.user_id === userId);
                    const unreadCount = chatMessages.filter(
                      m => m.user_id === userId && m.is_from_user && !m.read
                    ).length;

                    return (
                      <div
                        key={userId}
                        onClick={() => setSelectedUserId(userId)}
                        className={`p-3 rounded-lg cursor-pointer transition ${
                          selectedUserId === userId
                            ? 'bg-primary/10 border-2 border-primary'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={lastMsg?.profiles?.avatar || ''} />
                            <AvatarFallback>
                              {lastMsg?.profiles?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {lastMsg?.profiles?.name || 'Usuário'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {lastMsg?.message}
                            </p>
                          </div>
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {chatMessages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhuma conversa ainda
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-4 lg:col-span-2">
                {selectedUserId ? (
                  <>
                    <div className="border-b pb-4 mb-4">
                      <h3 className="font-semibold">
                        Conversa com {userMessages[0]?.profiles?.name || 'Usuário'}
                      </h3>
                    </div>

                    <div className="space-y-3 max-h-[350px] overflow-y-auto mb-4">
                      {[...userMessages].reverse().map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.is_from_user ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl ${
                              msg.is_from_user
                                ? 'bg-muted text-foreground'
                                : 'bg-primary text-primary-foreground'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.created_at).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Digite sua resposta..."
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <Button onClick={() => handleReplyMessage(selectedUserId)}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <p>Selecione uma conversa</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <PenSquare className="w-5 h-5" />
                Criar Nova Publicação
              </h3>
              <div className="space-y-4">
                <Textarea
                  placeholder="Compartilhe dicas, reflexões ou mensagens de apoio com a comunidade..."
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  className="min-h-[150px]"
                  maxLength={1000}
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {newPostContent.length}/1000 caracteres
                  </p>
                  <Button 
                    onClick={handleCreatePost} 
                    disabled={!newPostContent.trim() || isSubmittingPost}
                  >
                    {isSubmittingPost ? 'Publicando...' : 'Publicar'}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Criar Novo Desafio
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Título do Desafio *</Label>
                  <Input
                    placeholder="Ex: 7 dias de meditação"
                    value={newChallenge.title}
                    onChange={e => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duração (dias) *</Label>
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    value={newChallenge.total_days}
                    onChange={e => setNewChallenge(prev => ({ ...prev, total_days: parseInt(e.target.value) || 7 }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Descreva o desafio e seus benefícios..."
                    value={newChallenge.description}
                    onChange={e => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recompensa XP</Label>
                  <Input
                    type="number"
                    min={0}
                    value={newChallenge.reward_xp}
                    onChange={e => setNewChallenge(prev => ({ ...prev, reward_xp: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Medalha</Label>
                  <Input
                    placeholder="Ex: Medalha de Ouro"
                    value={newChallenge.reward_badge}
                    onChange={e => setNewChallenge(prev => ({ ...prev, reward_badge: e.target.value }))}
                  />
                </div>
              </div>
              <Button 
                className="mt-6 w-full" 
                onClick={handleCreateChallenge}
                disabled={!newChallenge.title.trim() || isSubmittingChallenge}
              >
                {isSubmittingChallenge ? 'Criando...' : 'Criar Desafio'}
              </Button>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Gerenciar Usuários</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {users.map(u => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={u.avatar || ''} />
                        <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <p className="text-xs text-muted-foreground">Nível {u.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.is_blocked ? (
                        <>
                          <Badge variant="destructive">Bloqueado</Badge>
                          {isAdmin && (
                            <Button variant="outline" size="sm" onClick={() => handleUnblockUser(u.id)}>
                              Desbloquear
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button variant="destructive" size="sm" onClick={() => handleBlockUser(u.id)}>
                          <Ban className="w-4 h-4 mr-1" />
                          Bloquear
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Meu Perfil de Especialista
                </h3>
                <Button 
                  variant={isEditingProfile ? "default" : "outline"}
                  onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                >
                  {isEditingProfile ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  ) : (
                    'Editar'
                  )}
                </Button>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage src={profile.avatar || ''} />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                      {profile.name?.charAt(0) || 'E'}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className="absolute bottom-2 right-2 bg-primary">
                    <Shield className="w-4 h-4" />
                  </Badge>
                  {isEditingProfile && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition">
                      <Camera className="w-8 h-8 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>

                <Badge variant="secondary" className="text-sm">
                  {isAdmin ? 'Administrador' : 'Especialista Verificado'}
                </Badge>

                <div className="w-full max-w-md space-y-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    {isEditingProfile ? (
                      <Input
                        value={profile.name}
                        onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      <p className="text-lg font-medium">{profile.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Bio / Sobre mim</Label>
                    {isEditingProfile ? (
                      <Textarea
                        placeholder="Conte um pouco sobre você e sua experiência..."
                        value={profile.bio}
                        onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {profile.bio || 'Nenhuma bio adicionada ainda.'}
                      </p>
                    )}
                  </div>
                </div>

                {isEditingProfile && (
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancelar
                  </Button>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
