"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSupabaseAuth } from '@/lib/supabaseAuth';

export default function ListadoSolicitudes() {
  const { user, loading } = useSupabaseAuth();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSolicitudes() {
      if (!user) return;
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('cliente_id', user.id);
      if (error) setError(error.message);
      else setSolicitudes(data || []);
    }
    fetchSolicitudes();
  }, [user]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>Debes iniciar sesión para ver tus solicitudes.</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Mis Solicitudes</h2>
      {solicitudes.length === 0 ? (
        <div>No tienes solicitudes registradas.</div>
      ) : (
        <table className="w-full border mb-6">
          <thead>
            <tr>
              <th className="border p-2">Ticket</th>
              <th className="border p-2">Marca</th>
              <th className="border p-2">Modelo</th>
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Estatus</th>
              <th className="border p-2">Dirección</th>
              <th className="border p-2">Persona Entrega</th>
              <th className="border p-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map(s => (
              <tr key={s.id}>
                <td className="border p-2">{s.ticket_life_one}</td>
                <td className="border p-2">{s.marca}</td>
                <td className="border p-2">{s.modelo}</td>
                <td className="border p-2">{s.tipo_producto}</td>
                <td className="border p-2">{s.estatus}</td>
                <td className="border p-2">{s.info_entrega?.direccion}</td>
                <td className="border p-2">{s.info_entrega?.nombreEntrega}</td>
                <td className="border p-2">{s.info_entrega?.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
