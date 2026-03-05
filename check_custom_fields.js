const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function check() {
    const { data, error } = await supabase.from('opportunities').select('name, custom_fields').limit(20);
    if (error) return console.error(error);

    data.forEach((o, i) => {
        if (o.custom_fields && Array.isArray(o.custom_fields) && o.custom_fields.length > 0) {
            console.log(`Opp ${i}: ${o.name}`);
            console.log(JSON.stringify(o.custom_fields, null, 2));
        } else if (o.custom_fields && Object.keys(o.custom_fields).length > 0) {
            console.log(`Opp ${i}: ${o.name}`);
            console.log(JSON.stringify(o.custom_fields, null, 2));
        }
    });
}

check();
