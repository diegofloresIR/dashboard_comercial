import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Target, Edit2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Targets = () => {
    const { metrics, user, addToast } = useStore();

    const [targetRevenue, setTargetRevenue] = useState(500000);
    const [isEditing, setIsEditing] = useState(false);
    const [tempTarget, setTempTarget] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchTarget = async () => {
            try {
                const { data } = await supabase
                    .from('app_settings')
                    .select('value')
                    .eq('key', 'revenue_target')
                    .single();

                if (data?.value?.amount) {
                    setTargetRevenue(Number(data.value.amount));
                }
            } catch (err) {
                console.error("No custom target found, using default.", err);
            }
        };
        fetchTarget();
    }, []);

    const handleSave = async () => {
        const amount = Number(tempTarget);
        if (isNaN(amount) || amount <= 0) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key: 'revenue_target',
                    value: { amount }
                });

            if (!error) {
                setTargetRevenue(amount);
                setIsEditing(false);
            } else {
                addToast('Error al guardar el objetivo. ¿Tienes permisos de Admin?', 'error');
            }
        } catch (err) {
            console.error("Save error:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const currentRevenue = metrics?.revenue || 0;
    const diff = targetRevenue - currentRevenue;
    const percentage = Math.min((currentRevenue / targetRevenue) * 100, 100);

    return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 text-center max-w-3xl mx-auto mt-10">
            <div className="flex justify-end mb-4 h-8">
                {user?.role === 'admin' && !isEditing && (
                    <button
                        onClick={() => { setTempTarget(targetRevenue.toString()); setIsEditing(true); }}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-medium transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                        Editar Objetivo
                    </button>
                )}
            </div>

            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner rotate-3 hover:rotate-0 transition-transform">
                <Target className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Objetivo Mensual</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">Seguimiento del objetivo general de facturación del equipo.</p>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex justify-between items-end mb-4 relative z-10">
                    <div className="text-left">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Logrado</p>
                        <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">€{currentRevenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Meta</p>

                        {isEditing ? (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">€</span>
                                <input
                                    type="number"
                                    value={tempTarget}
                                    onChange={(e) => setTempTarget(e.target.value)}
                                    className="w-32 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1 text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    autoFocus
                                />
                                <button onClick={handleSave} disabled={isSaving} className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50">
                                    <Save className="w-5 h-5" />
                                </button>
                                <button onClick={() => setIsEditing(false)} className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">€{targetRevenue.toLocaleString()}</p>
                        )}

                    </div>
                </div>

                <div className="relative w-full h-8 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6 shadow-inner z-10">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out flex flex-col justify-center overflow-hidden"
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-20"></div>
                    </div>
                </div>

                <div className="flex justify-between text-sm font-bold z-10 relative">
                    <span className="text-slate-600 dark:text-slate-300">{percentage.toFixed(1)}% Completado</span>
                    <span className={diff > 0 ? 'text-rose-500' : 'text-emerald-500'}>
                        {diff > 0 ? `Faltan €${diff.toLocaleString()}` : `Superado por €${Math.abs(diff).toLocaleString()}`}
                    </span>
                </div>
            </div>
        </div>
    );
};
