const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not configured.');
}

export const serviceConfig = {
  baseUrl: apiUrl,
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
