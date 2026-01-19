import { supabase } from './supabaseClient';

export interface Cliente {
    id: string;
    nombre: string;
    direccion?: string;
    telefono?: string;
    contacto?: string;
}

export async function getClientes() {
    const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre');

    if (error) {
        // Si la tabla no existe, devolvemos array vacío o simulamos datos para evitar crash inicial
        console.warn("Error fetching clientes:", error.message);
        return [];
    }
    return data as Cliente[];
}

export async function addCliente(cliente: Omit<Cliente, 'id'>) {
    const { data, error } = await supabase
        .from('clientes')
        .insert([cliente])
        .select()
        .single();
    if (error) throw error;
    return data;
}
