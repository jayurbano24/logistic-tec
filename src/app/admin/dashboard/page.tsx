"use client";

import { useEffect, useState } from 'react';
import { getSolicitudes } from '@/lib/solicitudes';
import { getBitacoraBySolicitud } from '@/lib/bitacora';
import * as XLSX from 'xlsx';

// Función para obtener una fecha específica de los movimientos de bitácora
function getFechaPorEstatus(movimientos: any[], estatusBuscado: string) {
    const mov = movimientos.find(m => m.estatus === estatusBuscado);
    return mov ? new Date(mov.fecha_hora).toLocaleString() : '-';
}

export default function DashboardPage() {
    const [completados, setCompletados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalInicio, setModalInicio] = useState('');
    const [modalFin, setModalFin] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const allSolicitudes = await getSolicitudes();
                // Mostrar TODAS las solicitudes para trazabilidad completa
                const completadosRaw = allSolicitudes;

                const dataEnriquecida = [];
                // Procesar secuencialmente para evitar saturar conexiones
                for (const s of completadosRaw) {
                    let fechaPendienteRecoleccion = '-';
                    let fechaEnTransito = '-';
                    let fechaRecibida = '-';
                    let fechaCancelada = '-';

                    try {
                        const bitacora = await getBitacoraBySolicitud(s.id);
                        if (bitacora && bitacora.length > 0) {
                            fechaPendienteRecoleccion = getFechaPorEstatus(bitacora, 'Pendiente de Recolección') || getFechaPorEstatus(bitacora, 'ASIGNADO');
                            fechaEnTransito = getFechaPorEstatus(bitacora, 'En Tránsito_CSA');
                            fechaRecibida = getFechaPorEstatus(bitacora, 'Recibida en CSA') || getFechaPorEstatus(bitacora, 'COMPLETADO');
                            fechaCancelada = getFechaPorEstatus(bitacora, 'CANCELADO');
                        }
                    } catch (err: any) {
                        console.warn(`No se pudo cargar bitácora para solicitud ${s.ticket_life_one || s.id}:`, err.message || err);
                    }
                    dataEnriquecida.push({
                        ...s,
                        fecha_pendiente_guias: s.creado_el ? new Date(s.creado_el).toLocaleString() : '-',
                        fecha_pendiente_recoleccion: fechaPendienteRecoleccion,
                        fecha_en_transito: fechaEnTransito,
                        fecha_recibida: fechaRecibida,
                        fecha_cancelada: fechaCancelada,
                        raw_created_at: s.creado_el
                    });
                }

                if (isMounted) {
                    setCompletados(dataEnriquecida);
                }
            } catch (error) {
                console.error("Error cargando dashboard:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const exportarExcel = () => {
        let dataToExport = completados;

        if (modalInicio || modalFin) {
            const inicio = modalInicio ? new Date(modalInicio).setHours(0, 0, 0, 0) : 0;
            const fin = modalFin ? new Date(modalFin).setHours(23, 59, 59, 999) : Infinity;

            dataToExport = completados.filter(s => {
                if (!s.raw_created_at) return false;
                const fecha = new Date(s.raw_created_at).getTime();
                return fecha >= inicio && fecha <= fin;
            });
        }

        const data = dataToExport.map(item => ({
            'Ticket': item.ticket_life_one,
            'Guía': item.guia_caex_referencia,
            'Marca': item.marca,
            'Modelo': item.modelo,
            'Tipo': item.tipo_producto,
            'Dirección Exacta': item.info_entrega?.direccion || item.direccion_entrega,
            'Persona Entrega': item.info_entrega?.nombreEntrega,
            'Teléfono': item.info_entrega?.telefono || item.telefono_contacto,
            'Referencia': item.referencia1,
            'Nota/Comentarios': item.info_entrega?.nota,
            'Fecha Pendiente Guías': item.fecha_pendiente_guias, // Antes Creación
            'Fecha Pendiente Recolección': item.fecha_pendiente_recoleccion, // Antes Ingreso Guía
            'Fecha En Tránsito CSA': item.fecha_en_transito,
            'Fecha Recibida en CSA': item.fecha_recibida, // Antes Completado
            'Fecha Cancelada': item.fecha_cancelada
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Completados");
        XLSX.writeFile(workbook, `Reporte_Completados_${modalInicio || 'Inicio'}_${modalFin || 'Fin'}.xlsx`);
        setShowModal(false);
    };

    if (loading) return <div className="p-8 text-center">Cargando reporte de completados...</div>;

    return (
        <div className="w-full max-w-[98%] mx-auto mt-6 p-4 border rounded-lg shadow bg-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard de Completados</h1>
                    <p className="text-sm text-gray-500">Historial de solicitudes enviadas, finalizadas y canceladas</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Reporte
                    </button>
                    <a href="/admin" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center gap-2">
                        Volver al Panel
                    </a>
                </div>
            </div>

            {/* Modal de Reporte */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="text-lg font-bold mb-4">Generar Reporte Excel</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicial</label>
                                <input
                                    type="date"
                                    className="w-full border rounded p-2"
                                    value={modalInicio}
                                    onChange={(e) => setModalInicio(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Final</label>
                                <input
                                    type="date"
                                    className="w-full border rounded p-2"
                                    value={modalFin}
                                    onChange={(e) => setModalFin(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={exportarExcel}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded mt-2 flex justify-center items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Descargar Excel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full text-xs border-collapse border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 uppercase">
                        <tr>
                            <th className="border p-2">Ticket</th>
                            <th className="border p-2">Guía</th>
                            <th className="border p-2">Marca</th>
                            <th className="border p-2">Modelo</th>
                            <th className="border p-2">Tipo</th>
                            <th className="border p-2 w-48">Dirección</th>
                            <th className="border p-2">Persona Entrega</th>
                            <th className="border p-2">Teléfono</th>
                            <th className="border p-2">Referencia</th>
                            <th className="border p-2 w-32">Nota</th>
                            <th className="border p-2 bg-blue-50 text-blue-800" title="Fecha Pendiente de Guías (Creación)">F. Pendiente Guías</th>
                            <th className="border p-2 bg-yellow-50 text-yellow-800" title="Fecha Pendiente de Recolección (Ingreso Guía)">F. Pendiente Recolección</th>
                            <th className="border p-2 bg-orange-50 text-orange-800">F. En Tránsito CSA</th>
                            <th className="border p-2 bg-green-50 text-green-800">F. Recibida en CSA</th>
                            <th className="border p-2 bg-red-50 text-red-800">F. Cancelada</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-600">
                        {completados.length === 0 ? (
                            <tr>
                                <td colSpan={15} className="p-4 text-center">No hay solicitudes completadas.</td>
                            </tr>
                        ) : (
                            completados.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border p-2 font-medium">{item.ticket_life_one}</td>
                                    <td className="border p-2 font-bold text-gray-900">{item.guia_caex_referencia}</td>
                                    <td className="border p-2">{item.marca}</td>
                                    <td className="border p-2">{item.modelo}</td>
                                    <td className="border p-2">{item.tipo_producto}</td>
                                    <td className="border p-2 truncate max-w-xs" title={item.info_entrega?.direccion}>{item.info_entrega?.direccion}</td>
                                    <td className="border p-2">{item.info_entrega?.nombreEntrega}</td>
                                    <td className="border p-2">{item.info_entrega?.telefono}</td>
                                    <td className="border p-2">{item.referencia1}</td>
                                    <td className="border p-2 truncate max-w-[150px]" title={item.info_entrega?.nota}>{item.info_entrega?.nota}</td>
                                    <td className="border p-2 bg-blue-50 text-center">{item.fecha_pendiente_guias}</td>
                                    <td className="border p-2 bg-yellow-50 text-center">{item.fecha_pendiente_recoleccion}</td>
                                    <td className="border p-2 bg-orange-50 text-center">{item.fecha_en_transito}</td>
                                    <td className="border p-2 bg-green-50 text-center font-semibold text-xs">
                                        {item.fecha_recibida}
                                        {item.ultima_sincronizacion && (
                                            <div className="mt-1 text-[9px] text-gray-400">
                                                Validado: {new Date(item.ultima_sincronizacion).toLocaleDateString()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="border p-2 bg-red-50 text-center font-semibold text-red-700">{item.fecha_cancelada}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
