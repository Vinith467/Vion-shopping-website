const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manually
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

async function checkData() {
  const { data, error } = await supabase.from('consumers').select('*');
  console.log('Consumers data:', data);
  console.log('Error:', error);
}

checkData();
