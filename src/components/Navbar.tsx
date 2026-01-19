"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabaseAuth } from '../lib/supabaseAuth';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const { user, profile, loading } = useSupabaseAuth();
  const router = useRouter();
  const lastActivityRef = useRef(Date.now());

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    if (!user) return;
    const updateActivity = () => { lastActivityRef.current = Date.now(); };
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(e => window.addEventListener(e, updateActivity));

    // Check inactivity every 10 seconds
    const interval = setInterval(() => {
      // 30 mins = 1800000 ms
      if (Date.now() - lastActivityRef.current > 1800000) {
        handleLogout();
      }
    }, 10000);

    return () => {
      events.forEach(e => window.removeEventListener(e, updateActivity));
      clearInterval(interval);
    };
  }, [user]);

  return (
    <nav className="bg-white shadow flex items-center justify-between px-6 py-3 mb-8">
      <div className="font-bold text-xl text-blue-700">Logistic Tec</div>
      <div className="flex gap-4 items-center">
        {user?.email === 'gurbanotcwmx@gmail.com' && (
          <Link href="/register" className="text-blue-600 hover:underline">Registro</Link>
        )}
        {!user && !loading && (
          <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        )}

        {/* Solicitud y Mis Solicitudes: Visible para Admin y Cliente (Oculto para Empleados) */}
        {(!profile || profile?.rol !== 'EMPLEADO') && (
          <>
            <Link href="/solicitud" className="text-blue-600 hover:underline">Solicitud</Link>
            <Link href="/solicitud/listado" className="text-blue-600 hover:underline">Mis Solicitudes</Link>
          </>
        )}

        {/* Admin y Dashboard: Visible para Admin y Empleado (y superusuario legacy) */}
        {(profile?.rol === 'ADMIN' || profile?.rol === 'EMPLEADO' || user?.email === 'gurbanotcwmx@gmail.com') && (
          <>
            <Link href="/admin" className="text-blue-600 hover:underline">Admin</Link>
            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
          </>
        )}

        {/* Mostrar usuario logueado y Logout */}
        {!loading && user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">{profile?.nombre_usuario || user.email} {profile?.rol ? `(${profile.rol})` : ''}</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline font-semibold"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
