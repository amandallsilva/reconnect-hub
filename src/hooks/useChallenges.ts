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

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialChallenges;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
  }, [challenges]);

  const toggleDayCompletion = (challengeId: string, date: string) => {
    setChallenges(prev =>
      prev.map(challenge => {
        if (challenge.id === challengeId) {
          const updatedTasks = challenge.dailyTasks.map(task =>
            task.date === date ? { ...task, completed: !task.completed } : task
          );
          const completedCount = updatedTasks.filter(t => t.completed).length;
          const progress = Math.round((completedCount / challenge.totalDays) * 100);
          
          return {
            ...challenge,
            dailyTasks: updatedTasks,
            currentDay: completedCount,
            progress,
            days: `${completedCount}/${challenge.totalDays} dias`
          };
        }
        return challenge;
      })
    );
  };

  return {
    challenges,
    toggleDayCompletion
  };
}
