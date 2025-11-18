import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, Trophy, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Bem-vindo de volta, João!</h1>
        <p className="text-muted-foreground">Continue sua jornada de reconexão</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nível Atual</p>
              <p className="text-3xl font-bold text-primary">7</p>
            </div>
            <Trophy className="w-10 h-10 text-primary/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-secondary/5 border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dias sem IA</p>
              <p className="text-3xl font-bold text-secondary">12</p>
            </div>
            <Flame className="w-10 h-10 text-secondary/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-accent/5 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Desafios Ativos</p>
              <p className="text-3xl font-bold text-accent">5</p>
            </div>
            <Target className="w-10 h-10 text-accent/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-reconnect-green/5 border-reconnect-green/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Progresso Semanal</p>
              <p className="text-3xl font-bold text-reconnect-green">78%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-reconnect-green/50" />
          </div>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Progresso Semanal</h2>
            <Badge variant="secondary">5/7 dias</Badge>
          </div>
          <Progress value={78} className="h-3" />
          <p className="text-sm text-muted-foreground">
            Continue assim! Você está 28% acima da média esta semana.
          </p>
        </div>
      </Card>

      {/* Active Challenges */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Desafios em Andamento</h2>
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
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-primary/5 to-transparent">
          <h3 className="font-semibold mb-2">Novo Desafio</h3>
          <p className="text-sm text-muted-foreground">Comece um novo desafio hoje</p>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-secondary/5 to-transparent">
          <h3 className="font-semibold mb-2">Eventos Próximos</h3>
          <p className="text-sm text-muted-foreground">Veja atividades disponíveis</p>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-accent/5 to-transparent">
          <h3 className="font-semibold mb-2">Relatório Semanal</h3>
          <p className="text-sm text-muted-foreground">Analise seu progresso</p>
        </Card>
      </div>
    </div>
  );
}
