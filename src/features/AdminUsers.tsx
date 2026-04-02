import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { ShieldCheck, UserCog, Mail, Calendar, Loader2, Trash2, KeyRound } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
}

export function AdminUsers() {
    const { addToast } = useStore();
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch('/api/admin/users', {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            addToast('Error cargando usuarios. ¿Tienes permisos de administrador?', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingId(userId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!res.ok) throw new Error('Failed to update role');

            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            console.error(err);
            addToast('Error actualizando el rol', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteUser = async (userId: string, email: string) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario ${email}? Esta acción no se puede deshacer.`)) {
            return;
        }

        setUpdatingId(userId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (!res.ok) throw new Error('Error al eliminar usuario');

            setUsers(users.filter(u => u.id !== userId));
            addToast('Usuario eliminado correctamente', 'success');
        } catch (err) {
            console.error(err);
            addToast('Error al eliminar usuario', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleResetPassword = async (userId: string, email: string) => {
        if (!window.confirm(`¿Enviar correo de restablecimiento de contraseña a ${email}?`)) {
            return;
        }

        setUpdatingId(userId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (!res.ok) throw new Error('Error al enviar restablecimiento');

            addToast('Correo de restablecimiento enviado', 'success');
        } catch (err) {
            console.error(err);
            addToast('Error al enviar el correo de restablecimiento', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const roles = [
        { value: 'pending', label: 'Pendiente (Bloqueado)' },
        { value: 'viewer', label: 'Lector (Visualización)' },
        { value: 'closer', label: 'Closer (Ventas)' },
        { value: 'manager', label: 'Manager (Gestión)' },
        { value: 'admin', label: 'Administrador (Todo)' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-indigo-500" />
                        Gestión de Usuarios
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Administra los accesos y roles de los miembros del equipo.</p>
                </div>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Usuario</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Rol & Acceso</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Fecha de Registro</th>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                                <UserCog className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-white capitalize">
                                                    {user.full_name || 'Sin Nombre'}
                                                </div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                disabled={updatingId === user.id}
                                                className={`px-3 py-2 rounded-xl text-sm font-medium border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${user.role === 'pending'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50'
                                                        : user.role === 'admin'
                                                            ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50'
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50'
                                                    }`}
                                            >
                                                {roles.map(r => (
                                                    <option key={r.value} value={r.value}>{r.label}</option>
                                                ))}
                                            </select>
                                            {updatingId === user.id && <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(user.created_at), "d MMM, yyyy", { locale: es })}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleResetPassword(user.id, user.email)}
                                                disabled={updatingId === user.id}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                                                title="Restablecer Contraseña"
                                            >
                                                <KeyRound className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.email)}
                                                disabled={updatingId === user.id}
                                                className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                                                title="Eliminar Usuario"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
