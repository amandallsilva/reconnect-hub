import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Trophy, Calendar, Target, TrendingUp, Award, Shield, Star, Flame, Edit2, Save, X, Camera, Upload } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
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
  const { profile, updateProfile, loading } = useData();
  const { isSpecialist, isAdmin } = useUserRole();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar editedProfile com profile quando profile mudar
  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleSave = async () => {
    await updateProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Perfil atualizado! ✨",
      description: "Suas informações foram salvas com sucesso"
    });
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      sonnerToast.error("Arquivo muito grande", {
        description: "A imagem deve ter no máximo 2MB"
      });
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      sonnerToast.error("Formato inválido", {
        description: "Apenas imagens são permitidas"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setEditedProfile({ ...editedProfile, avatar: base64String });
      sonnerToast.success("Foto carregada!", {
        description: "Clique em Salvar para aplicar as mudanças"
      });
    };
    reader.readAsDataURL(file);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-6xl">
      {/* Profile Header */}
      <Card className="p-4 sm:p-8 bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-primary/20 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
          <div className="relative mx-auto md:mx-0">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-primary/20">
              <AvatarImage src={isEditing ? editedProfile.avatar : profile.avatar} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-white">
                {getInitials(isEditing ? editedProfile.name : profile.name)}
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 shadow-lg bg-primary hover:bg-primary/90 text-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-5 h-5" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="flex-1 space-y-4 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Upload className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Foto de Perfil</p>
                      <p className="text-xs text-muted-foreground">
                        Clique no ícone da câmera para alterar
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de usuário</Label>
                    <Input
                      id="username"
                      value={editedProfile.username}
                      onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                      className="border-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editedProfile.bio || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    className="border-primary/20 min-h-[80px]"
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-reconnect-green bg-clip-text text-transparent">
                      {profile.name}
                    </h1>
                    {(isSpecialist || isAdmin) && (
                      <Badge className="bg-primary text-primary-foreground gap-1">
                        <Shield className="w-3 h-3" />
                        {isAdmin ? 'Admin' : 'Especialista'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="gap-1 bg-gradient-to-r from-golden to-primary border-golden/30">
                    <Trophy className="w-3 h-3" />
                    Nível {profile.level}
                  </Badge>
                  <Badge className="gap-1 bg-gradient-to-r from-coral to-secondary border-coral/30">
                    <Flame className="w-3 h-3" />
                    {profile.daysWithoutAI} dias sem IA
                  </Badge>
                  <Badge className="gap-1 bg-gradient-to-r from-reconnect-green to-primary border-reconnect-green/30">
                    <Target className="w-3 h-3" />
                    {profile.activeChallenges} desafios ativos
                  </Badge>
                </div>

                <Button onClick={() => setIsEditing(true)} variant="outline" className="mt-2">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </>
            )}
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
            <Badge className="bg-golden/20 text-golden border-golden/30">Nível {profile.level}</Badge>
          </div>
          <Progress value={(profile.xp % 5000) / 50} className="h-4" />
          <p className="text-sm text-muted-foreground">
            {profile.xp} / {(profile.level + 1) * 5000} XP para o próximo nível 🎯
          </p>
        </div>
      </Card>

      {/* Achievements Section */}
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-wellness-glow/10 to-golden/10 border-golden/20 shadow-lg overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 opacity-20">
            <img src={achievementsImg} alt="Conquistas" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-golden to-primary bg-clip-text text-transparent relative z-10">
            Conquistas Desbloqueadas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
