"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { createUserProfile } from '@/lib/supabaseRoles';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [rol, setRol] = useState<'ADMIN' | 'EMPLEADO' | 'CLIENTE'>('CLIENTE');
  const [empresa, setEmpresa] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError || !data.user) {
      let msg = signUpError?.message || 'No se pudo registrar';
      if (msg.toLowerCase().includes('security purposes')) {
        msg = 'Por seguridad, debes esperar unos segundos antes de volver a intentar el registro.';
      }
      setError(msg);
      return;
    }
    try {
      await createUserProfile({
        id: data.user.id,
        nombre_usuario,
        rol,
        empresa,
      });
      setSuccess('Registro exitoso. Revisa tu correo para confirmar.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Nombre de usuario" value={nombre_usuario} onChange={e => setNombreUsuario(e.target.value)} required className="w-full p-2 border rounded" />
        <select value={rol} onChange={e => setRol(e.target.value as any)} className="w-full p-2 border rounded">
          <option value="CLIENTE">Cliente</option>
          <option value="EMPLEADO">Empleado</option>
          <option value="ADMIN">Admin</option>
        </select>
        <input type="text" placeholder="Empresa (opcional)" value={empresa} onChange={e => setEmpresa(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Registrarse</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </form>
    </div>
  );
}
