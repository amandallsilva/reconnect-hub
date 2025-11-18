import { NavLink } from "@/components/NavLink";
import { Home, Calendar, Users, Brain, User, Leaf, Lightbulb, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Início", path: "/dashboard" },
  { icon: Calendar, label: "Desafios", path: "/challenges" },
  { icon: Users, label: "Eventos", path: "/events" },
  { icon: Brain, label: "Consciência Digital", path: "/digital-consciousness" },
  { icon: User, label: "Perfil", path: "/profile" },
];

export function Sidebar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear any auth data here if needed
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-card via-primary/5 to-secondary/5 border-r border-border flex flex-col fixed left-0 top-0 shadow-lg">
      {/* Logo */}
      <div className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gradient-to-br from-primary to-secondary">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-reconnect-green bg-clip-text text-transparent">
              ReConectar
            </h1>
          </div>
        </div>
        <p className="text-xs text-muted-foreground ml-10">Reconecte-se com você</p>
      </div>

      <Separator className="mx-4" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all"
            activeClassName="bg-gradient-to-r from-primary/15 to-secondary/15 text-primary font-semibold shadow-sm"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Daily Tip & Logout */}
      <div className="p-4 mt-auto space-y-3">
        <Card className="p-4 bg-gradient-to-br from-wellness-glow/30 to-primary/20 border-primary/30 shadow-md">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary mb-1">Dica do Dia</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tente passar 30 minutos sem tecnologia hoje. Seu cérebro agradece!
              </p>
            </div>
          </div>
        </Card>
        
        {/* Logout Button */}
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="w-full justify-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
