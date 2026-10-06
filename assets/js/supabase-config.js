/* ============================================================
   FITNEXA AI — SUPABASE CONFIGURATION
   ============================================================ */

const SUPABASE_URL = 'https://jytjmrmawuandoexokha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGptcm1hd3VhbmRvZXhva2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyODY5MzEsImV4cCI6MjEwNjg2MjkzMX0.oi1-5zrijTwm9OPQ67HjTVxf8EkM_LZ47EapI-jXynI';

// Initialize Supabase client
try {
  if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
    throw new Error('Supabase JS library not loaded. Check your CDN script tag.');
  }
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabaseClient = supabaseClient;
  console.log('[FITNEXA] ✅ Supabase client initialized successfully.');
} catch (err) {
  console.error('[FITNEXA] ❌ Supabase init failed:', err.message);
  window.supabaseClient = null;
}
