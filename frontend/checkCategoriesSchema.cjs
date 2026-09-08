const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkCategoriesSchema() {
  // Query 1 row to see fields
  const { data, error } = await supabase.from('categories').select('*').limit(1);
  if (error) {
    console.error(error);
  } else {
    console.log(data && data[0] ? Object.keys(data[0]) : "Table empty or no data");
  }
}

checkCategoriesSchema();
