import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type {
  Visitor,
  VisitorWithDetails,
  DashboardStats,
  MeetingInvitation,
  ChatSession,
  ChatMessage,
} from './types';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    newVisitorsThisWeek: 0,
    inConversation: 0,
    concernsRaised: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [visitorsRes, conversationRes, concernsRes] = await Promise.all([
        supabase
          .from('visitors')
          .select('id', { count: 'exact', head: true })
          .gte('visit_date', weekAgo.toISOString().split('T')[0]),
        supabase
          .from('visitors')
          .select('id', { count: 'exact', head: true })
          .in('follow_up_status', ['engaged', 'contacted', 'concern_raised', 'concern_confirmed']),
        supabase
          .from('concerns')
          .select('id', { count: 'exact', head: true })
          .in('concern_status', ['raised', 'confirmed', 'escalated']),
      ]);

      setStats({
        newVisitorsThisWeek: visitorsRes.count ?? 0,
        inConversation: conversationRes.count ?? 0,
        concernsRaised: concernsRes.count ?? 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  return { stats, loading };
}

export function useVisitorPipeline() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVisitors() {
      const { data, error } = await supabase
        .from('visitors')
        .select('*, pastor:pastors(id, name, role, avatar_url)')
        .in('follow_up_status', [
          'new_visitor',
          'concern_raised',
          'concern_confirmed',
          'escalated',
          'engaged',
          'contacted',
          'thanked',
        ])
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) console.error('[useVisitorPipeline]', error);
      setVisitors((data as Visitor[]) ?? []);
      setLoading(false);
    }
    fetchVisitors();
  }, []);

  return { visitors, loading };
}

export function useAIRecommendation() {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopConcern() {
      const { data } = await supabase
        .from('visitors')
        .select('*, pastor:pastors(id, name, role, avatar_url)')
        .in('follow_up_status', ['concern_raised', 'concern_confirmed', 'escalated'])
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setVisitor(data as Visitor | null);
      setLoading(false);
    }
    fetchTopConcern();
  }, []);

  return { visitor, loading };
}

export function useAllVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVisitors() {
      const { data } = await supabase
        .from('visitors')
        .select('*, pastor:pastors(id, name, role, avatar_url)')
        .order('created_at', { ascending: false });

      setVisitors((data as Visitor[]) ?? []);
      setLoading(false);
    }
    fetchVisitors();
  }, []);

  return { visitors, loading };
}

export function useVisitorDetails(visitorId: string) {
  const [visitor, setVisitor] = useState<VisitorWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visitorId) return;

    async function fetchVisitor() {
      const [visitorRes, commRes, concernsRes, visitRes, sequenceRes, meetingRes] =
        await Promise.all([
          supabase
            .from('visitors')
            .select('*, pastor:pastors(id, name, role, avatar_url)')
            .eq('id', visitorId)
            .maybeSingle(),
          supabase
            .from('communication_events')
            .select('*')
            .eq('visitor_id', visitorId)
            .order('created_at', { ascending: true }),
          supabase
            .from('concerns')
            .select('*')
            .eq('visitor_id', visitorId)
            .order('created_at', { ascending: false }),
          supabase
            .from('visit_events')
            .select('*')
            .eq('visitor_id', visitorId)
            .order('service_date', { ascending: false }),
          supabase
            .from('follow_up_sequences')
            .select('*')
            .eq('visitor_id', visitorId)
            .maybeSingle(),
          supabase
            .from('meeting_invitations')
            .select('*, pastor:pastors(id, name, role, avatar_url)')
            .eq('visitor_id', visitorId)
            .order('created_at', { ascending: false })
            .limit(1),
        ]);

      if (visitorRes.data) {
        setVisitor({
          ...(visitorRes.data as VisitorWithDetails),
          communication_events: commRes.data ?? [],
          concerns: concernsRes.data ?? [],
          visit_events: visitRes.data ?? [],
          follow_up_sequences: sequenceRes.data ? [sequenceRes.data] : [],
          meeting_invitations: meetingRes.data ?? [],
        });
      }
      setLoading(false);
    }
    fetchVisitor();
  }, [visitorId]);

  return { visitor, loading };
}

export function useMeetingInvitation(visitorId: string) {
  const [invitation, setInvitation] = useState<MeetingInvitation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visitorId) return;

    async function fetchInvitation() {
      const { data } = await supabase
        .from('meeting_invitations')
        .select('*, pastor:pastors(id, name, role, avatar_url)')
        .eq('visitor_id', visitorId)
        .in('status', ['pending', 'accepted'])
        .order('created_at', { ascending: false })
        .maybeSingle();

      setInvitation(data as MeetingInvitation | null);
      setLoading(false);
    }
    fetchInvitation();
  }, [visitorId]);

  async function selectTime(time: string) {
    if (!invitation) return;
    const { data } = await supabase
      .from('meeting_invitations')
      .update({ selected_time: time, status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', invitation.id)
      .select()
      .maybeSingle();

    if (data) setInvitation(data as MeetingInvitation);
  }

  return { invitation, loading, selectTime };
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*, visitor:visitors(id, first_name, last_name, avatar_url), pastor:pastors(id, name)')
        .order('last_message_at', { ascending: false });

      if (error) console.error('[useChatSessions]', error);
      setSessions((data as ChatSession[]) ?? []);
      setLoading(false);
    }
    fetchSessions();
  }, []);

  return { sessions, loading };
}

export function useChatMessages(sessionId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    async function fetchMessages() {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) console.error('[useChatMessages]', error);
      setMessages((data as ChatMessage[]) ?? []);
      setLoading(false);
    }
    fetchMessages();
  }, [sessionId]);

  return { messages, loading };
}
