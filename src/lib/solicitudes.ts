import { supabase } from './supabaseClient';

export async function getSolicitudes() {
  const { data, error } = await supabase
    .from('solicitudes')
    .select('*, comentarios(autor, creado_el, mensaje)');
  if (error) throw error;
  return data;
}

export async function updateSolicitud(id: string, fields: any) {
  if (!id || id === 'undefined') {
    console.error('Intento de actualizar solicitud sin ID válido', { id, fields });
    throw new Error("ID de solicitud inválido/indefinido");
  }
  // Sanitize fields: prevent "undefined" string values
  const sanitizedFields = { ...fields };
  Object.keys(sanitizedFields).forEach(key => {
    if (sanitizedFields[key] === 'undefined') {
      console.warn(`Field ${key} has value "undefined" (string), removing it.`);
      delete sanitizedFields[key];
    }
  });

  console.log('updateSolicitud payload sanitized:', { id, sanitizedFields });

  try {
    const { data, error } = await supabase
      .from('solicitudes')
      .update(sanitizedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase Error in updateSolicitud:', error);
      throw error;
    }
    return data;
  } catch (err: any) {
    console.error('Exception in updateSolicitud:', err);
    throw new Error(`Error updating solicitud ${id}: ${err.message || err}`);
  }
}
