import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Comentario = {
    id: string;
    mensaje: string;
    autor: string;
    creado_el: string;
};

type Props = {
    solicitudId: string;
    ticket: string;
    usuarioActual: string; // Email o nombre para identificar al autor
    onClose: () => void;
};

export default function ComentariosModal({ solicitudId, ticket, usuarioActual, onClose }: Props) {
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchComentarios();
        // Suscripción a cambios en tiempo real
        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comentarios',
                    filter: `solicitud_id=eq.${solicitudId}`,
                },
                (payload) => {
                    setComentarios((prev) => [...prev, payload.new as Comentario]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [solicitudId]);

    useEffect(() => {
        // Scroll al fondo cuando llegan mensajes
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [comentarios]);

    async function fetchComentarios() {
        setLoading(true);
        const { data, error } = await supabase
            .from('comentarios')
            .select('*')
            .eq('solicitud_id', solicitudId)
            .order('creado_el', { ascending: true });

        if (!error && data) {
            setComentarios(data);
        }
        setLoading(false);
    }

    async function enviarMensaje() {
        if (!nuevoMensaje.trim()) return;

        const { error } = await supabase.from('comentarios').insert([
            {
                solicitud_id: solicitudId,
                mensaje: nuevoMensaje.trim(),
                autor: usuarioActual,
            },
        ]);

        if (!error) {
            setNuevoMensaje('');
        } else {
            console.error('Error enviando mensaje:', JSON.stringify(error, null, 2));
            alert('No se pudo enviar el mensaje: ' + (error.message || 'Error desconocido - ' + JSON.stringify(error)));
        }
    }

    const exportarChat = () => {
        const contenido = comentarios.map(c =>
            `[${new Date(c.creado_el).toLocaleString()}] ${c.autor}:\n${c.mensaje}\n`
        ).join('\n-------------------\n');

        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Chat_Ticket_${ticket}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg flex flex-col h-[600px]">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-100 rounded-t-lg">
                    <h3 className="font-bold text-lg">Chat - Ticket {ticket}</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={exportarChat}
                            className="text-gray-500 hover:text-blue-600 text-sm font-semibold underline"
                            title="Descargar historial"
                        >
                            Exportar
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold text-xl ml-2">
                            &times;
                        </button>
                    </div>
                </div>

                {/* Body - Lista de mensajes */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {loading ? (
                        <div className="text-center text-gray-500">Cargando comentarios...</div>
                    ) : comentarios.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">No hay comentarios aún.</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {comentarios.map((c) => {
                                const esMio = c.autor === usuarioActual;
                                return (
                                    <div
                                        key={c.id}
                                        className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${esMio
                                            ? 'bg-blue-100 self-end text-blue-900'
                                            : 'bg-white self-start text-gray-800 border'
                                            }`}
                                    >
                                        <div className="font-bold text-xs mb-1 text-opacity-75">{c.autor}</div>
                                        <div className="whitespace-pre-wrap">{c.mensaje}</div>
                                        <div className="text-[10px] text-right mt-1 opacity-60">
                                            {new Date(c.creado_el).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </div>
                    )}
                </div>

                {/* Footer - Input */}
                <div className="p-4 border-t bg-white rounded-b-lg flex gap-2">
                    <input
                        type="text"
                        className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Escribe un mensaje..."
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
                    />
                    <button
                        onClick={enviarMensaje}
                        disabled={!nuevoMensaje.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
}
