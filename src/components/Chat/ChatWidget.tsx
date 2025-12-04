import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Users, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Specialist {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [loadingSpecialists, setLoadingSpecialists] = useState(false);
  const { messages, sendMessage, loading } = useChat();
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !selectedSpecialist) {
      fetchSpecialists();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchSpecialists = async () => {
    setLoadingSpecialists(true);
    
    // Get all specialist user IDs
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('user_id')
      .in('role', ['specialist', 'admin']);

    if (roleData && roleData.length > 0) {
      const userIds = roleData.map(r => r.user_id);
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar, bio')
        .in('id', userIds);

      if (profiles) {
        setSpecialists(profiles);
      }
    }
    setLoadingSpecialists(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!user) {
      toast({
        title: "Faça login primeiro",
        description: "Você precisa estar logado para enviar mensagens",
        variant: "destructive"
      });
      return;
    }

    if (!selectedSpecialist) {
      toast({
        title: "Selecione um especialista",
        description: "Escolha um especialista para iniciar a conversa",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        specialist_id: selectedSpecialist.id,
        message: input.trim(),
        is_from_user: true
      });

    if (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setInput("");
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const filteredMessages = selectedSpecialist 
    ? messages.filter(m => m.specialist_id === selectedSpecialist.id || (!m.specialist_id && m.is_from_user))
    : [];

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 max-w-md h-[70vh] sm:h-96 bg-card border border-border rounded-2xl shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-primary/5 rounded-t-2xl">
            <div className="flex items-center gap-2">
              {selectedSpecialist ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setSelectedSpecialist(null)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={selectedSpecialist.avatar || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(selectedSpecialist.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm truncate max-w-[120px]">{selectedSpecialist.name}</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span className="font-medium text-sm sm:text-base">Falar com Especialista</span>
                </>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
          
          {/* Content */}
          {!selectedSpecialist ? (
            // Specialist List
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {loadingSpecialists ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : specialists.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm text-center">
                  <Users className="w-10 h-10 mb-2 opacity-50" />
                  <p>Nenhum especialista disponível</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-3">Selecione um especialista para conversar:</p>
                  {specialists.map((specialist) => (
                    <button
                      key={specialist.id}
                      onClick={() => setSelectedSpecialist(specialist)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
                    >
                      <Avatar className="w-10 h-10 ring-2 ring-primary/30">
                        <AvatarImage src={specialist.avatar || ''} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(specialist.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{specialist.name}</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            Especialista
                          </Badge>
                        </div>
                        {specialist.bio && (
                          <p className="text-xs text-muted-foreground truncate">{specialist.bio}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Chat Messages
            <>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                {filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm text-center">
                    <MessageCircle className="w-10 h-10 mb-2 opacity-50" />
                    <p>Envie uma mensagem para</p>
                    <p className="font-medium text-foreground">{selectedSpecialist.name}</p>
                  </div>
                ) : (
                  <>
                    {filteredMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.is_from_user ? "justify-end" : "justify-start"}`}
                      >
                        <div 
                          className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 rounded-2xl ${
                            msg.is_from_user 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-xs sm:text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              
              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Digite sua mensagem..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="rounded-full text-sm"
                  />
                  <Button 
                    size="icon" 
                    className="rounded-full bg-accent hover:bg-accent/90 h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
                    onClick={handleSend}
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      <Button
        size="icon"
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
      </Button>
    </>
  );
}
