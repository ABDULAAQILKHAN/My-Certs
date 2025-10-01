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

export async function uploadImage(file: File) {
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("images") 
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  return data.path;
}

export async function deleteImage(filePath: string) {
 try {
    const { data, error } = await supabase
      .storage
      .from('images') // Your bucket name
      .remove([filePath]); // The path to the file in an array

    if (error) {
      console.error('Error deleting image:', error.message);
      alert(`Error: ${error.message}`); // Optional: show error to the user
      return null;
    }
    return data;

  } catch (err) {
    console.error('An unexpected error occurred:', err);
    alert('An unexpected error occurred. Please try again.');
    return null;
  }
}

// Send password reset email
export async function forgotPassword(email: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/update-password` : undefined,
    })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, error: null }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unexpected error' }
  }
}

export async function updatePassword(newPassword: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, error: null }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unexpected error' }
  }
}

// Update basic profile metadata (name, phone)
export async function updateUserProfile(
  { name, phone, avatar }: { name?: string; phone?: string; avatar?: string }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload: any = { data: {} as Record<string, any> }
    if (name !== undefined) payload.data.name = name
    if (phone !== undefined) payload.data.phone = phone
    if (avatar !== undefined) payload.data.avatar = avatar

    const { error } = await supabase.auth.updateUser(payload)
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unexpected error' }
  }
}