import React from 'react';
import { useStore } from '../store/useStore';
import { Target } from 'lucide-react';

export const Targets = () => {
    const { metrics } = useStore();

    const currentRevenue = metrics?.revenue || 0;
    const targetRevenue = 500000; // Mock target
    const diff = targetRevenue - currentRevenue;
    const percentage = Math.min((currentRevenue / targetRevenue) * 100, 100);

    return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 text-center max-w-3xl mx-auto mt-10">
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
                        <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">€{targetRevenue.toLocaleString()}</p>
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
