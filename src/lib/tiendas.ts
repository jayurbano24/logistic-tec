import { supabase } from './supabaseClient';

export interface Tienda {
    id: string;
    cliente_id: string;
    nombre: string;
    direccion?: string;
    telefono?: string;
}

export async function getTiendasByCliente(cliente_id: string) {
    const { data, error } = await supabase
        .from('tiendas')
        .select('*')
        .eq('cliente_id', cliente_id)
        .order('nombre');

    if (error) {
        console.warn("Error fetching tiendas:", error.message);
        return [];
    }
    return data as Tienda[];
}

export async function addTienda(tienda: Omit<Tienda, 'id'>) {
    const { data, error } = await supabase
        .from('tiendas')
        .insert([tienda])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteTienda(id: string) {
    const { error } = await supabase
        .from('tiendas')
        .delete()
        .eq('id', id);
    if (error) throw error;
}
