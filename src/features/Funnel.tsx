import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { BarChart2, TrendingDown } from 'lucide-react';
import { EmptyState, ChartSkeleton } from '../components/ui/Indicators';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell
} from 'recharts';

export const Funnel = () => {
    const { pipelines, connection, filters } = useStore();
    const [funnelData, setFunnelData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFunnel = async () => {
            if (!connection) return;
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    locationId: connection.location_id,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    pipelineId: filters.pipelineId || (pipelines[0]?.id || '')
                });
                const res = await fetch(`/api/metrics/funnel?${query.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setFunnelData(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error('Error fetching funnel data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (pipelines.length > 0) {
            fetchFunnel();
        }
    }, [connection, filters, pipelines]);

    if (loading) return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ChartSkeleton />
        </div>
    );

    if (funnelData.length === 0) {
        return <EmptyState title="Cargando embudo..." description="Selecciona un pipeline para ver el análisis de conversión por etapas." icon={BarChart2} />;
    }

    // Calculate conversion rates between stages
    const enrichedData = funnelData.map((stage: any, index: number, arr: any[]) => {
        const prevCount = index === 0 ? stage.count : arr[index - 1].count;
        const conversionRate = prevCount > 0 ? (stage.count / prevCount) * 100 : 0;
        const dropOff = 100 - conversionRate;

        return {
            ...stage,
            conversionRate,
            dropOff,
            isBottleneck: dropOff > 50 && index > 0 // Highlight if drop-off is > 50%
        };
    });

    const CustomFunnelTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700">
                    <p className="font-bold text-slate-900 dark:text-white mb-2">{data.name}</p>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Oportunidades: <span className="font-bold text-indigo-600 dark:text-indigo-400">{data.count}</span></p>
                        {data.conversionRate > 0 && data.conversionRate < 100 && (
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Conversión desde ant: <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.conversionRate.toFixed(1)}%</span>
                            </p>
                        )}
                        {data.dropOff > 0 && data.dropOff < 100 && (
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1 text-rose-500 text-xs font-bold">
                                <TrendingDown className="w-3 h-3" />
                                Dropeo: {data.dropOff.toFixed(1)}%
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <BarChart2 className="w-6 h-6 text-indigo-500" />
                        Análisis de Conversión (Funnel)
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">Identifica los cuellos de botella en tu proceso de ventas.</p>
                </div>
            </div>

            <div className="h-[500px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrichedData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} width={150} />
                        <Tooltip content={<CustomFunnelTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                        <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={40}>
                            {enrichedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.isBottleneck ? '#fbbf24' : '#6366f1'}
                                    fillOpacity={0.8 + (index * 0.05)}
                                />
                            ))}
                            <LabelList dataKey="count" position="right" fill="#64748b" className="font-bold text-sm" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 opacity-80"></div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Flujo Normal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400 opacity-80 animate-pulse"></div>
                    <span className="text-slate-600 dark:text-slate-300 font-bold">⚠️ Cuello de botella (&gt;50% caída)</span>
                </div>
            </div>
        </div>
    );
};
