
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Usar Service Role key idealmente para scripts backend, pero anon funciona si las reglas RLS lo permiten o si es admin.
// Mejor intentar leer SUPABASE_SERVICE_ROLE_KEY si existe, sino anon.
// Hardcoded fallback headers related to what is found in src/lib/supabaseClient.ts
// Note: In production, use environment variables.
const fallbackUrl = 'https://smmpejfrpsxprqciiqcr.supabase.co';
const fallbackKey = 'sb_publishable_06RSuAidCQV-t8jiaPDSmQ_TZc847vT';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackKey;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Faltan variables de entorno y no hay fallbacks.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTracking() {
    console.log('--- Iniciando Rastreo Automático de Guías ---');
    console.log(new Date().toLocaleString());

    // 1. Obtener solicitudes activas (Pendiente de Recolección o En Tránsito_CSA)
    const { data: solicitudes, error } = await supabase
        .from('solicitudes')
        .select('id, guia_caex_referencia, estatus, ticket_life_one')
        .in('estatus', ['Pendiente de Recolección', 'En Tránsito_CSA'])
        .not('guia_caex_referencia', 'is', null);

    if (error) {
        console.error('Error obteniendo solicitudes:', error.message);
        return;
    }

    if (!solicitudes || solicitudes.length === 0) {
        console.log('No hay solicitudes pendientes de rastreo.');
        return;
    }

    console.log(`Procesando ${solicitudes.length} guías...`);

    for (const s of solicitudes) {
        if (!s.guia_caex_referencia || s.guia_caex_referencia.length < 5) {
            console.log(`[${s.ticket_life_one}] Guía inválida o muy corta: ${s.guia_caex_referencia}`);
            continue;
        }

        try {
            // 2. Consultar API Cargo Expreso
            // Endpoint descubierto: https://tracking.caexlogistics.com/TrackingMov/api/Tracking/Get?guia={guia}
            const apiUrl = `https://tracking.caexlogistics.com/TrackingMov/api/Tracking/Get?guia=${s.guia_caex_referencia}`;

            const response = await axios.get(apiUrl, { timeout: 10000 });
            const apiData = response.data;

            // La API retorna una lista de tracking o un objeto. Según análisis, parece retornar un objeto "tracking".
            // Vamos a inspeccionar la estructura típica.
            // Estructura esperada (basada en subagent): tracking.datosGuia.PODStatusDes

            // Validación básica de respuesta
            if (!apiData) {
                console.log(`[${s.ticket_life_one}] API sin respuesta para guía ${s.guia_caex_referencia}`);
                continue;
            }

            // Buscar el estado
            // Nota: Si la API retorna un array o estructura diferente, ajustar aquí.
            // Asumiremos que si hay data, intentamos buscar el estado.
            // Loguear respuesta completa si es el primer run para depurar puede ser útil, pero mantengamoslo limpio.

            // A veces viene en apiData.PODStatusDes directo o anidado.
            // El subagent mencionó `tracking.datosGuia` con campo `PODStatusDes`.
            // Vamos a buscar la descripción del estado de forma robusta.

            let estadoCargo = '';
            let fechaEvento = null;

            if (apiData.tracking && apiData.tracking.datosGuia) {
                estadoCargo = apiData.tracking.datosGuia.PODStatusDes;
                fechaEvento = apiData.tracking.datosGuia.PODFecha; // Fecha del evento en Cargo Expreso
            }
            // Fallbacks para estructuras alternativas si existen
            else if (apiData.PODStatusDes) {
                estadoCargo = apiData.PODStatusDes;
                fechaEvento = apiData.PODFecha;
            } else {
                // Fallback: buscar en array si fuera el caso
                console.log(`[${s.ticket_life_one}] Estructura desconocida o guia no encontrada: ${JSON.stringify(apiData).substring(0, 50)}...`);
                continue;
            }

            if (!estadoCargo) {
                console.log(`[${s.ticket_life_one}] No se encontró estado en respuesta API.`);
                continue;
            }

            const estadoCargoNorm = estadoCargo.toUpperCase();
            console.log(`[${s.ticket_life_one}] Estado Cargo: "${estadoCargoNorm}" (${fechaEvento || 'Sin fecha'})`);

            // 3. Mapeo de Estados
            let nuevoEstatus = s.estatus;

            if (estadoCargoNorm.includes('RECOLECTADO') || estadoCargoNorm.includes('EN RUTA') || estadoCargoNorm.includes('TRANSITO')) {
                nuevoEstatus = 'En Tránsito_CSA';
            } else if (estadoCargoNorm.includes('ENTREGADO') || estadoCargoNorm.includes('RECIBIDO') || estadoCargoNorm.includes('COMPLETAD')) {
                nuevoEstatus = 'Recibida en CSA';
            }

            // 4. SIEMPRE Actualizar datos de sincronización (Auditoría de "Se validó y no hubo cambio")
            // Esto responde a: "saber los Detalle de Cuando se valido"
            const updateData: any = {
                ultima_sincronizacion: new Date().toISOString(),
                ultimo_estado_externo: estadoCargoNorm
            };

            // Si tenemos fecha real del evento, la guardamos tambien
            if (fechaEvento) {
                // Intentar parsear si viene en formato raro, pero normalmente API devuelve ISO o string legible
                // Asumimos string directo por ahora
                updateData.fecha_evento_externo = fechaEvento; // Ojo: Asegurarse que el formato sea compatible con timestamptz o guardar como texto si falla.
                // La DB espera TIMESTAMPTZ. Si falla, axios no lanzará error aquí sino supabase.
            }

            // Si hay cambio de estado, actualizamos el estatus principal también
            let cambioDeEstado = false;
            if (nuevoEstatus !== s.estatus) {
                console.log(`   -> CAMBIO DETECTADO: ${s.estatus} -> ${nuevoEstatus}`);
                updateData.estatus = nuevoEstatus;
                cambioDeEstado = true;
            } else {
                console.log(`   -> Validado (Sin cambio de estado interno).`);
            }

            // Ejecutar Update en Solicitudes
            const { error: updateError } = await supabase
                .from('solicitudes')
                .update(updateData)
                .eq('id', s.id);

            if (updateError) {
                console.error(`   Error actualizando solicitud: ${updateError.message}`);
            }

            // 5. Registrar en Bitácora SOLO si hubo cambio de estado interno (Historial de Cambios)
            // "y en caso de que la guias se actualices, es necesarios concer el Historial de Fecha de cambios"
            if (cambioDeEstado) {
                await supabase
                    .from('bitacora_movimientos')
                    .insert({
                        solicitud_id: s.id,
                        usuario: 'Rastreo Automático',
                        estatus: nuevoEstatus,
                        // Incluir el detalle de la fecha real del evento externo
                        detalles: `Actualizado autom. Guía: ${s.guia_caex_referencia}. Estado CAEX: ${estadoCargoNorm}. Fecha Evento CAEX: ${fechaEvento || 'N/A'}`,
                        fecha_hora: new Date().toISOString()
                    });
            }

        } catch (err: any) {
            console.error(`[${s.ticket_life_one}] Error consultando API: ${err.message}`);
        }

        // Pequeña pausa para no saturar
        await new Promise(res => setTimeout(res, 500));
    }

    console.log('--- Rastreo Finalizado ---');
}

checkTracking();
