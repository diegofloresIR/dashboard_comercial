import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing config!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('opportunities').select('name, stage_id, status, created_at').order('created_at', { ascending: false }).limit(50);

    if (error) {
        console.error("Query err:", error);
        return;
    }

    console.log("Total recent opps returned:", data?.length);
    console.log("Here are the names and stages:");

    data?.forEach(o => {
        console.log(`- ${o.name} | Stage: ${o.stage_id} | Status: ${o.status}`);
    });
}

check();
