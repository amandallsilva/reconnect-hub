import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Lightbulb, TrendingDown, AlertTriangle, CheckCircle2, Clock, BarChart3, Instagram, Video, Youtube, Twitter, MessageCircle, Smartphone, Save, TrendingUp, Calendar, Award, Zap } from "lucide-react";
import { useDigitalWellness } from "@/hooks/useDigitalWellness";
import { useState } from "react";
import { toast } from "sonner";

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

const iconMap: Record<string, any> = {
  Instagram,
  Video,
  Youtube,
  Twitter,
  MessageCircle,
  Smartphone
};

export default function DigitalConsciousness() {
  const { appLimits, usageData, updateAppLimit, getWeeklyReport } = useDigitalWellness();
  const [limitsDialogOpen, setLimitsDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [editingLimits, setEditingLimits] = useState<Record<string, number>>({});
  
  const weeklyReport = getWeeklyReport();

  const handleSaveLimits = () => {
    Object.entries(editingLimits).forEach(([appId, limit]) => {
      updateAppLimit(appId, limit);
    });
    setLimitsDialogOpen(false);
    setEditingLimits({});
    toast.success("⏰ Limites Atualizados!", {
      description: "Seus novos limites de tempo foram salvos com sucesso!"
    });
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-reconnect-green bg-clip-text text-transparent">
          Consciência Digital
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
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
        <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-accent/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-coral/20">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg">Configurar Limites de Tempo</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Defina limites de uso para aplicativos específicos
          </p>
          <Button 
            className="w-full bg-gradient-to-r from-accent to-coral hover:from-accent/90 hover:to-coral/90 text-white"
            onClick={() => setLimitsDialogOpen(true)}
          >
            <Clock className="w-4 h-4 mr-2" />
            Configurar Agora
          </Button>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Relatório Detalhado</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Veja análises completas do seu uso digital
          </p>
          <Button 
            variant="outline" 
            className="w-full border-primary/30 hover:bg-primary/10"
            onClick={() => setReportDialogOpen(true)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Ver Relatório
          </Button>
        </Card>
      </div>

      {/* Dialog Limites de Tempo */}
      <Dialog open={limitsDialogOpen} onOpenChange={setLimitsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Clock className="w-6 h-6 text-accent" />
              Configurar Limites de Tempo
            </DialogTitle>
            <DialogDescription>
              Defina quanto tempo você deseja usar cada aplicativo por dia
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {appLimits.map(app => {
              const Icon = iconMap[app.icon] || Smartphone;
              const limitValue = editingLimits[app.id] ?? app.dailyLimit;
              const isOverLimit = app.currentUsage > app.dailyLimit;
              const usagePercent = (app.currentUsage / app.dailyLimit) * 100;

              return (
                <div key={app.id} className="p-4 rounded-xl border bg-card space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{app.name}</h4>
                          <p className="text-xs text-muted-foreground capitalize">
                            {app.category}
                          </p>
                        </div>
                        <Badge variant={isOverLimit ? "destructive" : "secondary"}>
                          {formatMinutes(app.currentUsage)} / {formatMinutes(app.dailyLimit)}
                        </Badge>
                      </div>
                      
                      <Progress 
                        value={Math.min(usagePercent, 100)} 
                        className={`h-2 ${isOverLimit ? '[&>div]:bg-destructive' : ''}`}
                      />
                      
                      <div className="flex items-center gap-3">
                        <Label htmlFor={`limit-${app.id}`} className="text-sm whitespace-nowrap">
                          Limite diário:
                        </Label>
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            id={`limit-${app.id}`}
                            type="number"
                            min="5"
                            max="480"
                            step="5"
                            value={limitValue}
                            onChange={(e) => setEditingLimits(prev => ({
                              ...prev,
                              [app.id]: parseInt(e.target.value) || 0
                            }))}
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground">minutos</span>
                          <span className="text-sm text-muted-foreground ml-auto">
                            ({formatMinutes(limitValue)})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setLimitsDialogOpen(false);
                setEditingLimits({});
              }}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-accent to-coral hover:from-accent/90 hover:to-coral/90 text-white"
              onClick={handleSaveLimits}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Limites
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Relatório Detalhado */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <BarChart3 className="w-6 h-6 text-primary" />
              Relatório Semanal de Uso Digital
            </DialogTitle>
            <DialogDescription>
              Análise completa do seu comportamento digital nos últimos 7 dias
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="details">Detalhes por App</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Cards de Métricas */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/20">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tempo Total</p>
                      <p className="text-2xl font-bold">{formatMinutes(weeklyReport.totalScreenTime)}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-secondary/20">
                      <TrendingDown className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Média Diária</p>
                      <p className="text-2xl font-bold">{formatMinutes(weeklyReport.averageDaily)}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-reconnect-green/10 to-reconnect-green/5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-reconnect-green/20">
                      <Award className="w-6 h-6 text-reconnect-green" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sequência</p>
                      <p className="text-2xl font-bold">{weeklyReport.streak} dias</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-golden/10 to-golden/5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-golden/20">
                      <TrendingUp className="w-6 h-6 text-golden" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Melhoria</p>
                      <p className="text-2xl font-bold">{weeklyReport.improvement > 0 ? '+' : ''}{weeklyReport.improvement}%</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Insights */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Insights da Semana
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="w-5 h-5 text-reconnect-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">App Mais Utilizado</p>
                      <p className="text-sm text-muted-foreground">{weeklyReport.mostUsedApp}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Melhor Dia</p>
                      <p className="text-sm text-muted-foreground capitalize">{weeklyReport.leastUsedDay}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <TrendingUp className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Progresso</p>
                      <p className="text-sm text-muted-foreground">
                        {weeklyReport.improvement > 0 
                          ? `Você reduziu ${weeklyReport.improvement}% do tempo de tela!` 
                          : `Continue tentando melhorar seu uso digital`}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Uso por Dia */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Uso Diário (últimos 7 dias)</h3>
                <div className="space-y-2">
                  {usageData.slice(-7).map(day => {
                    const date = new Date(day.date);
                    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                    const percent = (day.totalMinutes / (24 * 60)) * 100;
                    
                    return (
                      <div key={day.date} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize font-medium">{dayName}</span>
                          <span className="text-muted-foreground">{formatMinutes(day.totalMinutes)}</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-3 mt-4">
              {appLimits.map(app => {
                const Icon = iconMap[app.icon] || Smartphone;
                const weekTotal = usageData.slice(-7).reduce((sum, day) => {
                  const appUsage = day.appsUsage.find(u => u.appId === app.id);
                  return sum + (appUsage?.minutes || 0);
                }, 0);
                const dailyAvg = Math.round(weekTotal / 7);
                const isOverLimit = dailyAvg > app.dailyLimit;

                return (
                  <Card key={app.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-xl ${isOverLimit ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                        <Icon className={`w-6 h-6 ${isOverLimit ? 'text-destructive' : 'text-primary'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{app.name}</h4>
                          <Badge variant={isOverLimit ? "destructive" : "secondary"}>
                            {isOverLimit ? "Acima do limite" : "Dentro do limite"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total semanal:</span>
                            <span className="font-medium">{formatMinutes(weekTotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Média diária:</span>
                            <span className="font-medium">{formatMinutes(dailyAvg)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Limite configurado:</span>
                            <span className="font-medium">{formatMinutes(app.dailyLimit)}</span>
                          </div>
                          <Progress 
                            value={(dailyAvg / app.dailyLimit) * 100} 
                            className={`h-2 ${isOverLimit ? '[&>div]:bg-destructive' : ''}`}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
