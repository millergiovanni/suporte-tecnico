const SUPABASE_URL = 'https://exhqpcrpdqtsfflgxdht.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_GlFHPlrYCx9khXB4Z0CCBA_Zl6yU2Rb';

// Use standard Supabase JS client from CDN
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabaseClient = supabaseClient;
