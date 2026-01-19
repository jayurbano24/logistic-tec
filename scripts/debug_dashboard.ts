
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const fallbackUrl = 'https://smmpejfrpsxprqciiqcr.supabase.co';
const fallbackKey = 'sb_publishable_06RSuAidCQV-t8jiaPDSmQ_TZc847vT';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackKey;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugTicket() {
    const ticket = '568920';
    console.log(`Debugging ticket: ${ticket}`);

    // 1. Get Solicitud
    const { data: solicitudes, error: solError } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('ticket_life_one', ticket);

    if (solError) console.error('Error fetching solicitud:', solError);
    if (!solicitudes || solicitudes.length === 0) {
        console.log('No solicitud found.');
        return;
    }

    const s = solicitudes[0];
    console.log('Solicitud Status:', s.estatus);
    console.log('Solicitud ID:', s.id);

    // 2. Get Bitacora
    const { data: bitacora, error: bitError } = await supabase
        .from('bitacora_movimientos')
        .select('*')
        .eq('solicitud_id', s.id);

    if (bitError) console.error('Error fetching bitacora:', bitError);

    console.log('Bitacora Entries:');
    if (bitacora) {
        bitacora.forEach(b => {
            console.log(` - ${b.fecha_hora}: [${b.estatus}] ${b.detalles || ''}`);
        });
    } else {
        console.log('No bitacora entries.');
    }

    // Debug Check Logic
    const getFecha = (estatus: string) => {
        const b = bitacora?.find(m => m.estatus === estatus);
        return b ? b.fecha_hora : 'Not Found';
    };

    console.log('Logic Check:');
    console.log('Pendiente de Guías (Creation):', s.creado_el);
    console.log('Pendiente de Recolección:', getFecha('Pendiente de Recolección'));
    console.log('En Tránsito_CSA:', getFecha('En Tránsito_CSA'));
    console.log('Recibida en CSA:', getFecha('Recibida en CSA'));
    console.log('COMPLETADO:', getFecha('COMPLETADO'));
    console.log('CANCELADO:', getFecha('CANCELADO'));
}

debugTicket();
