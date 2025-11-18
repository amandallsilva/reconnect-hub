import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Palette, BookOpen, Coffee, Music } from "lucide-react";

const events = [
  {
    title: "Oficina de Pintura",
    subtitle: "Reduz estresse • Estimula criatividade",
    location: "Centro Cultural, Sala 3",
    date: "15 de Jan, 14h",
    icon: Palette,
    color: "primary",
    spots: "8 vagas"
  },
  {
    title: "Feira Acadêmica",
    subtitle: "Networking • Aprendizado",
    location: "Campus Principal",
    date: "18 de Jan, 10h",
    icon: BookOpen,
    color: "secondary",
    spots: "Ilimitado"
  },
  {
    title: "Curso de Inglês",
    subtitle: "Desenvolvimento pessoal • Comunicação",
    location: "Online",
    date: "20 de Jan, 19h",
    icon: Users,
    color: "accent",
    spots: "12 vagas"
  },
  {
    title: "Digital Detox Weekend",
    subtitle: "Desconexão • Bem-estar mental",
    location: "Retiro Natural, Serra",
    date: "25-27 de Jan",
    icon: Coffee,
    color: "reconnect-green",
    spots: "5 vagas"
  },
  {
    title: "Roda de Violão",
    subtitle: "Expressão artística • Conexão social",
    location: "Parque da Cidade",
    date: "22 de Jan, 16h",
    icon: Music,
    color: "primary",
    spots: "Livre"
  }
];

export default function Events() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Eventos & Atividades</h1>
        <p className="text-muted-foreground">
          Participe de atividades que estimulam criatividade e conexões reais
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Todos</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Criatividade</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Aprendizado</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Bem-estar</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Social</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, idx) => (
          <Card 
            key={idx} 
            className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl bg-${event.color}/10`}>
                <event.icon className={`w-8 h-8 text-${event.color}`} />
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.subtitle}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{event.spots}</Badge>
                  </div>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90">
                  Participar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
