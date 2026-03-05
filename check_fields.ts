import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || "",
    process.env.VITE_SUPABASE_ANON_KEY || ""
);

async function check() {
    const { data, error } = await supabase.from('opportunities').select('name, raw, custom_fields').limit(20);
    if (error) {
        console.error(error);
    } else {
        for (const opp of data) {
            const parsedFields = opp.raw?.customFields || opp.custom_fields || [];
            console.log(`Opp: ${opp.name}`);
            console.log(`Fields config:`, JSON.stringify(parsedFields, null, 2));
        }
    }
}

check();
