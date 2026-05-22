const AUTH_PRO_URL = process.env.NEXT_PUBLIC_AUTH_PRO_URL || 'https://p01--auth-pro--f2ksfrkf9d45.code.run';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mycerts_token');
  }
  return null;
};

export async function signUp(
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<{ user: any | null; error: string | null }> {
  try {
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const res = await fetch(`${AUTH_PRO_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        redirectUrl: `${process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL}/login`
      })
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { message: text }; }

    if (!res.ok) {
      return { user: null, error: data.message || 'Signup failed' };
    }
    return { user: data, error: null };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return { user: null, error: error.message };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ data: any | null; error: string | null }> {
  try {
    const res = await fetch(`${AUTH_PRO_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { message: text }; }

    if (!res.ok) {
      return { data: null, error: data.message || 'Login failed' };
    }

    const token = data.accessToken || data.access_token || data.token; 

    // Fetch user profile
    const profileRes = await fetch(`${AUTH_PRO_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profileData = await profileRes.json();
    
    if (!profileRes.ok) {
      return { data: null, error: profileData.message || 'Failed to fetch user profile' };
    }

    // Safely extract avatar
    let avatar = '';
    if (typeof profileData.avatarUrl === 'string') avatar = profileData.avatarUrl;
    else if (profileData.metadata?.avatar) avatar = profileData.metadata.avatar;

    const formattedUser = {
      ...profileData,
      name: profileData.metadata?.name || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'User',
      phone: profileData.metadata?.phone || '',
      avatar: avatar
    };

    // Format response to match existing expectations in app/login/page.tsx
    return { 
      data: {
        session: { access_token: token },
        user: { user_metadata: formattedUser }
      }, 
      error: null 
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  return { error: null };
}

export async function signInWithOAuth(
  provider: 'google' | 'github' | 'facebook'
): Promise<{ error: string | null }> {
  return { error: 'OAuth is not currently supported by Auth-Pro.' };
}

export async function uploadImage(file: File) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('tag', 'certificate');

  const res = await fetch(`${AUTH_PRO_URL}/media/images`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to upload image');

  return data.url; 
}

export async function uploadAvatar(file: File) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${AUTH_PRO_URL}/users/avatar`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to upload avatar');

  return data.avatarUrl || data.url || data.profile?.avatarUrl;
}

export async function deleteImage(filePath: string) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  
  const id = filePath.split('/').pop(); 
  const res = await fetch(`${AUTH_PRO_URL}/media/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    return null;
  }
  return true;
}

export async function forgotPassword(email: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch(`${AUTH_PRO_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email,
        redirectUrl: `${process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL}/update-password` 
      })
    });
    
    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.message || 'Reset password failed' };
    }
    return { success: true, error: null };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unexpected error' };
  }
}

export async function updatePassword(token: string, newPassword: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch(`${AUTH_PRO_URL}/auth/update-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.message || 'Update password failed' };
    }
    return { success: true, error: null };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unexpected error' };
  }
}

export async function updateUserProfile(
  payloadObj: { name?: string; phone?: string; avatar?: string }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const metadata = { ...payloadObj };

    const res = await fetch(`${AUTH_PRO_URL}/users/me`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ metadata })
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.message || 'Profile update failed' };
    }
    return { success: true, error: null };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unexpected error' };
  }
}