import { supabase } from './supabaseClient';

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function createUserProfile({ id, nombre_usuario, rol, empresa }: { id: string, nombre_usuario: string, rol: 'ADMIN' | 'EMPLEADO' | 'CLIENTE', empresa?: string }) {
  const { data, error } = await supabase
    .from('perfiles')
    .insert([
      {
        id,
        nombre_usuario,
        rol,
        empresa,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}
