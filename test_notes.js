import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function debugNotes() {
    console.log("--- INICIANDO DIAGNÓSTICO DE NOTAS ---");
    
    // 1. Buscar el contacto de Jesús
    const { data: opps } = await supabase.from('opportunities').select('*').ilike('name', '%Jesus Alcazar%').limit(1);
    if (!opps || opps.length === 0) return console.log("❌ No se encontró la oportunidad de Jesus Alcazar en la DB.");
    
    const opp = opps[0];
    const contactId = opp.contact_id;
    console.log(`✅ Oportunidad encontrada: ${opp.name} | ContactID: ${contactId}`);

    // 2. Obtener conexión
    const { data: conn } = await supabase.from('ghl_connections').select('*').eq('location_id', opp.location_id).single();
    if (!conn) return console.log("❌ No hay conexión de GHL para esta localización.");

    // 3. Probar llamada a API
    console.log(`🚀 Llamando a GHL API para notas del contacto ${contactId}...`);
    try {
        const response = await axios.get(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
            headers: {
                'Authorization': `Bearer ${conn.access_token}`,
                'Version': '2021-07-28',
                'Accept': 'application/json'
            }
        });
        console.log("--- RESPUESTA GHL ---");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.log("❌ ERROR EN LA API:");
        console.log(err.response?.data || err.message);
    }
}

debugNotes();
