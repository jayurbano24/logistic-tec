"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getBitacoraBySolicitud } from '@/lib/bitacora';

export default function SolicitudActiva() {
  const [solicitud, setSolicitud] = useState<any>(null);
  const [bitacora, setBitacora] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSolicitud() {
      // Obtener la última solicitud creada por el usuario actual
      const user = supabase.auth.getUser();
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('cliente_id', (await user).data?.user?.id)
        .order('creado_el', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setSolicitud(data);
      if (data) {
        const bitacoraData = await getBitacoraBySolicitud(data.id);
        setBitacora(bitacoraData);
      }
      setLoading(false);
    }
    fetchSolicitud();
  }, []);

  if (loading) return <div>Cargando solicitud activa...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!solicitud) return <div>No tienes solicitudes activas.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Solicitud Activa</h2>
      <div className="mb-4">
        <div><b>Marca:</b> {solicitud.marca}</div>
        <div><b>Modelo:</b> {solicitud.modelo}</div>
        <div><b>Tipo de Producto:</b> {solicitud.tipo_producto}</div>
        <div><b>Ticket Life-One:</b> {solicitud.ticket_life_one}</div>
        <div><b>Estatus:</b> {solicitud.estatus}</div>
      </div>
      <h3 className="font-semibold mb-2">Bitácora de Cambios</h3>
      <ul className="border rounded p-4 bg-gray-50">
        {bitacora.map(mov => (
          <li key={mov.id} className="mb-2">
            <span className="font-bold">{mov.usuario}</span> cambió estatus a <span className="font-bold">{mov.estatus}</span> el <span className="text-gray-700">{new Date(mov.fecha_hora).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
