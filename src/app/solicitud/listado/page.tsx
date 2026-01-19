"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSupabaseAuth } from '@/lib/supabaseAuth';
import ComentariosModal from '@/components/ComentariosModal';
import * as XLSX from 'xlsx';
import { generarPDFGuia, generarPDFManifiesto } from '@/lib/pdfGenerator';

export default function ListadoSolicitudes() {
  const { user, loading } = useSupabaseAuth();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [chatSolicitud, setChatSolicitud] = useState<any>(null);

  useEffect(() => {
    async function fetchSolicitudes() {
      if (!user) return;
      // Quitamos el filtro .eq('cliente_id', user.id) porque ahora cliente_id es la EMPRESA, no el usuario.
      // En un futuro, deberíamos filtrar por 'usuario_creador' o 'empresa_asignada_al_usuario'.
      // Por ahora traemos todas para que el usuario pueda ver lo que acaba de crear.
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*, comentarios(autor, creado_el)')
        .order('creado_el', { ascending: false }); // Ordenar por fecha

      if (error) setError(error.message);
      else setSolicitudes(data || []);
    }
    fetchSolicitudes();
  }, [user]);

  // Función para exportar a Excel
  const exportarExcel = () => {
    const data = solicitudes.map(s => ({
      Marca: s.marca,
      Modelo: s.modelo,
      Tienda: s.tienda || s.info_entrega?.tienda, // Nueva columna
      Tipo: s.tipo_producto,
      PersonaEntrega: s.creado_por || s.info_entrega?.nombreEntrega,
      Telefono: s.telefono_contacto || s.info_entrega?.telefono, // Nueva columna
      Direccion: s.direccion_entrega || s.info_entrega?.direccion, // Nueva columna
      Fecha: s.creado_el ? new Date(s.creado_el).toLocaleDateString() : '-',
      Hora: s.creado_el ? new Date(s.creado_el).toLocaleTimeString() : '-',
      Guias: s.guia_caex_referencia || '-',
      Estatus: s.estatus
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes");
    XLSX.writeFile(workbook, "MisSolicitudes.xlsx");
  };

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>Debes iniciar sesión para ver tus solicitudes.</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Detectar si alguna solicitud cambió a un estado avanzado
  const ticketAsignado = solicitudes.find(s => ['Pendiente de Recolección', 'En Tránsito_CSA', 'Recibida en CSA', 'ASIGNADO', 'COMPLETADO'].includes(s.estatus));

  return (
    <div className="max-w-[95%] mx-auto mt-10 p-6 border rounded-lg shadow overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Mis Solicitudes</h2>
        <button
          onClick={exportarExcel}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center gap-2"
        >
          {/* SVG icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Exportar Excel
        </button>
      </div>
      {ticketAsignado && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded font-semibold">
          ¡Tu ticket <b>{ticketAsignado.ticket_life_one}</b> ha sido actualizado a <b>{ticketAsignado.estatus}</b>! Revisa tus documentos.
        </div>
      )}
      {solicitudes.length === 0 ? (
        <div>No tienes solicitudes registradas.</div>
      ) : (
        <table className="min-w-full border mb-6 text-[10px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Ticket</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Marca</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Modelo</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Tienda</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Tipo</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Entrega</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Tel</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Dirección</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Ref</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Nota</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Fecha</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap text-center">Número de Guías</th>
              <th className="border px-1 py-0.5 text-left whitespace-nowrap">Estatus</th>
              <th className="border px-1 py-0.5 text-center whitespace-nowrap">Chat</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border px-1 py-0.5 font-bold whitespace-nowrap">{s.ticket_life_one}</td>
                <td className="border px-1 py-0.5 whitespace-nowrap">{s.marca || '-'}</td>
                <td className="border px-1 py-0.5 whitespace-nowrap">{s.modelo || '-'}</td>
                <td className="border px-1 py-0.5 whitespace-nowrap max-w-[100px] truncate" title={s.tienda || s.info_entrega?.tienda}>{s.tienda || s.info_entrega?.tienda || '-'}</td>
                <td className="border px-1 py-0.5 whitespace-nowrap">{s.tipo_producto}</td>
                <td className="border px-1 py-0.5 whitespace-nowrap max-w-[80px] truncate" title={s.creado_por || s.info_entrega?.nombreEntrega}>{s.creado_por || s.info_entrega?.nombreEntrega}</td>
                <td className="border px-1 py-0.5 whitespace-nowrap">{s.telefono_contacto || s.info_entrega?.telefono}</td>
                <td className="border px-1 py-0.5 whitespace-nowrap max-w-[120px] truncate" title={s.direccion_entrega || s.info_entrega?.direccion}>{s.direccion_entrega || s.info_entrega?.direccion}</td>
                <td className="border px-1 py-0.5 whitespace-nowrap max-w-[80px] truncate" title={`${s.referencia1 || ''} ${s.referencia2 || ''}`}>
                  {s.referencia1}{s.referencia2 ? `, ${s.referencia2}` : ''}
                </td>
                <td className="border px-1 py-0.5 whitespace-nowrap max-w-[80px] truncate" title={s.info_entrega?.nota}>{s.info_entrega?.nota || '-'}</td>
                <td className="border px-1 py-0.5 whitespace-nowrap">
                  {s.creado_el ? new Date(s.creado_el).toLocaleString('es-GT', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td className="border px-1 py-0.5 whitespace-nowrap text-center text-[10px]">
                  {s.guia_caex_referencia ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold">{s.guia_caex_referencia}</span>
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => generarPDFGuia(s)}
                          disabled={s.estatus === 'Recibida en CSA'}
                          className={`text-white px-1 py-0.5 rounded text-[8px] flex items-center gap-0.5 ${s.estatus === 'Recibida en CSA' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                          title={s.estatus === 'Recibida en CSA' ? 'Descarga bloqueada: Recibida en CSA' : "Descargar Guía PDF"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Guía
                        </button>
                        <button
                          onClick={() => generarPDFManifiesto(s)}
                          disabled={s.estatus === 'Recibida en CSA'}
                          className={`text-white px-1 py-0.5 rounded text-[8px] flex items-center gap-0.5 ${s.estatus === 'Recibida en CSA' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                          title={s.estatus === 'Recibida en CSA' ? 'Descarga bloqueada: Recibida en CSA' : "Descargar Manifiesto PDF"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          Manifiesto
                        </button>
                      </div>
                    </div>
                  ) : '-'}
                </td>
                <td className="border px-1 py-0.5 font-semibold whitespace-nowrap">
                  <span className={`
                    ${['Recibida en CSA', 'COMPLETADO'].includes(s.estatus) ? 'text-blue-600' : ''}
                    ${['Pendiente de Recolección', 'ASIGNADO'].includes(s.estatus) ? 'text-green-600' : ''}
                    ${['En Tránsito_CSA'].includes(s.estatus) ? 'text-purple-600' : ''}
                    ${['Pendiente de Guías', 'PENDIENTE'].includes(s.estatus) ? 'text-gray-700' : ''}
                  `}>
                    {s.estatus}
                  </span>
                </td>
                <td className="border px-1 py-0.5 text-center relative">
                  <button
                    className="p-1 text-gray-500 hover:text-blue-600 relative"
                    title="Abrir Chat"
                    onClick={() => setChatSolicitud(s)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 4.883 4.883 0 00-5.931 0c-1.153.77-2.902 0-2.902-1.638v-.03c0-1.666 1.352-3.003 3-3.003 1.648 0 3 1.337 3 3.003" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    {(() => {
                      const comentarios = s.comentarios || [];
                      if (comentarios.length === 0) return null;
                      const last = comentarios.sort((a: any, b: any) => new Date(b.creado_el).getTime() - new Date(a.creado_el).getTime())[0];
                      if (last.autor && (last.autor.includes('Proveedor') || last.autor.includes('Admin'))) {
                        return <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-600 ring-2 ring-white" title="Nuevo mensaje"></span>;
                      }
                      return null;
                    })()}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {chatSolicitud && (
        <ComentariosModal
          solicitudId={chatSolicitud.id}
          ticket={chatSolicitud.ticket_life_one}
          usuarioActual={`Cliente (${user?.email || 'N/A'})`}
          onClose={() => setChatSolicitud(null)}
        />
      )}
    </div>
  );
}
