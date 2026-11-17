const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const lines = env.split('\n');
const getVal = (k) => {
  const line = lines.find(x => x.trim().startsWith(k + '='));
  return line ? line.split('=')[1].trim() : '';
};

const url = getVal('NEXT_PUBLIC_SUPABASE_URL');
const serviceKey = getVal('SUPABASE_SERVICE_ROLE_KEY');

const client = createClient(url, serviceKey);

async function auditTable(tableName) {
  console.log(`\n==================================================================`);
  console.log(`   TABLE AUDIT: public.${tableName}`);
  console.log(`==================================================================`);

  // 1. Fetch sample / all rows to inspect columns & data
  const { data: rows, error: rErr, count } = await client
    .from(tableName)
    .select('*', { count: 'exact' });

  if (rErr) {
    console.error(`Error querying ${tableName}:`, rErr.message);
    return;
  }

  console.log(`Total rows in ${tableName}: ${count}`);
  if (rows && rows.length > 0) {
    console.log(`Columns found in data:`, Object.keys(rows[0]));
    console.log(`First row data:`, JSON.stringify(rows[0], null, 2));
    if (rows.length > 1) {
      console.log(`All IDs in table:`, rows.map(r => r.id));
    }
  } else {
    console.log(`Table has 0 rows. Querying empty select.`);
  }
}

async function auditDatabase() {
  const tables = ['products', 'reviews', 'site_hero', 'site_instagram', 'site_story'];
  for (const t of tables) {
    await auditTable(t);
  }

  // 2. Query Postgres Information Schema via rpc or check if we can query pg_policies / rpc
  // Note: PostgREST does not directly expose pg_catalog unless exposed, but let's check
}

auditDatabase().catch(err => console.error("Audit error:", err));
