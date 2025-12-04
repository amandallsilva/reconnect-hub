import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Flame, Target, Trophy, TrendingUp, ArrowRight, Calendar, 
  MapPin, Users, Sparkles, Heart, MessageCircle, Clock,
  Palette, BookOpen, Music, Coffee, Camera, Zap
} from "lucide-react";
import heroWellness from "@/assets/hero-wellness.jpg";
import workshopImg from "@/assets/workshop.jpg";
import detoxImg from "@/assets/digital-detox.jpg";
import { useData } from "@/contexts/DataContext";
import { useCommunity } from "@/hooks/useCommunity";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const featuredEvents = [
  {
    title: "Oficina de Pintura em Aquarela",
    subtitle: "Reduz estresse • Estimula criatividade",
    location: "Espaço Cultural - Centro",
    date: "Sáb, 15 Dez • 14:00",
    category: "Arte",
    icon: Palette,
    attendees: 12,
    spotsLeft: 3,
    image: workshopImg,
  },
  {
    title: "Digital Detox no Parque",
    subtitle: "Melhora foco • Aumenta bem-estar",
    location: "Parque das Árvores",
    date: "Dom, 16 Dez • 09:00",
    category: "Bem-estar",
    icon: Heart,
    attendees: 25,
    spotsLeft: 5,
    image: detoxImg,
  },
  {
    title: "Roda de Violão ao Pôr do Sol",
    subtitle: "Conexão social • Música • Relaxamento",
    location: "Praça da Fonte",
    date: "Sáb, 22 Dez • 17:30",
    category: "Cultura",
    icon: Music,
    attendees: 20,
    spotsLeft: 10,
  },
];

const featuredChallenges = [
  {
    id: "1",
    title: "7 Dias Sem Redes Sociais",
    description: "Recupere seu foco e clareza mental",
    duration: "7 dias",
    reward: "+150 XP",
    participants: 234,
    difficulty: "Fácil",
    icon: Zap,
  },
  {
    id: "2", 
    title: "Leitura Diária de 20 Minutos",
    description: "Expanda sua mente, um capítulo por vez",
    duration: "30 dias",
    reward: "+500 XP",
    participants: 189,
    difficulty: "Médio",
    icon: BookOpen,
  },
  {
    id: "3",
    title: "Café Sem Celular",
    description: "Saboreie momentos de presença plena",
    duration: "14 dias",
    reward: "+200 XP",
    participants: 312,
    difficulty: "Fácil",
    icon: Coffee,
  },
];

