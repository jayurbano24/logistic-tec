"use client";

import Link from 'next/link';
import { useSupabaseAuth } from '../lib/supabaseAuth';

export default function Navbar() {
  const { user, loading } = useSupabaseAuth();

  return (
    <nav className="bg-white shadow flex items-center justify-between px-6 py-3 mb-8">
      <div className="font-bold text-xl text-blue-700">Logistic Tec</div>
      <div className="flex gap-4 items-center">
        {user?.email === 'gurbanotcwmx@gmail.com' && (
          <Link href="/register" className="text-blue-600 hover:underline">Registro</Link>
        )}
        <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        <Link href="/solicitud" className="text-blue-600 hover:underline">Solicitud</Link>

        <Link href="/solicitud/listado" className="text-blue-600 hover:underline">Mis Solicitudes</Link>
        {user?.email === 'gurbanotcwmx@gmail.com' && (
          <>
            <Link href="/admin" className="text-blue-600 hover:underline">Admin</Link>
            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
          </>
        )}
        {/* Mostrar usuario logueado */}
        {!loading && user && (
          <span className="ml-4 text-gray-700 font-medium">{user.email}</span>
        )}
      </div>
    </nav>
  );
}
