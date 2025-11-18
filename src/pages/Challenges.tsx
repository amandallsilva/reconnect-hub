import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, BookOpen, Moon, Coffee, Smartphone, CheckCircle2 } from "lucide-react";

const activeChallenges = [
  { 
    title: "30 dias sem redes sociais", 
    progress: 40, 
    days: "12/30 dias",
    icon: Smartphone,
    reward: "Medalha Bronze + 500 XP"
  },
  { 
    title: "Leitura diária de 20 minutos", 
    progress: 85, 
    days: "6/7 dias",
    icon: BookOpen,
    reward: "Medalha Ouro + 1000 XP"
  },
  { 
    title: "Meditação matinal", 
    progress: 60, 
    days: "9/15 dias",
    icon: Moon,
    reward: "Medalha Prata + 750 XP"
  },
];

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

export default function Challenges() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Desafios</h1>
        <p className="text-muted-foreground">
          Complete desafios e evolua na sua jornada de reconexão
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
          <TabsTrigger value="discover">Descobrir</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeChallenges.map((challenge, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-primary/10">
                  <challenge.icon className="w-8 h-8 text-primary" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Recompensa: {challenge.reward}
                      </p>
                    </div>
                    <Badge variant="secondary">{challenge.days}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={challenge.progress} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{challenge.progress}% completo</span>
                      <Button variant="link" className="h-auto p-0">Ver detalhes</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedChallenges.map((challenge, idx) => (
            <Card key={idx} className="p-6 border-secondary/30 bg-secondary/5">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-10 h-10 text-secondary" />
                <div className="flex-1">
                  <h3 className="font-semibold">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Concluído em {challenge.completedAt}
                  </p>
                </div>
                <Badge className="bg-secondary">{challenge.xp} XP</Badge>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularChallenges.map((challenge, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-2xl bg-accent/10">
                      <challenge.icon className="w-7 h-7 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{challenge.title}</h3>
                      <div className="flex gap-2 items-center text-sm text-muted-foreground">
                        <Badge variant="outline">{challenge.difficulty}</Badge>
                        <span>•</span>
                        <span>{challenge.participants} participantes</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90">
                    Começar Desafio
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
