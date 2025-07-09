import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vkmgujuckmkuoznmlcay.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbWd1anVja21rdW96bm1sY2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTExNTYsImV4cCI6MjA2MDE4NzE1Nn0.OAcDMaMn9nQh1Qkb2ywy0KaC6y0MWKuvfVerz7sMtzU' // ⚠️ используйте только публичный (anon) ключ
export const supabase = createClient(supabaseUrl, supabaseKey)