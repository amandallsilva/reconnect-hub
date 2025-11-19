import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, Trophy, TrendingUp } from "lucide-react";
import heroWellness from "@/assets/hero-wellness.jpg";
import { useData } from "@/contexts/DataContext";

export default function Dashboard() {
  const { profile } = useData();

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Hero Section */}
      <Card className="relative overflow-hidden border-none shadow-xl">
        <div className="relative h-48 md:h-64">
          <img 
            src={heroWellness} 
            alt="Bem-estar digital" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent flex items-center">
            <div className="p-8 space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-wellness-glow/20 text-wellness-glow border-wellness-glow/30">
                  Nível {profile.level}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-reconnect-green bg-clip-text text-transparent">
                Bem-vindo de volta, {profile.name.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Continue sua jornada de reconexão 🌱
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-golden/20 via-card to-primary/10 border-golden/30 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nível Atual</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-golden to-primary bg-clip-text text-transparent">{profile.level}</p>
            </div>
            <Trophy className="w-12 h-12 text-golden" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-coral/20 via-card to-secondary/10 border-coral/30 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dias sem IA</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-coral to-secondary bg-clip-text text-transparent">{profile.daysWithoutAI}</p>
            </div>
            <Flame className="w-12 h-12 text-coral" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/20 via-card to-wellness-glow/10 border-accent/30 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Desafios Ativos</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-accent to-wellness-glow bg-clip-text text-transparent">{profile.activeChallenges}</p>
            </div>
            <Target className="w-12 h-12 text-accent" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-reconnect-green/20 via-card to-primary/10 border-reconnect-green/30 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Progresso Semanal</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-reconnect-green to-primary bg-clip-text text-transparent">78%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-reconnect-green" />
          </div>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Progresso Semanal
            </h2>
            <Badge className="bg-primary/20 text-primary border-primary/30">5/7 dias</Badge>
          </div>
          <Progress value={78} className="h-4 bg-muted" />
          <p className="text-sm text-muted-foreground">
            Continue assim! Você está 28% acima da média esta semana. 🎉
          </p>
        </div>
      </Card>

      {/* Active Challenges */}
      <Card className="p-6 bg-gradient-to-br from-reconnect-green/5 to-calm-blue/5 border-reconnect-green/20 shadow-md">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-reconnect-green to-calm-blue bg-clip-text text-transparent">
          Desafios em Andamento
        </h2>
        <div className="space-y-4">
          {[
            { name: "30 dias sem redes sociais", progress: 40, days: "12/30 dias" },
            { name: "Leitura diária de 20 minutos", progress: 85, days: "6/7 dias" },
            { name: "Meditação matinal", progress: 60, days: "9/15 dias" },
          ].map((challenge, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{challenge.name}</span>
                <span className="text-sm text-muted-foreground">{challenge.days}</span>
              </div>
              <Progress value={challenge.progress} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-primary/20 via-card to-wellness-glow/10 border-primary/30 shadow-md">
          <h3 className="font-semibold mb-2 text-primary">Novo Desafio</h3>
          <p className="text-sm text-muted-foreground">Comece um novo desafio hoje 🎯</p>
        </Card>
        
        <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-secondary/20 via-card to-reconnect-green/10 border-secondary/30 shadow-md">
          <h3 className="font-semibold mb-2 text-secondary">Eventos Próximos</h3>
          <p className="text-sm text-muted-foreground">Veja atividades disponíveis 📅</p>
        </Card>
        
        <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-accent/20 via-card to-coral/10 border-accent/30 shadow-md">
          <h3 className="font-semibold mb-2 text-accent">Relatório Semanal</h3>
          <p className="text-sm text-muted-foreground">Analise seu progresso 📊</p>
        </Card>
      </div>
    </div>
  );
}
