const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPreferencesSchema() {
  const { error } = await supabase.from('preferences').insert({ 
    consumer_id: '00000000-0000-0000-0000-000000000000', 
    preferred_content: [] 
  });
  console.log(`Schema hint for preferred_content:`, error ? error.message : "Success");
}

checkPreferencesSchema();
