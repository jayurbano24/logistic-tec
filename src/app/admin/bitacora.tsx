import { useEffect, useState } from 'react';
import { getBitacoraBySolicitud } from '@/lib/bitacora';

export default function BitacoraPanel({ solicitudId }: { solicitudId: string }) {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBitacoraBySolicitud(solicitudId)
      .then(setMovimientos)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [solicitudId]);

  if (loading) return <div>Cargando bitácora...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Bitácora de Movimientos</h3>
      <ul className="border rounded p-4 bg-gray-50">
        {movimientos.map(mov => (
          <li key={mov.id} className="mb-2">
            <span className="font-bold">{mov.usuario}</span> cambió estatus a <span className="font-bold">{mov.estatus}</span> el <span className="text-gray-700">{new Date(mov.fecha_hora).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
