import { supabase } from './supabaseClient';
import type { AuthResponse, User } from '@supabase/supabase-js';

export async function signUp(
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<{ user: User | null; error: string | null }> {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            phone,
            options: {
                data: {
                    name,
                    phone,
                    project: "MyCerts"
                },
                emailRedirectTo: `${window.location.origin}/login`,
            },
        });
      return { user: data.user, error: error ? error.message : null };
		} catch (error) {
			console.error('Error signing up:', error);
			throw error;
		}
}

export async function signIn(
  email: string,
  password: string
): Promise<{ data: any | null; error: string | null }> {
  const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return {  data, error: null };
}
export async function signOut(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
export async function signInWithOAuth(
  provider: 'google' | 'github' | 'facebook' // Add other providers as needed
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}