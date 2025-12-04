import { NavLink } from "@/components/NavLink";
import { Home, Calendar, Users, Brain, User, Leaf, Lightbulb, LogOut, Moon, Sun, MessageSquare, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

const navItems = [
  { icon: Home, label: "Início", path: "/dashboard" },
  { icon: Calendar, label: "Desafios", path: "/challenges" },
  { icon: Users, label: "Eventos", path: "/events" },
  { icon: MessageSquare, label: "Comunidade", path: "/community" },
  { icon: Brain, label: "Consciência Digital", path: "/digital-consciousness" },
  { icon: User, label: "Perfil", path: "/profile" },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const { isAdmin, isSpecialist } = useUserRole();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
    onNavigate?.();
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-card via-primary/5 to-secondary/5 border-r border-border flex flex-col lg:fixed left-0 top-0 shadow-lg overflow-y-auto">
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
            onClick={handleNavClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all"
            activeClassName="bg-gradient-to-r from-primary/15 to-secondary/15 text-primary font-semibold shadow-sm"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        {/* Admin Link - only for specialists/admins */}
        {(isAdmin || isSpecialist) && (
          <>
            <Separator className="my-2" />
            <NavLink
              to="/admin"
              onClick={handleNavClick}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all"
              activeClassName="bg-gradient-to-r from-primary/15 to-secondary/15 text-primary font-semibold shadow-sm"
            >
              <Shield className="w-5 h-5" />
              <span>Painel Admin</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Theme Toggle, Daily Tip & Logout */}
      <div className="p-4 mt-auto space-y-3">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/50">
          <div className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-primary" />
            ) : (
              <Sun className="w-4 h-4 text-primary" />
            )}
            <span className="text-sm font-medium">
              {theme === "dark" ? "Modo Escuro" : "Modo Claro"}
            </span>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            className="data-[state=checked]:bg-primary"
          />
        </div>

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
