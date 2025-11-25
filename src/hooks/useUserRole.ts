import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'user' | 'specialist' | 'admin';

export function useUserRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (!error && data) {
        setRoles(data.map(r => r.role as UserRole));
      }
      setLoading(false);
    };

    fetchRoles();
  }, [user]);

  return {
    roles,
    loading,
    isUser: roles.includes('user'),
    isSpecialist: roles.includes('specialist'),
    isAdmin: roles.includes('admin')
  };
}