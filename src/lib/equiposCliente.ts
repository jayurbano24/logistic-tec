import { supabase } from './supabaseClient';

export async function getEquiposCliente(cliente_id: string) {
  const { data, error } = await supabase
    .from('equipos_cliente')
    .select('*')
    .eq('cliente_id', cliente_id);
  if (error) throw error;
  return data;
}

export async function addEquipoCliente({ cliente_id, marca, modelo, tipo_producto }: { cliente_id: string, marca: string, modelo: string, tipo_producto?: string }) {
  const { data, error } = await supabase
    .from('equipos_cliente')
    .insert([
      {
        cliente_id,
        marca,
        modelo,
        tipo_producto,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}