export default function Dashboard() {
  const { profile, loading } = useData();
  const { posts, loading: postsLoading } = useCommunity();
  const navigate = useNavigate();

  // Get only specialist posts
  const specialistPosts = posts.filter(p => p.is_specialist).slice(0, 3);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-6xl">
      {/* Hero Section - Emotional Welcome */}
      <Card className="relative overflow-hidden border-none shadow-xl">
        <div className="relative h-44 sm:h-52 md:h-64">
          <img 
            src={heroWellness} 
            alt="Bem-estar digital" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-transparent flex items-center">
            <div className="p-4 sm:p-8 space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-wellness-glow/20 text-wellness-glow border-wellness-glow/30 text-xs sm:text-sm animate-pulse">
                  🔥 {profile.daysWithoutAI} dias de reconexão
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-reconnect-green bg-clip-text text-transparent">
                E aí, {profile.name.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                Cada dia longe das telas é um passo rumo à sua melhor versão. <br className="hidden sm:block" />
                <span className="font-medium text-foreground">Você está no caminho certo.</span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats - Social Proof */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-golden/20 via-card to-primary/10 border-golden/30 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Seu Nível</p>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-golden to-primary bg-clip-text text-transparent">{profile.level}</p>
              <p className="text-xs text-muted-foreground mt-1">Top 15% dos usuários</p>
            </div>
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-golden" />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-coral/20 via-card to-secondary/10 border-coral/30 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Dias de Foco</p>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-coral to-secondary bg-clip-text text-transparent">{profile.daysWithoutAI}</p>
              <p className="text-xs text-muted-foreground mt-1">Continue assim! 🔥</p>
            </div>
            <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-coral" />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-accent/20 via-card to-wellness-glow/10 border-accent/30 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Desafios Ativos</p>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-accent to-wellness-glow bg-clip-text text-transparent">{profile.activeChallenges}</p>
              <p className="text-xs text-muted-foreground mt-1">Em andamento</p>
            </div>
            <Target className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-reconnect-green/20 via-card to-primary/10 border-reconnect-green/30 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Progresso Semanal</p>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-reconnect-green to-primary bg-clip-text text-transparent">78%</p>
              <p className="text-xs text-muted-foreground mt-1">+28% vs semana passada</p>
            </div>
            <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-reconnect-green" />
          </div>
        </Card>
      </div>

      {/* Featured Events - Urgency & Scarcity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              🎯 Eventos Imperdíveis
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Experiências reais que transformam. <span className="text-coral font-medium">Vagas limitadas!</span>
            </p>
          </div>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/80"
            onClick={() => navigate('/events')}
          >
            Ver todos <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredEvents.map((event, idx) => (
            <Card 
              key={idx} 
              className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-card to-primary/5 border-primary/20"
              onClick={() => navigate('/events')}
            >
              {event.image && (
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-coral/90 text-white border-none text-xs">
                      {event.spotsLeft} vagas!
                    </Badge>
                  </div>
                </div>
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 shrink-0">
                    <event.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{event.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-secondary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-reconnect-green" />
                    <span>{event.attendees} já confirmaram</span>
                  </div>
                </div>

                <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white text-xs">
                  Garantir Vaga
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Specialist Posts - Authority & Trust */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-secondary to-reconnect-green bg-clip-text text-transparent">
              💡 Direto dos Especialistas
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Insights exclusivos de quem entende do assunto
            </p>
          </div>
          <Button 
            variant="ghost" 
            className="text-secondary hover:text-secondary/80"
            onClick={() => navigate('/community')}
          >
            Ver comunidade <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {postsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : specialistPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {specialistPosts.map((post) => (
              <Card 
                key={post.id} 
                className="p-4 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-card to-secondary/5 border-secondary/20 group"
                onClick={() => navigate('/community')}
              >
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-10 w-10 ring-2 ring-golden/50">
                    <AvatarImage src={post.author.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-golden to-secondary text-white text-sm">
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{post.author.name}</span>
                      <Badge className="bg-golden/20 text-golden border-golden/30 text-[10px] px-1.5 py-0">
                        Especialista
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-3 group-hover:text-foreground transition-colors">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-coral" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Comentar</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center bg-gradient-to-br from-card to-secondary/5 border-secondary/20">
            <Sparkles className="w-12 h-12 mx-auto text-secondary/50 mb-3" />
            <h3 className="font-semibold mb-1">Em breve!</h3>
            <p className="text-sm text-muted-foreground">
              Os especialistas estão preparando conteúdos incríveis para você.
            </p>
          </Card>
        )}
      </section>

      {/* New Challenges - Call to Action */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-reconnect-green to-calm-blue bg-clip-text text-transparent">
              🚀 Desafios Para Você
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Transforme hábitos em conquistas. <span className="text-reconnect-green font-medium">Comece agora!</span>
            </p>
          </div>
          <Button 
            variant="ghost" 
            className="text-reconnect-green hover:text-reconnect-green/80"
            onClick={() => navigate('/challenges')}
          >
            Ver todos <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredChallenges.map((challenge) => (
            <Card 
              key={challenge.id} 
              className="p-5 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-card to-reconnect-green/5 border-reconnect-green/20 group"
              onClick={() => navigate('/challenges')}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-reconnect-green/20 to-calm-blue/20 group-hover:scale-110 transition-transform">
                  <challenge.icon className="w-5 h-5 text-reconnect-green" />
                </div>
                <div>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 mb-1">
                    {challenge.difficulty}
                  </Badge>
                  <h3 className="font-semibold text-sm">{challenge.title}</h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {challenge.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{challenge.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>{challenge.participants} participantes</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className="bg-reconnect-green/20 text-reconnect-green border-reconnect-green/30 text-xs">
                  {challenge.reward}
                </Badge>
                <Button size="sm" variant="outline" className="text-xs border-reconnect-green/30 text-reconnect-green hover:bg-reconnect-green/10">
                  Começar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Weekly Progress - Motivation */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-primary/20 shadow-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Seu Progresso Semanal
              </h2>
              <p className="text-sm text-muted-foreground">Você está arrasando! 🎉</p>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30">5/7 dias</Badge>
          </div>
          <Progress value={78} className="h-4 bg-muted" />
          <p className="text-sm text-muted-foreground">
            Você está <span className="font-medium text-reconnect-green">28% acima</span> da média da comunidade esta semana. 
            Continue assim para desbloquear recompensas especiais!
          </p>
        </div>
      </Card>
    </div>
  );
}
