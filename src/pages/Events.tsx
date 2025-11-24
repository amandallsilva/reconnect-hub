import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Palette, BookOpen, Music, Coffee, Camera, Heart } from "lucide-react";
import workshopImg from "@/assets/workshop.jpg";
import detoxImg from "@/assets/digital-detox.jpg";

const events = [
  {
    title: "Oficina de Pintura em Aquarela",
    subtitle: "Reduz estresse • Estimula criatividade",
    location: "Espaço Cultural - Centro",
    date: "Sáb, 15 Dez • 14:00",
    category: "Arte",
    icon: Palette,
    attendees: 12,
    image: workshopImg,
  },
  {
    title: "Feira Acadêmica de Ciências",
    subtitle: "Networking • Aprendizado • Inovação",
    location: "Campus Universitário",
    date: "Qui, 20 Dez • 09:00",
    category: "Educação",
    icon: BookOpen,
    attendees: 45,
  },
  {
    title: "Digital Detox no Parque",
    subtitle: "Melhora foco • Aumenta bem-estar",
    location: "Parque das Árvores",
    date: "Dom, 16 Dez • 09:00",
    category: "Bem-estar",
    icon: Heart,
    attendees: 25,
    image: detoxImg,
  },
  {
    title: "Curso de Fotografia Analógica",
    subtitle: "Criatividade • Técnica • Expressão",
    location: "Estúdio Luz Natural",
    date: "Sex, 21 Dez • 18:00",
    category: "Arte",
    icon: Camera,
    attendees: 8,
  },
  {
    title: "Roda de Violão ao Pôr do Sol",
    subtitle: "Conexão social • Música • Relaxamento",
    location: "Praça da Fonte",
    date: "Sáb, 22 Dez • 17:30",
    category: "Cultura",
    icon: Music,
    attendees: 20,
  },
  {
    title: "Café Filosófico",
    subtitle: "Reflexão • Debate • Consciência",
    location: "Café do Centro",
    date: "Qua, 19 Dez • 19:00",
    category: "Cultura",
    icon: Coffee,
    attendees: 15,
  },
];

export default function Events() {
  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-6xl">
      {/* Header */}
      <div className="space-y-2 sm:space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-reconnect-green bg-clip-text text-transparent">
          Eventos & Atividades
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">Reconecte-se através de experiências reais 🌟</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Badge className="cursor-pointer bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 text-xs sm:text-sm">Todos</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted text-xs sm:text-sm">Arte</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted text-xs sm:text-sm">Educação</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted text-xs sm:text-sm">Bem-estar</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted text-xs sm:text-sm">Cultura</Badge>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {events.map((event, idx) => (
          <Card key={idx} className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all bg-gradient-to-br from-card to-primary/5 border-primary/20">
            {event.image && (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-card/90 backdrop-blur-sm">{event.category}</Badge>
                </div>
              </div>
            )}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                    <event.icon className="w-6 h-6 text-primary" />
                  </div>
                  {!event.image && <Badge variant="secondary">{event.category}</Badge>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.subtitle}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-reconnect-green" />
                  <span>{event.attendees} participantes</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md">
                Participar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
