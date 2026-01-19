"use client";
import { useState, useEffect, Fragment } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getClientes, addCliente, Cliente } from '@/lib/clientes';
import { getTiendasByCliente, addTienda, deleteTienda, Tienda } from '@/lib/tiendas';

export default function AdminClientesYTiendasPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form Clientes
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevaDireccion, setNuevaDireccion] = useState('');

    // Form Tiendas
    const [expandedCliente, setExpandedCliente] = useState<string | null>(null);
    const [tiendasCliente, setTiendasCliente] = useState<Tienda[]>([]);
    const [loadingTiendas, setLoadingTiendas] = useState(false);
    const [nuevaTiendaNombre, setNuevaTiendaNombre] = useState('');
    const [nuevaTiendaDireccion, setNuevaTiendaDireccion] = useState('');

    const fetchClientes = async () => {
        setLoading(true);
        try {
            const data = await getClientes();
            setClientes(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchTiendas = async (clienteId: string) => {
        setLoadingTiendas(true);
        try {
            const data = await getTiendasByCliente(clienteId);
            setTiendasCliente(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingTiendas(false);
        }
    };

    const toggleExpand = (clienteId: string) => {
        if (expandedCliente === clienteId) {
            setExpandedCliente(null);
            setTiendasCliente([]);
        } else {
            setExpandedCliente(clienteId);
            fetchTiendas(clienteId);
        }
    };

    const handleDeleteTienda = async (tiendaId: string) => {
        if (!confirm('¿Estás seguro de eliminar esta tienda?')) return;
        try {
            await deleteTienda(tiendaId);
            if (expandedCliente) fetchTiendas(expandedCliente);
        } catch (err: any) {
            alert('Error al eliminar tienda: ' + err.message);
        }
    };

    const handleAddCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoNombre) return;
        try {
            await addCliente({
                nombre: nuevoNombre,
                direccion: nuevaDireccion
            });
            setNuevoNombre('');
            setNuevaDireccion('');
            fetchClientes();
        } catch (err: any) {
            alert('Error al agregar cliente: ' + err.message);
        }
    };

    const handleAddTienda = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!expandedCliente || !nuevaTiendaNombre) return;
        try {
            await addTienda({
                cliente_id: expandedCliente,
                nombre: nuevaTiendaNombre,
                direccion: nuevaTiendaDireccion
            });
            setNuevaTiendaNombre('');
            setNuevaTiendaDireccion('');
            fetchTiendas(expandedCliente);
        } catch (err: any) {
            alert('Error al agregar tienda: ' + err.message);
        }
    };

    const seedDetalis = async () => {
        try {
            const defaults = ['UNICOMER', 'XIAOMI STORES', 'SIMAN'];
            // 1. Asegurar Clientes
            for (const nombre of defaults) {
                const existe = clientes.some(c => c.nombre.toUpperCase() === nombre);
                if (!existe) await addCliente({ nombre });
            }
            await fetchClientes(); // Recargar para tener IDs nuevos

            // 2. Asegurar Tiendas (Ejemplo básico)
            // Necesitamos re-leer los clientes para obtener sus IDs
            const { data: clientesActualizados } = await supabase.from('clientes').select('*');
            if (!clientesActualizados) return;

            const tiendasMap: any = {
                'UNICOMER': [
                    { nombre: 'Unicomer Video', direccion: '11 Avenida 32-51, Zona 5' },
                    { nombre: 'Unicomer Central', direccion: 'Avenida Bolivar 32-22, Zona 8' }
                ],
                'XIAOMI STORES': [
                    { nombre: 'Xiaomi Miraflores', direccion: 'CC Miraflores, Local 201' },
                    { nombre: 'Xiaomi Oakland', direccion: 'Oakland Mall, PB' }
                ],
                'SIMAN': [
                    { nombre: 'Siman Próceres', direccion: 'CC Los Próceres' },
                    { nombre: 'Siman Miraflores', direccion: 'CC Miraflores' }
                ]
            };

            for (const c of clientesActualizados) {
                const tiendasParaCliente = tiendasMap[c.nombre.toUpperCase()];
                if (tiendasParaCliente) {
                    for (const t of tiendasParaCliente) {
                        // Check si existe tienda
                        const { data: existingTienda } = await supabase
                            .from('tiendas')
                            .select('id')
                            .eq('cliente_id', c.id)
                            .eq('nombre', t.nombre)
                            .single();

                        if (!existingTienda) {
                            await addTienda({ ...t, cliente_id: c.id });
                        }
                    }
                }
            }

            alert('Datos predeterminados cargados correctamente.');
            fetchClientes();
            if (expandedCliente) fetchTiendas(expandedCliente);

        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 mt-6 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de Clientes y Tiendas</h1>
                <button
                    onClick={seedDetalis}
                    className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded border border-indigo-200 hover:bg-indigo-100"
                >
                    Cargar Datos Demo
                </button>
            </div>

            {/* Formulario Agregar Cliente */}
            <div className="mb-8 bg-gray-50 p-4 rounded border">
                <h3 className="font-semibold mb-2">Agregar Nuevo Cliente</h3>
                <form onSubmit={handleAddCliente} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Nombre Cliente</label>
                        <input
                            type="text"
                            value={nuevoNombre}
                            onChange={e => setNuevoNombre(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Ej. Tienda X"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Dirección (Opcional)</label>
                        <input
                            type="text"
                            value={nuevaDireccion}
                            onChange={e => setNuevaDireccion(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Ej. Zona 10..."
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Guardar Cliente
                    </button>
                </form>
            </div>

            {loading ? (
                <p>Cargando lista...</p>
            ) : (
                <div className="border rounded overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 w-10"></th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Dirección Central</th>
                                <th className="p-3 text-right">Tiendas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length > 0 ? clientes.map(c => (
                                <Fragment key={c.id}>
                                    <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(c.id)}>
                                        <td className="p-3 text-center text-gray-400">
                                            {expandedCliente === c.id ? '▼' : '▶'}
                                        </td>
                                        <td className="p-3 font-medium">{c.nombre}</td>
                                        <td className="p-3 text-gray-600 text-sm">{c.direccion || '-'}</td>
                                        <td className="p-3 text-right text-xs text-gray-500">
                                            Click para gestionar
                                        </td>
                                    </tr>
                                    {/* Panel Expandido de Tiendas */}
                                    {expandedCliente === c.id && (
                                        <tr className="bg-blue-50">
                                            <td colSpan={4} className="p-4 border-b">
                                                <div className="pl-4 border-l-4 border-blue-400">
                                                    <h4 className="font-bold mb-3 text-blue-800">Tiendas de {c.nombre}</h4>

                                                    {/* Form Agregar Tienda */}
                                                    <form onSubmit={handleAddTienda} className="flex gap-2 mb-4 items-end">
                                                        <input
                                                            type="text"
                                                            placeholder="Nombre Tienda / Sucursal"
                                                            value={nuevaTiendaNombre}
                                                            onChange={e => setNuevaTiendaNombre(e.target.value)}
                                                            className="flex-1 p-2 border rounded text-sm"
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Dirección Específica"
                                                            value={nuevaTiendaDireccion}
                                                            onChange={e => setNuevaTiendaDireccion(e.target.value)}
                                                            className="flex-1 p-2 border rounded text-sm"
                                                        />
                                                        <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                                                            + Agregar Tienda
                                                        </button>
                                                    </form>

                                                    {/* Lista Tiendas */}
                                                    {loadingTiendas ? (
                                                        <p className="text-sm text-gray-500">Cargando tiendas...</p>
                                                    ) : tiendasCliente.length > 0 ? (
                                                        <ul className="space-y-1">
                                                            {tiendasCliente.map(t => (
                                                                <li key={t.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border">
                                                                    <div>
                                                                        <span className="font-medium text-sm block">{t.nombre}</span>
                                                                        <span className="text-xs text-gray-500">{t.direccion}</span>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => handleDeleteTienda(t.id)}
                                                                            className="text-red-500 hover:text-red-700 text-xs px-2 py-1 border border-red-200 rounded hover:bg-red-50"
                                                                            title="Eliminar Tienda"
                                                                        >
                                                                            Eliminar
                                                                        </button>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-gray-400 italic">No hay tiendas registradas para este cliente.</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-gray-500">
                                        No hay clientes registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
