const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: consumers, error: cErr } = await supabase.from('consumers').select('*');
  console.log("Consumers:", consumers);
  if (cErr) console.error(cErr);

  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
  console.log("Profiles:", profiles);
  if (pErr) console.error(pErr);
}

checkData();
