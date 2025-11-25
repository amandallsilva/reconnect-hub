import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Recuperar Senha</h1>
          <p className="text-muted-foreground">
            Digite seu email e enviaremos instruções para redefinir sua senha
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
            Enviar Instruções
          </Button>
        </form>

        <div className="text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para login
          </Link>
        </div>
      </Card>
    </div>
  );
}
