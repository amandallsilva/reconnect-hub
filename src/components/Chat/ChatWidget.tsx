import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Olá! Como posso ajudar você hoje?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input }]);
      setInput("");
      
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: "assistant", 
          text: "Obrigado pela mensagem! Um especialista entrará em contato em breve." 
        }]);
      }, 1000);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-card border border-border rounded-2xl shadow-xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">Especialista ReConectar</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    msg.sender === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input 
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="rounded-full"
              />
              <Button 
                size="icon" 
                className="rounded-full bg-accent hover:bg-accent/90"
                onClick={handleSend}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>
    </>
  );
}
