import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, FamilyMember, AppRole, Emotion, SharedJournal } from '@/types/database';
import { generateDemoEmotions, generateDemoJournalEntries } from './useDemoData';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(null);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoEmotions, setDemoEmotions] = useState<Emotion[]>([]);
  const [demoJournalEntries, setDemoJournalEntries] = useState<SharedJournal[]>([]);

  useEffect(() => {
    // Check for demo mode in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
      enterDemoMode();
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setFamilyMembers([]);
          setCurrentMember(null);
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserData(userId: string) {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (roleData) {
        setUserRole(roleData.role as AppRole);
      }

      // Fetch family members
      const { data: membersData } = await supabase
        .from('family_members')
        .select('*')
        .eq('profile_id', userId);
      
      if (membersData) {
        setFamilyMembers(membersData);
        // Set first member as current by default
        if (membersData.length > 0) {
          setCurrentMember(membersData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: AppRole) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) return { error };
    
    // Add user role
    if (data.user) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: data.user.id, role });
      
      if (roleError) return { error: roleError };
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setUser(null);
      setProfile(null);
      setFamilyMembers([]);
      setCurrentMember(null);
      setUserRole(null);
      window.history.replaceState({}, '', window.location.pathname);
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    
    // Create demo user
    const demoUser = {
      id: 'demo-user-id',
      email: 'demo@zenafamily.app',
      created_at: new Date().toISOString(),
    } as User;
    
    // Create demo profile
    const demoProfile: Profile = {
      id: 'demo-user-id',
      email: 'demo@zenafamily.app',
      full_name: 'Famille Martin (Démo)',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Create demo family members
    const demoMembers: FamilyMember[] = [
      {
        id: 'demo-member-1',
        family_id: 'demo-family-id',
        profile_id: 'demo-user-id',
        role: 'parent',
        display_name: 'Sophie',
        age_range: '35-45',
        is_account_holder: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 'demo-member-2',
        family_id: 'demo-family-id',
        profile_id: 'demo-user-id',
        role: 'ado',
        display_name: 'Lucas',
        age_range: '13-17',
        is_account_holder: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'demo-member-3',
        family_id: 'demo-family-id',
        profile_id: 'demo-user-id',
        role: 'enfant',
        display_name: 'Emma',
        age_range: '8-12',
        is_account_holder: false,
        created_at: new Date().toISOString(),
      },
    ];
    
    setUser(demoUser);
    setProfile(demoProfile);
    setFamilyMembers(demoMembers);
    setCurrentMember(demoMembers[0]);
    setUserRole('parent');
    
    // Générer les émotions de démo pour chaque membre
    const allDemoEmotions: Emotion[] = [];
    demoMembers.forEach(member => {
      const emotions = generateDemoEmotions(member.id, member.display_name);
      allDemoEmotions.push(...emotions);
    });
    setDemoEmotions(allDemoEmotions);
    
    // Générer les entrées de journal de démo
    const journalEntries = generateDemoJournalEntries('demo-family-id', demoMembers);
    setDemoJournalEntries(journalEntries);
    
    setLoading(false);
  };

  return {
    user,
    session,
    profile,
    familyMembers,
    currentMember,
    userRole,
    loading,
    isDemoMode,
    demoEmotions,
    demoJournalEntries,
    signUp,
    signIn,
    signOut,
    setCurrentMember,
  };
}
