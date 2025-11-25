import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();
  const { user } = useAuth();
  const { toast } = useToast();

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

    const { error } = await sendMessage(input);
    
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

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 max-w-md h-[70vh] sm:h-96 bg-card border border-border rounded-2xl shadow-xl flex flex-col z-50">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-primary/5 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="font-medium text-sm sm:text-base">Especialista ReConectar</span>
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
          
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                <p>Envie uma mensagem para começar</p>
              </div>
            ) : (
              messages.map((msg) => (
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
              ))
            )}
          </div>
          
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
