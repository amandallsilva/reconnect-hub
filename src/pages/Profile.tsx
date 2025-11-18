import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Award, Target, Flame, BarChart3, Smartphone } from "lucide-react";

const achievements = [
  { icon: Trophy, title: "Primeiro Desafio", color: "primary" },
  { icon: Award, title: "7 Dias Streak", color: "secondary" },
  { icon: Target, title: "Mestre da Leitura", color: "accent" },
  { icon: Flame, title: "30 Dias sem IA", color: "reconnect-green" },
];

const weeklyReport = [
  { day: "Seg", usage: 45 },
  { day: "Ter", usage: 120 },
  { day: "Qua", usage: 30 },
  { day: "Qui", usage: 90 },
  { day: "Sex", usage: 60 },
  { day: "Sáb", usage: 15 },
  { day: "Dom", usage: 20 },
];

const blockedApps = [
  { name: "Instagram", hours: "Bloqueado 22h-8h" },
  { name: "TikTok", hours: "Bloqueado 20h-9h" },
  { name: "Twitter", hours: "Bloqueado 23h-7h" },
];

export default function Profile() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Profile Header */}
      <Card className="p-8 bg-gradient-to-br from-card to-primary/5">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">JD</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h1 className="text-2xl font-bold">João da Silva</h1>
              <p className="text-muted-foreground">@joaosilva</p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">7</p>
                <p className="text-sm text-muted-foreground">Nível</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">12</p>
                <p className="text-sm text-muted-foreground">Dias sem IA</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">18</p>
                <p className="text-sm text-muted-foreground">Atividades</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Level Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Progresso de Nível</h2>
            <Badge className="bg-primary">Nível 7</Badge>
          </div>
          <Progress value={65} className="h-3" />
          <p className="text-sm text-muted-foreground">
            3.250 / 5.000 XP para o próximo nível
          </p>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Conquistas Desbloqueadas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={`p-4 rounded-full bg-${achievement.color}/10`}>
                <achievement.icon className={`w-8 h-8 text-${achievement.color}`} />
              </div>
              <p className="text-sm font-medium text-center">{achievement.title}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Digital Usage */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Uso Digital Semanal</h2>
        </div>
        <div className="flex items-end justify-between gap-2 h-48">
          {weeklyReport.map((data, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors"
                style={{ height: `${(data.usage / 120) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Média semanal: 54 minutos/dia • 62% melhor que semana passada
        </p>
      </Card>

      {/* Blocked Apps */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold">Apps com Limites Definidos</h2>
        </div>
        <div className="space-y-3">
          {blockedApps.map((app, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="font-medium">{app.name}</span>
              <Badge variant="outline">{app.hours}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
