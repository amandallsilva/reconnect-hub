import { useState, useEffect } from "react";

export interface Challenge {
  id: string;
  title: string;
  progress: number;
  days: string;
  currentDay: number;
  totalDays: number;
  icon: string;
  reward: string;
  completed: boolean;
  dailyTasks: DailyTask[];
}

export interface DailyTask {
  date: string;
  completed: boolean;
}

const STORAGE_KEY = "reconectar-challenges";

const initialChallenges: Challenge[] = [
  {
    id: "social-media",
    title: "30 dias sem redes sociais",
    progress: 40,
    days: "12/30 dias",
    currentDay: 12,
    totalDays: 30,
    icon: "Smartphone",
    reward: "Medalha Bronze + 500 XP",
    completed: false,
    dailyTasks: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: i < 12
    }))
  },
  {
    id: "reading",
    title: "Leitura diária de 20 minutos",
    progress: 85,
    days: "6/7 dias",
    currentDay: 6,
    totalDays: 7,
    icon: "BookOpen",
    reward: "Medalha Ouro + 1000 XP",
    completed: false,
    dailyTasks: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: i < 6
    }))
  },
  {
    id: "meditation",
    title: "Meditação matinal",
    progress: 60,
    days: "9/15 dias",
    currentDay: 9,
    totalDays: 15,
    icon: "Moon",
    reward: "Medalha Prata + 750 XP",
    completed: false,
    dailyTasks: Array.from({ length: 15 }, (_, i) => ({
      date: new Date(Date.now() - (14 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: i < 9
    }))
  }
];

export const availableChallenges: Omit<Challenge, 'dailyTasks' | 'progress' | 'currentDay' | 'days' | 'completed'>[] = [
  {
    id: "90-days-no-ai",
    title: "Desafio 90 dias sem IA",
    totalDays: 90,
    icon: "Smartphone",
    reward: "Medalha Diamante + 3000 XP"
  },
  {
    id: "conscious-breakfast",
    title: "Café da manhã consciente",
    totalDays: 21,
    icon: "BookOpen",
    reward: "Medalha Bronze + 600 XP"
  },
  {
    id: "monthly-book",
    title: "Leitura de 1 livro/mês",
    totalDays: 30,
    icon: "BookOpen",
    reward: "Medalha Prata + 1200 XP"
  },
  {
    id: "journal-writing",
    title: "Escrever diário diariamente",
    totalDays: 14,
    icon: "BookOpen",
    reward: "Medalha Bronze + 500 XP"
  },
  {
    id: "daily-walk",
    title: "Caminhada diária 30min",
    totalDays: 21,
    icon: "Moon",
    reward: "Medalha Prata + 800 XP"
  }
];

const COMPLETED_STORAGE_KEY = "reconectar-completed-challenges";

export interface CompletedChallenge {
  id: string;
  title: string;
  completedAt: string;
  xp: number;
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialChallenges;
  });

  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>(() => {
    const saved = localStorage.getItem(COMPLETED_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  const toggleDayCompletion = (challengeId: string, date: string) => {
    setChallenges(prev =>
      prev.map(challenge => {
        if (challenge.id === challengeId) {
          const updatedTasks = challenge.dailyTasks.map(task =>
            task.date === date ? { ...task, completed: !task.completed } : task
          );
          const completedCount = updatedTasks.filter(t => t.completed).length;
          const progress = Math.round((completedCount / challenge.totalDays) * 100);
          const isCompleted = progress === 100;
          
          return {
            ...challenge,
            dailyTasks: updatedTasks,
            currentDay: completedCount,
            progress,
            days: `${completedCount}/${challenge.totalDays} dias`,
            completed: isCompleted
          };
        }
        return challenge;
      })
    );
  };

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return 0;

    const xpAmount = parseInt(challenge.reward.match(/\d+/)?.[0] || "0");
    
    const completedChallenge: CompletedChallenge = {
      id: challenge.id,
      title: challenge.title,
      completedAt: new Date().toLocaleDateString('pt-BR'),
      xp: xpAmount
    };

    setCompletedChallenges(prev => [completedChallenge, ...prev]);
    setChallenges(prev => prev.filter(c => c.id !== challengeId));

    return xpAmount;
  };

  const startChallenge = (challengeTemplate: Omit<Challenge, 'dailyTasks' | 'progress' | 'currentDay' | 'days' | 'completed'>) => {
    const newChallenge: Challenge = {
      ...challengeTemplate,
      progress: 0,
      currentDay: 0,
      days: `0/${challengeTemplate.totalDays} dias`,
      completed: false,
      dailyTasks: Array.from({ length: challengeTemplate.totalDays }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false
      }))
    };

    setChallenges(prev => [...prev, newChallenge]);
  };

  return {
    challenges: challenges.filter(c => !c.completed),
    completedChallenges,
    toggleDayCompletion,
    completeChallenge,
    startChallenge
  };
}
