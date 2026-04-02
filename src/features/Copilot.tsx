import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { MessageSquare, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export const Copilot = () => {
    const { metrics } = useStore();
    const [asking, setAsking] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hola Admin. He analizado el dashboard y veo que el win-rate está estable. ¿Qué aspecto del pipeline quieres analizar hoy?',
            type: 'text'
        }
    ]);

    const currentRevenue = metrics?.revenue || 0;

    // What-If Calculator State
    const [simActivityBump, setSimActivityBump] = useState(20); // 20%
    const [simWinRate, setSimWinRate] = useState(parseFloat((metrics?.winRate || 25).toFixed(1)));
    const [simAvgDeal, setSimAvgDeal] = useState(metrics?.totalOpps > 0 ? currentRevenue / (metrics?.totalOpps * (metrics?.winRate / 100)) : 1500);

    const handleSimulate = () => {
        // Current trajectory
        const currentOpps = metrics?.totalOpps || 100;

        // Simulated trajectory
        const newOpps = currentOpps * (1 + (simActivityBump / 100));
        const newWon = newOpps * (simWinRate / 100);
        const newRevenue = newWon * simAvgDeal;

        const revenueBump = newRevenue - currentRevenue;

        setMessages(prev => [...prev, {
            role: 'assistant',
            content: `### Análisis What-If Completado\n\nSi incrementas la actividad un **+${simActivityBump}%** (generando ~${Math.round(newOpps)} oportunidades totales), mantienes un Win Rate del **${simWinRate}%** y un deal medio de **€${simAvgDeal.toFixed(0)}**:\n\n**Proyección de Ingresos:** €${newRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}\n**Crecimiento Esperado:** +€${revenueBump.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            type: 'text'
        }]);
    };

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg, type: 'text' }]);
        setAsking(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No hay sesión activa');

            const res = await fetch('/api/copilot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ query: userMsg, context: metrics })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Error ${res.status} del servidor`);
            }

            const data = await res.json();

            let content = data.answer || data.text || 'Sin respuesta del asistente.';
            if (data.drivers?.length) content += '\n\n**Factores clave:**\n' + data.drivers.map((d: string) => `• ${d}`).join('\n');
            if (data.recommendations?.length) content += '\n\n**Recomendaciones:**\n' + data.recommendations.map((r: string) => `• ${r}`).join('\n');

            setMessages(prev => [...prev, { role: 'assistant', content, type: 'text' }]);
        } catch (err: any) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${err.message}`,
                type: 'text'
            }]);
        } finally {
            setAsking(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* What-If Simulation Panel */}
            <div className="lg:col-span-1 border border-indigo-200 dark:border-indigo-500/30 rounded-3xl overflow-hidden shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="p-6 bg-indigo-50/80 dark:bg-indigo-900/40 border-b border-indigo-100 dark:border-indigo-800/50 relative z-10">
                    <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                        🧪 Simulador "What-If"
                    </h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">Calcula escenarios comerciales en tiempo real.</p>
                </div>

                <div className="p-6 space-y-6 relative z-10">
                    <div>
                        <label className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            <span>Incremento Actividad (Leads)</span>
                            <span className="text-indigo-600 dark:text-indigo-400">+{simActivityBump}%</span>
                        </label>
                        <input
                            type="range" min="0" max="100" step="5" value={simActivityBump}
                            onChange={(e) => setSimActivityBump(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                        />
                    </div>

                    <div>
                        <label className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            <span>Win Rate Proyectado</span>
                            <span className="text-indigo-600 dark:text-indigo-400">{simWinRate}%</span>
                        </label>
                        <input
                            type="range" min="1" max="100" step="0.5" value={simWinRate}
                            onChange={(e) => setSimWinRate(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                        />
                    </div>

                    <div>
                        <label className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            <span>Ticket Medio Estimado</span>
                            <span className="text-indigo-600 dark:text-indigo-400">€{simAvgDeal.toFixed(0)}</span>
                        </label>
                        <input
                            type="number" value={simAvgDeal}
                            onChange={(e) => setSimAvgDeal(Number(e.target.value))}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 font-bold text-slate-900 dark:text-white"
                        />
                    </div>

                    <button
                        onClick={handleSimulate}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" /> Ejecutar Simulación
                    </button>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-3xl shadow-sm flex flex-col h-[600px] overflow-hidden">
                <div className="p-6 border-b border-white/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                        AI Analytics Assistant
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4" /> Conectado a BBDD
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-200 dark:shadow-indigo-900/20'
                                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'
                                }`}>
                                {m.content.split('\n').map((line, j) => {
                                    if (line.startsWith('###')) return <h4 key={j} className="font-bold text-lg mb-2">{line.replace('###', '')}</h4>;
                                    if (line.startsWith('**')) return <p key={j} className="mb-1">{line.replace(/\*\*/g, '')}</p>;
                                    return <p key={j} className={`${j > 0 ? 'mt-2' : ''}`}>{line}</p>;
                                })}
                            </div>
                        </div>
                    ))}
                    {asking && (
                        <div className="flex justify-start">
                            <div className="bg-slate-100 dark:bg-slate-700/50 rounded-2xl rounded-bl-none p-4 flex gap-1 items-center shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                    <form onSubmit={handleAsk} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ej: ¿Por qué bajó el win rate esta semana?"
                            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || asking}
                            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-indigo-900/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
