"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSupabaseAuth } from '@/lib/supabaseAuth';
import { getClientes, Cliente } from '@/lib/clientes';
import { getTiendasByCliente, Tienda } from '@/lib/tiendas';

export default function SolicitudPage() {
  const { user, loading } = useSupabaseAuth();

  // Estado para Clientes
  const [clienteId, setClienteId] = useState('');
  const [clientesItems, setClientesItems] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  // Estado para Tiendas (dependiente de Cliente)
  const [tienda, setTienda] = useState('');
  const [tiendasItems, setTiendasItems] = useState<Tienda[]>([]);
  const [loadingTiendas, setLoadingTiendas] = useState(false);

  // Estado del formulario general
  const [tipoProducto, setTipoProducto] = useState('');
  const [marca, setMarca] = useState(''); // Nuevo estado
  const [modelo, setModelo] = useState(''); // Nuevo estado
  const [ticket, setTicket] = useState('');
  const [direccion, setDireccion] = useState('');
  const [nombreEntrega, setNombreEntrega] = useState('');
  const [telefono, setTelefono] = useState('');
  const [referencia1, setReferencia1] = useState('');
  const [referencia2, setReferencia2] = useState('');
  const [nota, setNota] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ... (useEffects sin cambios)

  // Cargar clientes al inicio
  useEffect(() => {
    async function loadClientes() {
      try {
        const data = await getClientes();
        setClientesItems(data);
      } catch (e) {
        console.error("Error loading clientes", e);
      } finally {
        setLoadingClientes(false);
      }
    }
    loadClientes();
  }, []);

  // Cargar tiendas cuando cambia el cliente
  useEffect(() => {
    async function loadTiendas() {
      if (!clienteId) {
        setTiendasItems([]);
        return;
      }
      setLoadingTiendas(true);
      setTienda(''); // Resetear tienda seleccionada
      try {
        const data = await getTiendasByCliente(clienteId);
        setTiendasItems(data);
      } catch (e) {
        console.error("Error loading tiendas", e);
      } finally {
        setLoadingTiendas(false);
      }
    }
    loadTiendas();
  }, [clienteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user || !user.id) {
      setError('Usuario no válido.');
      return;
    }

    if (!clienteId) {
      setError('Debe seleccionar un cliente.');
      return;
    }

    try {
      // Validar si el ticket ya existe
      const { data: existingTicket, error: checkError } = await supabase
        .from('solicitudes')
        .select('id')
        .eq('ticket_life_one', ticket)
        .maybeSingle();

      if (checkError) {
        console.error("Error validando ticket", checkError);
        // Opcional: decidir si bloquear o no, por seguridad bloqueamos si hay duda
      }

      if (existingTicket) {
        setError(`El Ticket Life-One "${ticket}" ya ha sido registrado previamente.`);
        return;
      }

      // Obtener nombre de la tienda seleccionada si existe
      const tiendaSeleccionada = tiendasItems.find(t => t.id === tienda);
      const nombreTienda = tiendaSeleccionada ? tiendaSeleccionada.nombre : '';

      // Info de entrega simplificada (sin depto/muni)
      const info_entrega = {
        direccion,
        tienda: nombreTienda,
        nombreEntrega,
        telefono,
        nota,
      };

      const { error: solicitudError } = await supabase.from('solicitudes').insert([
        {
          ticket_life_one: ticket,
          cliente_id: clienteId,
          tipo_producto: tipoProducto,
          marca: marca,
          modelo: modelo,
          tienda: nombreTienda, // Columna explicita
          direccion_entrega: direccion, // Columna explicita
          telefono_contacto: telefono, // Columna explicita
          referencia1,
          referencia2,
          info_entrega,
          creado_por: nombreEntrega,
          creado_el: new Date().toISOString(),
          estatus: 'Pendiente de Guías',
        },
      ]);

      if (solicitudError) throw solicitudError;

      setSuccess('Solicitud creada correctamente.');
      // Reset form
      setClienteId('');
      setTipoProducto('');
      setMarca('');
      setModelo('');
      setTicket('');
      setDireccion('');
      setNombreEntrega('');
      setTelefono('');
      setReferencia1('');
      setReferencia2('');
      setNota('');
      // No reset tienda here, it resets via useEffect when clienteId changes, but let's be safe
      setTienda('');

    } catch (err: any) {
      console.error('Solicitud error FULL:', JSON.stringify(err, null, 2));
      console.error('Solicitud error properties:', err.message, err.code, err.details, err.hint);

      let msg = 'Ocurrió un error desconocido.';
      if (err.message) msg = `Error: ${err.message}`;
      if (err.details) msg += ` (${err.details})`;

      setError(msg);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>Debes iniciar sesión para crear una solicitud.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Nueva Solicitud</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selección de Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <select
            value={clienteId}
            onChange={e => setClienteId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona Cliente</option>
            {loadingClientes ? (
              <option disabled>Cargando clientes...</option>
            ) : clientesItems.length > 0 ? (
              clientesItems.map((c: any) => <option key={c.id} value={c.id}>{c.nombre}</option>)
            ) : (
              <option disabled>No hay clientes registrados</option>
            )}
          </select>
        </div>

        {/* Selección de Tienda (Si hay clientes y tiendas cargadas) */}
        {clienteId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tienda / Sucursal</label>
            <select
              value={tienda}
              onChange={e => {
                setTienda(e.target.value);
                // No autocompletar dirección, dejar vacía para input manual
                setDireccion('');
              }}
              className="w-full p-2 border rounded"
              disabled={loadingTiendas}
            >
              <option value="">Selecciona Tienda (Opcional)</option>
              {tiendasItems.map((t: any) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
            {tiendasItems.length === 0 && !loadingTiendas && (
              <p className="text-xs text-gray-500 mt-1">Este cliente no tiene tiendas registradas.</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Exacta</label>
          <input type="text" placeholder="Calle, Avenida, Zona, etc." value={direccion} onChange={e => setDireccion(e.target.value)} required className="w-full p-2 border rounded" />
        </div>

        <input type="text" placeholder="Tipo de Producto (e.g. Celular, Laptop)" value={tipoProducto} onChange={e => setTipoProducto(e.target.value)} required className="w-full p-2 border rounded" />

        <div className="flex gap-4">
          <input type="text" placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} className="w-1/2 p-2 border rounded" />
          <input type="text" placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} className="w-1/2 p-2 border rounded" />
        </div>

        <input type="text" placeholder="Ticket Life-One" value={ticket} onChange={e => setTicket(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Nombre de la Persona que entrega" value={nombreEntrega} onChange={e => setNombreEntrega(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Referencia 1" value={referencia1} onChange={e => setReferencia1(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Referencia 2" value={referencia2} onChange={e => setReferencia2(e.target.value)} className="w-full p-2 border rounded" />
        <textarea placeholder="Nota / Comentarios" value={nota} onChange={e => setNota(e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Crear Solicitud</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </form>
    </div>
  );
}
