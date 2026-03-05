import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) { process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('opportunities').select('name, raw').limit(50);

    let found = false;
    data?.forEach(o => {
        if (o.raw && o.raw.customFields && o.raw.customFields.length > 0) {
            console.log(`Opp: ${o.name}`);
            console.log(JSON.stringify(o.raw.customFields, null, 2));
            found = true;
        }
    });

    if (!found) console.log("No custom fields found in the first 50 opps.");
}
check();
