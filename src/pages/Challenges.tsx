import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, BookOpen, Moon, Coffee, Smartphone, CheckCircle2, Calendar } from "lucide-react";
import { useChallenges } from "@/hooks/useChallenges";
import { useState } from "react";

const completedChallenges = [
  { title: "7 dias sem fast food", completedAt: "10 Jan 2025", xp: 500 },
  { title: "Escrever diário por 14 dias", completedAt: "05 Jan 2025", xp: 800 },
  { title: "Caminhada diária", completedAt: "28 Dez 2024", xp: 600 },
];

const popularChallenges = [
  { title: "Desafio 90 dias sem IA", difficulty: "Difícil", participants: "2.5k", icon: Target },
  { title: "Café da manhã consciente", difficulty: "Fácil", participants: "8.3k", icon: Coffee },
  { title: "Leitura de 1 livro/mês", difficulty: "Médio", participants: "5.1k", icon: BookOpen },
];

const iconMap = {
  Smartphone,
  BookOpen,
  Moon,
};

export default function Challenges() {
  const { challenges, toggleDayCompletion } = useChallenges();
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Target;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-reconnect-green bg-clip-text text-transparent">
          Seus Desafios
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete desafios diários e evolua na sua jornada 🎯
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50">
          <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Ativos
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
            Concluídos
          </TabsTrigger>
          <TabsTrigger value="discover" className="data-[state=active]:bg-accent data-[state=active]:text-white">
            Descobrir
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {challenges.map((challenge) => {
            const Icon = getIcon(challenge.icon);
            const isExpanded = expandedChallenge === challenge.id;

            return (
              <Card key={challenge.id} className="overflow-hidden bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 shadow-sm">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-xl mb-1">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            🏆 {challenge.reward}
                          </p>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {challenge.days}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <Progress value={challenge.progress} className="h-3" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-medium">
                            {challenge.progress}% completo
                          </span>
                          <Button 
                            variant="link" 
                            className="h-auto p-0 text-primary"
                            onClick={() => setExpandedChallenge(isExpanded ? null : challenge.id)}
                          >
                            {isExpanded ? "Ocultar dias" : "Ver todos os dias"}
                          </Button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold">Marque os dias cumpridos</span>
                          </div>
                          <div className="grid grid-cols-7 gap-2">
                            {challenge.dailyTasks.map((task, idx) => (
                              <div 
                                key={task.date}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <span className="text-xs text-muted-foreground font-medium">
                                  Dia {idx + 1}
                                </span>
                                <Checkbox
                                  checked={task.completed}
                                  onCheckedChange={() => toggleDayCompletion(challenge.id, task.date)}
                                  className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(task.date)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedChallenges.map((challenge, idx) => (
            <Card key={idx} className="p-6 border-secondary/30 bg-gradient-to-br from-secondary/10 to-reconnect-green/10 shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-secondary/30 to-reconnect-green/30">
                  <CheckCircle2 className="w-10 h-10 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Concluído em {challenge.completedAt}
                  </p>
                </div>
                <Badge className="bg-golden/20 text-golden border-golden/30 px-4 py-2">
                  +{challenge.xp} XP
                </Badge>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularChallenges.map((challenge, idx) => (
              <Card key={idx} className="p-6 hover:shadow-xl hover:scale-105 transition-all bg-gradient-to-br from-card to-accent/5 border-accent/20">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-coral/20">
                    <challenge.icon className="w-8 h-8 text-accent" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-accent/30">
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-primary/30">
                          👥 {challenge.participants} participantes
                        </Badge>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-accent to-coral hover:from-accent/90 hover:to-coral/90 text-white shadow-md">
                      Começar Desafio
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
