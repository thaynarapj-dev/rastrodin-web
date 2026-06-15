const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || apiUrl?.replace(/\/rest\/v1\/?$/, '');

if (!apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not configured.');
}

export const serviceConfig = {
  baseUrl: apiUrl,
  authUrl: supabaseUrl ? `${supabaseUrl}/auth/v1` : undefined,
  supabaseAnonKey,
  defaultHeaders: {
    'Content-Type': 'application/json',
    ...(supabaseAnonKey
      ? {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        }
      : {}),
  },
};
