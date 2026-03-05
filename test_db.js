import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import util from 'util';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function check() {
    const { data, error } = await supabase.from('opportunities').select('name, custom_fields, raw').limit(50);
    if (error) {
        console.error(error);
    } else {
        let closerCount = 0;
        for (const opp of data) {
            const fields = opp.custom_fields || (opp.raw && opp.raw.customFields) || [];
            if (!Array.isArray(fields)) continue;

            const closerField = fields.find(f =>
                String(f.key || "").toLowerCase().includes('closer') ||
                String(f.name || "").toLowerCase().includes('closer') ||
                String(f.id || "").toLowerCase().includes('closer')
            );

            if (closerField) {
                console.log(`Opp: ${opp.name}`);
                console.log('  -> Found closer field:', JSON.stringify(closerField));
                closerCount++;
            }
        }
        console.log(`Total checked: ${data.length}, Found closer in: ${closerCount}`);
    }
}

check();
