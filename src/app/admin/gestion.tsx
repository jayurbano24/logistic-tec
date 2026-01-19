"use client";
import { useEffect, useState } from 'react';
import { getSolicitudes, updateSolicitud } from '@/lib/solicitudes';

export default function GestionAdmin() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getSolicitudes().then(setSolicitudes).catch(err => setError(err.message));
  }, []);

  const handleCoordinacion = async (id: string, guia: string, pdfUrl: string, manifiestoUrl: string) => {
    try {
      await updateSolicitud(id, {
        guia_caex_referencia: guia,
        archivos_url: { pdf_caex: pdfUrl, manifiesto_interno: manifiestoUrl },
        estatus: 'COORDINADA',
      });
      setSolicitudes(solicitudes.map(s => s.id === id ? { ...s, guia_caex_referencia: guia, archivos_url: { pdf_caex: pdfUrl, manifiesto_interno: manifiestoUrl }, estatus: 'COORDINADA' } : s));
    } catch (err: any) {
      setError('Error al coordinar: ' + err.message);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Gestión de Solicitudes</h2>
      <table className="w-full border mb-6">
        <thead>
          <tr>
            <th className="border p-2">Ticket</th>
            <th className="border p-2">Cliente</th>
            <th className="border p-2">Estatus</th>
            <th className="border p-2">Guía CAEX</th>
            <th className="border p-2">PDF CAEX</th>
            <th className="border p-2">Manifiesto</th>
            <th className="border p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map(s => (
            <tr key={s.id}>
              <td className="border p-2">{s.ticket_life_one}</td>
              <td className="border p-2">{s.cliente_id}</td>
              <td className="border p-2">{s.estatus}</td>
              <td className="border p-2">{s.guia_caex_referencia || '-'}</td>
              <td className="border p-2">{s.archivos_url?.pdf_caex ? <a href={s.archivos_url.pdf_caex} target="_blank">Ver PDF</a> : '-'}</td>
              <td className="border p-2">{s.archivos_url?.manifiesto_interno ? <a href={s.archivos_url.manifiesto_interno} target="_blank">Ver Manifiesto</a> : '-'}</td>
              <td className="border p-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleCoordinacion(s.id, prompt('Guía CAEX:') || '', prompt('URL PDF CAEX:') || '', prompt('URL Manifiesto:') || '')}>Coordinar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
