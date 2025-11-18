import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Trophy, Calendar, Target, TrendingUp, Award, Shield, Star, Flame } from "lucide-react";
import achievementsImg from "@/assets/achievements.jpg";

const achievements = [
  { icon: Trophy, name: "Primeiro Desafio" },
  { icon: Award, name: "7 Dias Consecutivos" },
  { icon: Target, name: "Mestre da Leitura" },
  { icon: Shield, name: "Digital Detox" },
  { icon: Star, name: "Criativo" },
  { icon: Flame, name: "30 Dias sem IA" },
];

const weeklyReport = [
  { day: "Seg", hours: 2 },
  { day: "Ter", hours: 4 },
  { day: "Qua", hours: 1 },
  { day: "Qui", hours: 3 },
  { day: "Sex", hours: 2 },
  { day: "Sáb", hours: 0.5 },
  { day: "Dom", hours: 1 },
];

export default function Profile() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Profile Header */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-primary/20 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="w-24 h-24 ring-4 ring-primary/20">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-white">JD</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-reconnect-green bg-clip-text text-transparent">
                João da Silva
              </h1>
              <p className="text-muted-foreground">@joao_silva</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="gap-1 bg-gradient-to-r from-golden to-primary border-golden/30">
                <Trophy className="w-3 h-3" />
                Nível 7
              </Badge>
              <Badge className="gap-1 bg-gradient-to-r from-coral to-secondary border-coral/30">
                <Flame className="w-3 h-3" />
                12 dias sem IA
              </Badge>
              <Badge className="gap-1 bg-gradient-to-r from-reconnect-green to-primary border-reconnect-green/30">
                <Target className="w-3 h-3" />
                5 desafios ativos
              </Badge>
            </div>

            <Button variant="outline" className="mt-2">Editar Perfil</Button>
          </div>
        </div>
      </Card>

      {/* Level Progress */}
      <Card className="p-6 bg-gradient-to-br from-golden/10 to-primary/10 border-golden/20 shadow-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-golden to-primary bg-clip-text text-transparent">
              Progresso de Nível
            </h2>
            <Badge className="bg-golden/20 text-golden border-golden/30">Nível 7</Badge>
          </div>
          <Progress value={65} className="h-4" />
          <p className="text-sm text-muted-foreground">
            3.250 / 5.000 XP para o próximo nível 🎯
          </p>
        </div>
      </Card>

      {/* Achievements Section */}
      <Card className="p-6 bg-gradient-to-br from-wellness-glow/10 to-golden/10 border-golden/20 shadow-lg overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
            <img src={achievementsImg} alt="Conquistas" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-golden to-primary bg-clip-text text-transparent relative z-10">
            Conquistas Desbloqueadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-golden/20 via-card to-primary/10 border border-golden/30 hover:scale-105 transition-transform shadow-md"
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-golden/30 to-primary/30">
                  <achievement.icon className="w-6 h-6 text-golden" />
                </div>
                <span className="text-sm font-medium text-center">{achievement.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Weekly Digital Usage */}
      <Card className="p-6 bg-gradient-to-br from-reconnect-green/10 to-primary/10 border-reconnect-green/20 shadow-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-reconnect-green to-primary bg-clip-text text-transparent">
              Uso Digital Semanal
            </h2>
            <Badge className="bg-reconnect-green/20 text-reconnect-green border-reconnect-green/30">
              -35% vs semana passada
            </Badge>
          </div>
          
          <div className="flex items-end justify-between gap-3 h-48">
            {weeklyReport.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-reconnect-green to-primary rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${(day.hours / 4) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{day.day}</span>
                <span className="text-xs font-semibold">{day.hours}h</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Excelente! Você está usando menos dispositivos digitais 🎉
          </p>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-calm-blue/10 border-primary/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total de Eventos</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-calm-blue bg-clip-text text-transparent">18</p>
            </div>
            <Calendar className="w-10 h-10 text-primary/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-reconnect-green/10 border-secondary/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Desafios Concluídos</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-secondary to-reconnect-green bg-clip-text text-transparent">23</p>
            </div>
            <Target className="w-10 h-10 text-secondary/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-coral/10 to-accent/10 border-coral/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Sequência Atual</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-coral to-accent bg-clip-text text-transparent">12</p>
            </div>
            <TrendingUp className="w-10 h-10 text-coral/50" />
          </div>
        </Card>
      </div>
    </div>
  );
}
