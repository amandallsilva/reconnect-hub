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
import { Shield, MessageSquare, Users, Ban, LogOut } from "lucide-react";
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

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  level: number;
  is_blocked: boolean;
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { isAdmin, isSpecialist, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin && !isSpecialist) {
      navigate('/dashboard');
    }
  }, [isAdmin, isSpecialist, roleLoading, navigate]);

  useEffect(() => {
    if (user && (isAdmin || isSpecialist)) {
      fetchChatMessages();
      fetchUsers();

      // Subscribe to new messages
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
      toast({
        title: "Mensagem enviada!",
        description: "O usuário receberá sua resposta"
      });
      fetchChatMessages();
    }
  };

  const handleBlockUser = async (userId: string, reason: string = "Violação das regras") => {
    if (!user) return;

    const { error } = await supabase
      .from('user_blocks')
      .insert({
        user_id: userId,
        blocked_by: user.id,
        reason
      });

    if (error) {
      toast({
        title: "Erro ao bloquear usuário",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Usuário bloqueado",
        description: "O usuário não poderá mais publicar ou interagir"
      });
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
      toast({
        title: "Usuário desbloqueado",
        description: "O usuário pode voltar a interagir"
      });
      fetchUsers();
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Painel do Especialista</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie usuários e responda mensagens
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="p-4 lg:col-span-1">
                <h3 className="font-semibold mb-4">Conversas Ativas</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {Array.from(
                    new Set(chatMessages.map(m => m.user_id))
                  ).map(userId => {
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
                </div>
              </Card>

              <Card className="p-4 lg:col-span-2">
                {selectedUserId ? (
                  <>
                    <div className="border-b pb-4 mb-4">
                      <h3 className="font-semibold">
                        Conversa com{' '}
                        {userMessages[0]?.profiles?.name || 'Usuário'}
                      </h3>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                      {userMessages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.is_from_user ? 'justify-start' : 'justify-end'
                          }`}
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

                    <div className="space-y-2">
                      <Label>Responder</Label>
                      <Textarea
                        placeholder="Digite sua resposta..."
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button
                        onClick={() => handleReplyMessage(selectedUserId)}
                        className="w-full"
                      >
                        Enviar Resposta
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                    <p>Selecione uma conversa para começar</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Gerenciar Usuários</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {users.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || ''} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Nível {user.level}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.is_blocked ? (
                        <>
                          <Badge variant="destructive">Bloqueado</Badge>
                          {isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnblockUser(user.id)}
                            >
                              Desbloquear
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleBlockUser(user.id)}
                        >
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
        </Tabs>
      </div>
    </div>
  );
}