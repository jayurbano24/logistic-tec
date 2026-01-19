"use client";

import { useEffect, useState } from 'react';
import { getSolicitudes } from '@/lib/solicitudes';
import { useSupabaseAuth } from '@/lib/supabaseAuth';
import ComentariosModal from '@/components/ComentariosModal';

export default function SupervisorDashboard() {
    const { user, loading: authLoading } = useSupabaseAuth();
    const [conversaciones, setConversaciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chatSolicitud, setChatSolicitud] = useState<any>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getSolicitudes();

                // Filtrar solo solicitudes que tienen comentarios
                // y ordenarlas por el comentario más reciente
                const conChats = data
                    ?.filter((s: any) => s.comentarios && s.comentarios.length > 0)
                    .map((s: any) => {
                        // Ordenar comentarios del más reciente al más antiguo para sacar el último
                        const sortedComments = [...s.comentarios].sort(
                            (a: any, b: any) => new Date(b.creado_el).getTime() - new Date(a.creado_el).getTime()
                        );
                        return {
                            ...s,
                            lastComment: sortedComments[0],
                            unreadCount: 0 // Aquí podríamos lógica de no leídos si tuviéramos tracking
                        };
                    })
                    .sort((a: any, b: any) =>
                        new Date(b.lastComment.creado_el).getTime() - new Date(a.lastComment.creado_el).getTime()
                    );

                setConversaciones(conChats || []);
            } catch (error) {
                console.error("Error cargando conversaciones", error);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading) {
            loadData();
        }
    }, [authLoading]);

    if (authLoading || loading) return <div className="p-8 text-center text-gray-500">Cargando bandeja de supervisor...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bandeja de Supervisor</h1>
                    <p className="text-gray-500 mt-1">Monitoreo de conversaciones activas</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                    {conversaciones.length} Conversaciones Activas
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Conversaciones (Inbox) */}
                <div className="lg:col-span-1 bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700">
                        Chats Recientes
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {conversaciones.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                No hay conversaciones activas.
                            </div>
                        ) : (
                            conversaciones.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => setChatSolicitud(conv)}
                                    className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition-colors ${chatSolicitud?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-gray-900 text-sm">#{conv.ticket_life_one}</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(conv.lastComment.creado_el).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-800 mb-1 truncate">
                                        {conv.info_entrega?.nombreEntrega || 'Cliente Desconocido'}
                                    </div>
                                    <div className="text-xs text-gray-500 flex justify-between items-center">
                                        <span className="truncate max-w-[150px] italic">
                                            "{conv.lastComment.mensaje.substring(0, 30)}..."
                                        </span>
                                        {conv.lastComment.autor.toLowerCase().includes('cliente') && (
                                            <span className="h-2 w-2 rounded-full bg-red-500 ml-2" title="Último msj de Cliente"></span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Detalle del Chat y Caso Selectionado */}
                <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm overflow-hidden h-[600px] flex flex-col relative">
                    {chatSolicitud ? (
                        <div className="flex flex-col h-full">
                            {/* Header del Caso */}
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Ticket: {chatSolicitud.ticket_life_one}
                                    </h2>
                                    <div className="text-xs text-gray-500 flex gap-4 mt-1">
                                        <span>Status: <span className="font-semibold">{chatSolicitud.estatus}</span></span>
                                        <span>Guía: <span className="font-semibold">{chatSolicitud.guia_caex_referencia || 'N/A'}</span></span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setChatSolicitud(null)}
                                    className="lg:hidden text-gray-500"
                                >
                                    Cerrar
                                </button>
                            </div>

                            {/* Área de Chat Embebida (Reusando Modal pero ajustado o simplemente el componente) */}
                            {/* Nota: ComentariosModal está diseñado como un modal fixed. 
                    Para esta vista "Dashboard", sería ideal renderizarlo inline.
                    Por ahora, usaremos el Modal existente poniéndolo "encima", 
                    pero lo ideal sería refactorizar ComentariosChat para que no sea siempre Modal.
                    
                    Como solución rápida y efectiva por ahora: Lo mostraremos como el Modal normal
                    cuando se clickea, o intentaré usarlo aquí controlando su prop onClose para deseleccionar.
                */}
                            <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
                                <div className="text-center">
                                    <p className="text-gray-600 mb-4">Chat seleccionado. Presiona abrir para gestionar.</p>
                                    <button
                                        onClick={() => { /* El estado chatSolicitud ya está seteado, el modal se mostrará globalmente abajo */ }}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Ver Conversación Completa
                                    </button>

                                    {/* Resumen del caso */}
                                    <div className="mt-8 text-left bg-white p-6 rounded-lg shadow-sm border max-w-lg mx-auto">
                                        <h3 className="font-bold border-b pb-2 mb-2">Detalles del Caso</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="block text-gray-500">Destinatario</span>
                                                {chatSolicitud.info_entrega?.nombreEntrega}
                                            </div>
                                            <div>
                                                <span className="block text-gray-500">Teléfono</span>
                                                {chatSolicitud.info_entrega?.telefono}
                                            </div>
                                            <div className="col-span-2">
                                                <span className="block text-gray-500">Dirección</span>
                                                {chatSolicitud.info_entrega?.direccion}
                                            </div>
                                            <div>
                                                <span className="block text-gray-500">Producto</span>
                                                {chatSolicitud.tipo_producto} ({chatSolicitud.marca} {chatSolicitud.modelo})
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.159 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                            <p>Selecciona una conversación de la lista</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Renderizamos el Modal real "encima" si hay chat seleccionado, 
          para funcionalidad completa de chat en tiempo real */}
            {chatSolicitud && (
                <ComentariosModal
                    solicitudId={chatSolicitud.id}
                    ticket={chatSolicitud.ticket_life_one}
                    usuarioActual={`Supervisor (${user?.email || 'Admin'})`}
                    onClose={() => setChatSolicitud(null)}
                />
            )}
        </div>
    );
}
