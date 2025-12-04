import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, Profile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  level: number;
  xp: number;
  daysWithoutAI: number;
  activeChallenges: number;
}

interface DataContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  id: "guest",
  name: "Visitante",
  username: "visitante",
  email: "",
  level: 1,
  xp: 0,
  daysWithoutAI: 0,
  activeChallenges: 0,
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { profile: dbProfile, loading: profileLoading, updateProfile: updateDbProfile } = useProfile();
  const [activeChallenges, setActiveChallenges] = useState(0);

  useEffect(() => {
    // Count active challenges from localStorage for now
    const saved = localStorage.getItem("reconectar-challenges");
    if (saved) {
      const challenges = JSON.parse(saved);
      setActiveChallenges(challenges.length);
    }
  }, []);

  const profile: UserProfile = dbProfile ? {
    id: dbProfile.id,
    name: dbProfile.name,
    username: dbProfile.name.toLowerCase().replace(/\s+/g, '_'),
    email: dbProfile.email || '',
    avatar: dbProfile.avatar || undefined,
    level: dbProfile.level,
    xp: dbProfile.xp,
    daysWithoutAI: dbProfile.digital_detox_days,
    activeChallenges
  } : defaultProfile;

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    const dbUpdates: Partial<Profile> = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.email) dbUpdates.email = updates.email;
    if (updates.avatar) dbUpdates.avatar = updates.avatar;
    if (updates.daysWithoutAI !== undefined) dbUpdates.digital_detox_days = updates.daysWithoutAI;
    if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
    if (updates.level !== undefined) dbUpdates.level = updates.level;

    await updateDbProfile(dbUpdates);
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        updateProfile,
        loading: profileLoading
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
