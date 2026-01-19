"use client";

import { useEffect, useState } from 'react';
import { getSolicitudes, updateSolicitud } from '@/lib/solicitudes';
import { supabase } from '@/lib/supabaseClient';
import { useSupabaseAuth } from '@/lib/supabaseAuth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JsBarcode from 'jsbarcode';
import ComentariosModal from '@/components/ComentariosModal';
import { getBitacoraBySolicitud, registrarMovimiento } from '@/lib/bitacora';

import { generarPDFGuia, generarPDFManifiesto } from '@/lib/pdfGenerator';



export default function AdminPanel() {
  const { user } = useSupabaseAuth();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatSolicitud, setChatSolicitud] = useState<any>(null);

  useEffect(() => {
    getSolicitudes().then(setSolicitudes).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  // Estado local para saber si ambos PDFs están cargados
  const [pdfsCargados, setPdfsCargados] = useState<{ [id: string]: { pdf_caex1?: string, pdf_caex2?: string } }>({});

  // Extraer número de guía del PDF (ejemplo: primer número de 8-12 dígitos)
  async function extraerGuiaDePDF(file: File): Promise<string | null> {
    // Nota: pdf-lib no soporta extracción de texto nativa facilmente sin pdfjs-dist.
    // Se deshabilita temporalmente para evitar errores de compilación/runtime.
    return null;
    /*
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
       // Error: getPages().getTextContent no existe en pdf-lib
      // const text = ...
      return null;
    } catch {
      return null;
    }
    */
  }

  // Permitir cargar dos PDFs y automatizar todo
  const handleFileUpload = async (solicitudId: string, file: File, pdfKey: 'pdf_caex1' | 'pdf_caex2') => {
    try {
      const fileName = `${pdfKey}_${solicitudId}_${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file, { contentType: 'application/pdf' });
      if (uploadError) throw uploadError;
      const pdfUrl = supabase.storage.from('pdfs').getPublicUrl(fileName).data.publicUrl;

      // Extraer número de guía solo del primer PDF
      let guia = null;
      if (pdfKey === 'pdf_caex1') {
        guia = await extraerGuiaDePDF(file);
      }

      // Forzar que archivos_url siempre sea objeto válido
      const solicitud = solicitudes.find(s => s.id === solicitudId);
      let archivos_url: any = {};
      if (solicitud?.archivos_url && typeof solicitud.archivos_url === 'object') {
        archivos_url = { ...solicitud.archivos_url };
      }
      archivos_url[pdfKey] = pdfUrl;

      // Estado local para saber si ambos PDFs están cargados
      setPdfsCargados(prev => {
        const nuevo = { ...(prev[solicitudId] || {}), [pdfKey]: pdfUrl };
        return { ...prev, [solicitudId]: nuevo };
      });

      // Si ambos PDFs están cargados, actualiza todo junto
      const nuevosPdfs = { ...(pdfsCargados[solicitudId] || {}), [pdfKey]: pdfUrl };
      const ambosCargados = nuevosPdfs.pdf_caex1 && nuevosPdfs.pdf_caex2;

      if (ambosCargados) {
        await updateSolicitud(solicitudId, {
          estatus: 'ASIGNADO',
          archivos_url: nuevosPdfs,
          ...(guia ? { guia_caex_referencia: guia } : {})
        });
      } else {
        // Solo actualiza el PDF subido
        await updateSolicitud(solicitudId, {
          archivos_url
        });
      }
      // Refrescar solicitudes después de subir y actualizar
      const nuevasSolicitudes = await getSolicitudes();
      setSolicitudes(nuevasSolicitudes);
    } catch (err: any) {
      setError('Error procesando PDF: ' + (err.message || JSON.stringify(err)));
    }
  };

  const handleEstatusChange = async (solicitudId: string, nuevoEstatus: string) => {
    try {
      await updateSolicitud(solicitudId, { estatus: nuevoEstatus });
      setSolicitudes(solicitudes.map(s => s.id === solicitudId ? { ...s, estatus: nuevoEstatus } : s));
    } catch (err: any) {
      setError('Error actualizando estatus: ' + err.message);
    }
  };

  const handleCostoExtra = async (solicitudId: string, costo: number) => {
    try {
      await updateSolicitud(solicitudId, { costo_extra_gtq: costo });
      setSolicitudes(solicitudes.map(s => s.id === solicitudId ? { ...s, costo_extra_gtq: costo } : s));
    } catch (err: any) {
      setError('Error actualizando costo: ' + err.message);
    }
  };

  if (loading) return <div>Cargando solicitudes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-full mx-auto mt-10 p-6 border rounded-lg shadow overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Panel Administrativo</h2>
        <a
          href="/admin/supervisor"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 4.883 4.883 0 00-5.931 0c-1.153.77-2.902 0-2.902-1.638v-.03c0-1.666 1.352-3.003 3-3.003 1.648 0 3 1.337 3 3.003" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25h-7.5" />
          </svg>
          Bandeja de Mensajes
        </a>
        <div className="flex gap-2">
          <a
            href="/admin/dashboard"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Dashboard Completados
          </a>
          <a
            href="/admin/clientes"
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 5.472m0 0a9.094 9.094 0 00-4.962.816M21 12.75a6.002 6.002 0 01-12 0 6.002 6.002 0 0112 0z" />
            </svg>
            Gestión Clientes
          </a>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border mb-6 text-xs">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-200">#</th>
              <th className="border p-2 bg-gray-200">Fecha</th>
              <th className="border p-2 bg-gray-200">Ticket</th>
              <th className="border p-2 bg-gray-200">Número de Guías</th>
              <th className="border p-2 bg-gray-200">Marca</th>
              <th className="border p-2 bg-gray-200">Modelo</th>
              <th className="border p-2 bg-gray-200">Tipo de Producto</th>
              <th className="border p-2 bg-gray-200">Dirección</th>
              <th className="border p-2 bg-gray-200">Quien entrega</th>
              <th className="border p-2 bg-gray-200">Teléfono</th>
              <th className="border p-2 bg-gray-200">Referencia</th>
              <th className="border p-2 bg-gray-200">Nota/Comentarios</th>
              <th className="border p-2 bg-gray-200">Estatus</th>
              <th className="border p-2 bg-gray-200">Chat</th>
              <th className="border p-2 bg-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s, idx) => (
              <tr key={s.id} className="hover:bg-gray-50 transition">
                <td className="border p-2 text-center">{idx + 1}</td>
                <td className="border p-2 text-xs">{s.creado_el ? new Date(s.creado_el).toLocaleDateString() + ' ' + new Date(s.creado_el).toLocaleTimeString() : '-'}</td>
                <td className="border p-2">{s.ticket_life_one}</td>
                <td className="border p-2">
                  {s.guia_caex_referencia && !s._editing_guia ? (
                    <div className="flex flex-row justify-between items-center gap-2">
                      <span className="font-bold text-gray-800">{s.guia_caex_referencia}</span>
                      {s.estatus !== 'Recibida en CSA' && s.estatus !== 'CANCELADO' && (
                        <button
                          className="text-gray-500 hover:text-blue-600"
                          title="Editar Guía"
                          onClick={() => setSolicitudes(solicitudes.map(sol =>
                            sol.id === s.id ? { ...sol, _editing_guia: true, _guia_input: sol.guia_caex_referencia } : sol
                          ))}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-row gap-2 items-center">
                      <input
                        type="text"
                        className="p-1 border rounded w-24 text-center"
                        value={s._guia_input !== undefined ? s._guia_input : (s.guia_caex_referencia || '')}
                        placeholder="N° Guía"
                        onChange={e => setSolicitudes(solicitudes.map(sol => sol.id === s.id ? { ...sol, _guia_input: e.target.value } : sol))}
                        onKeyDown={async e => {
                          if (e.key === 'Enter') {
                            if (!s.id) return;
                            const nuevaGuia = s._guia_input !== undefined ? s._guia_input : s.guia_caex_referencia;
                            if (!nuevaGuia) return;
                            try {
                              await updateSolicitud(s.id, { guia_caex_referencia: nuevaGuia, estatus: 'Pendiente de Recolección' });
                              // Registrar en bitácora
                              await registrarMovimiento({
                                solicitud_id: s.id,
                                usuario: user?.email || 'admin',
                                estatus: 'Pendiente de Recolección'
                              });

                              setSolicitudes(solicitudes.map(sol => sol.id === s.id ? {
                                ...sol,
                                guia_caex_referencia: nuevaGuia,
                                estatus: 'Pendiente de Recolección',
                                _guia_input: undefined,
                                _editing_guia: false
                              } : sol));
                            } catch (err: any) {
                              setError('Error guardando guía: ' + err.message);
                            }
                          }
                        }}
                      />
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                        onClick={async () => {
                          if (!s.id) {
                            setError('Error: Solicitud sin ID, recargue la página');
                            return;
                          }
                          const nuevaGuia = s._guia_input !== undefined ? s._guia_input : s.guia_caex_referencia;
                          if (!nuevaGuia) return;

                          try {
                            // Al guardar la guía (pistolear), cambiamos status a Pendiente de Recolección
                            await updateSolicitud(s.id, { guia_caex_referencia: nuevaGuia, estatus: 'Pendiente de Recolección' });
                            // Registrar en bitácora
                            await registrarMovimiento({
                              solicitud_id: s.id,
                              usuario: user?.email || 'admin',
                              estatus: 'Pendiente de Recolección'
                            });
                            // Actualizar estado para reflejar el cambio, salir de modo edición y limpiar temporal
                            setSolicitudes(solicitudes.map(sol => sol.id === s.id ? {
                              ...sol,
                              guia_caex_referencia: nuevaGuia,
                              estatus: 'Pendiente de Recolección',
                              _guia_input: undefined,
                              _editing_guia: false
                            } : sol));
                          } catch (err: any) {
                            setError('Error guardando guía: ' + err.message);
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
                <td className="border p-2">{s.marca}</td>
                <td className="border p-2">{s.modelo}</td>
                <td className="border p-2">{s.tipo_producto}</td>
                <td className="border p-2">{s.info_entrega?.direccion}</td>
                <td className="border p-2">{s.info_entrega?.nombreEntrega}</td>
                <td className="border p-2">{s.info_entrega?.telefono}</td>
                <td className="border p-2">{s.referencia1}</td>
                <td className="border p-2">{s.info_entrega?.nota}</td>
                <td className="border p-2 text-center font-bold">
                  {s.estatus === 'Pendiente de Recolección' ? (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs w-full mb-1"
                      title="Marcar En Tránsito CSA"
                      onClick={async () => {
                        if (!confirm('¿Marcar como En Tránsito hacia CSA?')) return;
                        try {
                          await updateSolicitud(s.id, { estatus: 'En Tránsito_CSA' });
                          await registrarMovimiento({ solicitud_id: s.id, usuario: user?.email || 'admin', estatus: 'En Tránsito_CSA' });
                          setSolicitudes(prev => prev.map(sol => sol.id === s.id ? { ...sol, estatus: 'En Tránsito_CSA' } : sol));
                        } catch (e: any) { setError(e.message); }
                      }}
                    >
                      Enviar a CSA
                    </button>
                  ) : s.estatus === 'En Tránsito_CSA' ? (
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs w-full mb-1"
                      title="Marcar como Recibida en CSA"
                      onClick={async () => {
                        if (!confirm(`¿Confirmar recepción en CSA para la guía ${s.guia_caex_referencia}? (Finalizar)`)) return;
                        try {
                          await updateSolicitud(s.id, { estatus: 'Recibida en CSA' });
                          await registrarMovimiento({ solicitud_id: s.id, usuario: user?.email || 'admin', estatus: 'Recibida en CSA' });
                          setSolicitudes(prev => prev.map(sol => sol.id === s.id ? { ...sol, estatus: 'Recibida en CSA' } : sol));
                        } catch (e: any) { setError(e.message); }
                      }}
                    >
                      Recibir CSA
                    </button>
                  ) : (
                    <div className="flex flex-col gap-1 items-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${s.estatus === 'Recibida en CSA' ? 'bg-green-100 text-green-800' :
                        s.estatus === 'Pendiente de Guías' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {s.estatus}
                      </span>
                      {/* Boton de Retorno exclusivo para super admin */}
                      {s.estatus === 'Recibida en CSA' && user?.email === 'gurbanotcwmx@gmail.com' && (
                        <button
                          className="text-[10px] bg-orange-200 hover:bg-orange-300 text-orange-800 px-2 py-0.5 rounded border border-orange-300 mt-1"
                          onClick={async () => {
                            if (!confirm(`SUPER ADMIN: ¿Revertir solicitud ${s.ticket_life_one} a "En Tránsito"?`)) return;
                            try {
                              await updateSolicitud(s.id, { estatus: 'En Tránsito_CSA' });
                              await registrarMovimiento({ solicitud_id: s.id, usuario: user?.email || 'admin', estatus: 'En Tránsito_CSA (Revertido)' });
                              setSolicitudes(prev => prev.map(sol => sol.id === s.id ? { ...sol, estatus: 'En Tránsito_CSA' } : sol));
                            } catch (e: any) { setError(e.message); }
                          }}
                        >
                          Revertir Estado
                        </button>
                      )}
                    </div>
                  )}
                  {/* Legacy or Direct Completion via Scan (Optionally keep if user scans in other states, but simplified for now) */}
                </td>
                <td className="border p-2 text-center relative">
                  <button
                    className="p-1 text-gray-500 hover:text-blue-600 relative"
                    title="Abrir Chat"
                    onClick={() => setChatSolicitud(s)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 4.883 4.883 0 00-5.931 0c-1.153.77-2.902 0-2.902-1.638v-.03c0-1.666 1.352-3.003 3-3.003 1.648 0 3 1.337 3 3.003" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    {(() => {
                      const comentarios = s.comentarios || [];
                      if (comentarios.length === 0) return null;
                      const last = comentarios.sort((a: any, b: any) => new Date(b.creado_el).getTime() - new Date(a.creado_el).getTime())[0];
                      // If last message is from Cliente, show red dot
                      if (last.autor && last.autor.includes('Cliente')) {
                        return <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-600 ring-2 ring-white" title="Nuevo mensaje"></span>;
                      }
                      return null;
                    })()}
                  </button>
                </td>
                <td className="border p-2 text-center flex flex-row gap-2 justify-center">
                  <button
                    className={`px-2 py-1 rounded text-white text-xs ${!s.guia_caex_referencia ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={() => s.guia_caex_referencia && generarPDFGuia(s)}
                    disabled={!s.guia_caex_referencia}
                    title={!s.guia_caex_referencia ? 'Debe asignar una guía primero' : ''}
                  >Crear Guía</button>
                  <button
                    className={`px-2 py-1 rounded text-white text-xs ${!s.guia_caex_referencia ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    onClick={() => s.guia_caex_referencia && generarPDFManifiesto(s)}
                    disabled={!s.guia_caex_referencia}
                    title={!s.guia_caex_referencia ? 'Debe asignar una guía primero' : ''}
                  >Crear Manifiesto</button>
                  <button
                    className={`px-2 py-1 rounded text-white text-xs ml-2 ${s.estatus === 'Recibida en CSA' || s.estatus === 'CANCELADO' ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                    onClick={async () => {
                      if (s.estatus === 'Recibida en CSA' || s.estatus === 'CANCELADO') return;
                      if (!confirm(`¿Estás seguro de CANCELAR la solicitud ${s.ticket_life_one}?`)) return;
                      try {
                        await updateSolicitud(s.id, { estatus: 'CANCELADO' });
                        await registrarMovimiento({ solicitud_id: s.id, usuario: user?.email || 'admin', estatus: 'CANCELADO' });
                        setSolicitudes(prev => prev.map(sol => sol.id === s.id ? { ...sol, estatus: 'CANCELADO' } : sol));
                      } catch (e: any) { setError(e.message); }
                    }}
                    title={s.estatus === 'Recibida en CSA' || s.estatus === 'CANCELADO' ? 'No se puede cancelar una solicitud recibida o ya cancelada' : "Cancelar Solicitud"}
                    disabled={s.estatus === 'Recibida en CSA' || s.estatus === 'CANCELADO'}
                  >Cancelar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {
        chatSolicitud && (
          <ComentariosModal
            solicitudId={chatSolicitud.id}
            ticket={chatSolicitud.ticket_life_one}
            usuarioActual={`Proveedor (${user?.email || 'Admin'})`}
            onClose={() => setChatSolicitud(null)}
          />
        )
      }
    </div >
  );
}

