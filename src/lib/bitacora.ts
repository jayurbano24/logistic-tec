import { supabase } from './supabaseClient';

export async function registrarMovimiento({ solicitud_id, usuario, estatus }: { solicitud_id: string, usuario: string, estatus: string }) {
  const { error } = await supabase
    .from('bitacora_movimientos')
    .insert([
      {
        solicitud_id,
        usuario,
        estatus,
        fecha_hora: new Date().toISOString(),
      },
    ]);
  if (error) throw error;
}

export async function getBitacoraBySolicitud(solicitud_id: string) {
  const { data, error } = await supabase
    .from('bitacora_movimientos')
    .select('*')
    .eq('solicitud_id', solicitud_id)
    .order('fecha_hora', { ascending: true });
  if (error) throw error;
  return data;
}
