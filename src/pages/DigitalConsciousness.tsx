import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";

const insights = [
  {
    icon: TrendingDown,
    title: "Redução de 35% no uso de telas",
    description: "Comparado ao mês passado, você está usando menos dispositivos.",
    color: "secondary"
  },
  {
    icon: CheckCircle2,
    title: "Hábitos saudáveis em alta",
    description: "Você completou 85% das suas metas de bem-estar esta semana.",
    color: "reconnect-green"
  },
  {
    icon: AlertTriangle,
    title: "Pico de uso à noite",
    description: "Tente reduzir o uso de telas após 22h para melhor sono.",
    color: "destructive"
  }
];

const tips = [
  "Defina horários específicos para checar mensagens",
  "Use modo avião durante refeições",
  "Crie uma rotina matinal sem celular",
  "Pratique a regra 20-20-20 para descansar os olhos",
  "Reserve um dia por semana para digital detox"
];

const weeklyGoals = [
  { goal: "Menos de 2h de telas/dia", progress: 70, status: "Em progresso" },
  { goal: "Zero uso de IA generativa", progress: 100, status: "Completo" },
  { goal: "3 atividades offline/semana", progress: 66, status: "Em progresso" }
];

export default function DigitalConsciousness() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Consciência Digital</h1>
        <p className="text-muted-foreground">
          Entenda e melhore sua relação com a tecnologia
        </p>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, idx) => (
          <Card key={idx} className={`p-6 border-${insight.color}/30 bg-${insight.color}/5`}>
            <div className="space-y-3">
              <insight.icon className={`w-8 h-8 text-${insight.color}`} />
              <h3 className="font-semibold">{insight.title}</h3>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Goals */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Metas Semanais</h2>
        </div>
        <div className="space-y-4">
          {weeklyGoals.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.goal}</span>
                <Badge variant={item.progress === 100 ? "default" : "secondary"}>
                  {item.status}
                </Badge>
              </div>
              <Progress value={item.progress} className="h-3" />
            </div>
          ))}
        </div>
      </Card>

      {/* Tips & Strategies */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-semibold">Dicas para Consciência Digital</h2>
        </div>
        <ul className="space-y-3">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Configurar Limites de Tempo</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Defina limites de uso para aplicativos específicos
          </p>
          <Button className="w-full bg-accent hover:bg-accent/90">
            Configurar Agora
          </Button>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Relatório Detalhado</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Veja análises completas do seu uso digital
          </p>
          <Button variant="outline" className="w-full">
            Ver Relatório
          </Button>
        </Card>
      </div>
    </div>
  );
}
