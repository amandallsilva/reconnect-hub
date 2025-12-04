import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_from_user: boolean;
  specialist_id: string | null;
  read: boolean;
  created_at: string;
}

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const sendMessage = async (message: string, specialistId?: string) => {
    if (!user || !message.trim()) return { error: new Error('Missing data') };

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        message: message.trim(),
        is_from_user: true,
        specialist_id: specialistId || null
      });

    if (!error) {
      await fetchMessages();
    }

    return { error };
  };

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages
  };
}
