import { useState, useEffect } from "react";

export interface AppLimit {
  id: string;
  name: string;
  icon: string;
  dailyLimit: number; // em minutos
  currentUsage: number; // em minutos
  category: "social" | "entertainment" | "productivity" | "other";
}

export interface DailyUsageData {
  date: string;
  totalMinutes: number;
  appsUsage: {
    appId: string;
    minutes: number;
  }[];
}

export interface WeeklyReport {
  totalScreenTime: number;
  averageDaily: number;
  mostUsedApp: string;
  leastUsedDay: string;
  streak: number;
  improvement: number; // percentage
}

const LIMITS_STORAGE_KEY = "reconectar-app-limits";
const USAGE_STORAGE_KEY = "reconectar-daily-usage";

const defaultLimits: AppLimit[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "Instagram",
    dailyLimit: 60,
    currentUsage: 45,
    category: "social"
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "Video",
    dailyLimit: 30,
    currentUsage: 28,
    category: "entertainment"
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "Youtube",
    dailyLimit: 90,
    currentUsage: 120,
    category: "entertainment"
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: "Twitter",
    dailyLimit: 45,
    currentUsage: 30,
    category: "social"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "MessageCircle",
    dailyLimit: 120,
    currentUsage: 85,
    category: "social"
  }
];

const generateUsageData = (): DailyUsageData[] => {
  const data: DailyUsageData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      totalMinutes: Math.floor(Math.random() * 300) + 120,
      appsUsage: defaultLimits.map(app => ({
        appId: app.id,
        minutes: Math.floor(Math.random() * 90) + 10
      }))
    });
  }
  return data;
};

export function useDigitalWellness() {
  const [appLimits, setAppLimits] = useState<AppLimit[]>(() => {
    const saved = localStorage.getItem(LIMITS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultLimits;
  });

  const [usageData, setUsageData] = useState<DailyUsageData[]>(() => {
    const saved = localStorage.getItem(USAGE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : generateUsageData();
  });

  useEffect(() => {
    localStorage.setItem(LIMITS_STORAGE_KEY, JSON.stringify(appLimits));
  }, [appLimits]);

  useEffect(() => {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usageData));
  }, [usageData]);

  const updateAppLimit = (appId: string, newLimit: number) => {
    setAppLimits(prev =>
      prev.map(app =>
        app.id === appId ? { ...app, dailyLimit: newLimit } : app
      )
    );
  };

  const addAppLimit = (app: Omit<AppLimit, 'currentUsage'>) => {
    const newApp: AppLimit = {
      ...app,
      currentUsage: 0
    };
    setAppLimits(prev => [...prev, newApp]);
  };

  const removeAppLimit = (appId: string) => {
    setAppLimits(prev => prev.filter(app => app.id !== appId));
  };

  const getWeeklyReport = (): WeeklyReport => {
    const lastWeek = usageData.slice(-7);
    const totalScreenTime = lastWeek.reduce((sum, day) => sum + day.totalMinutes, 0);
    const averageDaily = Math.round(totalScreenTime / 7);
    
    // Calcular app mais usado
    const appTotals: Record<string, number> = {};
    lastWeek.forEach(day => {
      day.appsUsage.forEach(usage => {
        appTotals[usage.appId] = (appTotals[usage.appId] || 0) + usage.minutes;
      });
    });
    
    const mostUsedAppId = Object.entries(appTotals).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostUsedApp = appLimits.find(app => app.id === mostUsedAppId)?.name || "N/A";
    
    // Dia com menos uso
    const leastUsedDayData = lastWeek.reduce((min, day) => 
      day.totalMinutes < min.totalMinutes ? day : min
    );
    const leastUsedDay = new Date(leastUsedDayData.date).toLocaleDateString('pt-BR', { weekday: 'long' });
    
    // Streak (dias seguidos abaixo da meta)
    let streak = 0;
    const targetDaily = 120; // 2 horas
    for (let i = lastWeek.length - 1; i >= 0; i--) {
      if (lastWeek[i].totalMinutes <= targetDaily) {
        streak++;
      } else {
        break;
      }
    }
    
    // Melhoria percentual
    const previousWeekAvg = 180; // dados simulados
    const improvement = Math.round(((previousWeekAvg - averageDaily) / previousWeekAvg) * 100);
    
    return {
      totalScreenTime,
      averageDaily,
      mostUsedApp,
      leastUsedDay,
      streak,
      improvement
    };
  };

  return {
    appLimits,
    usageData,
    updateAppLimit,
    addAppLimit,
    removeAppLimit,
    getWeeklyReport
  };
}
