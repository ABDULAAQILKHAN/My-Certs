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

    console.log('Successfully deleted image:', data);
    alert('Image deleted successfully!'); // Optional: show success message
    return data;

  } catch (err) {
    console.error('An unexpected error occurred:', err);
    alert('An unexpected error occurred. Please try again.');
    return null;
  }
}
