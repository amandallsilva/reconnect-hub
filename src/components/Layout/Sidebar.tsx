import { Home, Calendar, Users, Brain, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { icon: Home, label: "Início", path: "/dashboard" },
  { icon: Calendar, label: "Desafios", path: "/challenges" },
  { icon: Users, label: "Eventos", path: "/events" },
  { icon: Brain, label: "Consciência Digital", path: "/digital-consciousness" },
  { icon: User, label: "Perfil", path: "/profile" },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ReConectar
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Reconecte-se com você</p>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all"
            activeClassName="bg-primary/10 text-primary font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4">
          <p className="text-sm font-medium mb-1">Dica do dia</p>
          <p className="text-xs text-muted-foreground">
            Tente fazer uma pausa de 10 minutos longe das telas hoje.
          </p>
        </div>
      </div>
    </aside>
  );
}
