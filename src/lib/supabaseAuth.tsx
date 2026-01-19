import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { getUserProfile } from './supabaseRoles';

export function useSupabaseAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          try {
            const userProfile = await getUserProfile(session.user.id);
            setProfile(userProfile);
          } catch (err) {
            console.error("Error fetching profile:", err);
            // If profile doesn't exist, we might treat as basic user or just ignore
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Optionally refresh profile on auth change
        try {
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
        } catch (err) {
          console.error("Error fetching profile on auth change:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
