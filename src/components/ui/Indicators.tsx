import React from 'react';
import { SearchX } from 'lucide-react';

export const CardSkeleton = () => (
    <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
        <div className="w-32 h-8 bg-slate-300 dark:bg-slate-600 rounded"></div>
    </div>
);

export const ChartSkeleton = () => (
    <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse h-full min-h-[350px] flex flex-col">
        <div className="w-48 h-6 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
        <div className="flex-1 flex items-end justify-between gap-4 pb-4">
            {[40, 70, 45, 90, 65, 30, 85].map((height, i) => (
                <div key={i} className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm" style={{ height: `${height}%`, opacity: 0.5 + (i * 0.05) }}></div>
            ))}
        </div>
    </div>
);

export const TableSkeleton = () => (
    <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse overflow-hidden">
        <div className="h-12 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700"></div>
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 border-b border-slate-100 dark:border-slate-700/50 flex items-center px-6 gap-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="w-48 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded ml-auto"></div>
                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
        ))}
    </div>
);

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: any;
}

export const EmptyState = ({ title, description, icon: Icon = SearchX }: EmptyStateProps) => (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-600 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Icon className="w-10 h-10 text-indigo-400 dark:text-indigo-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {description}
        </p>
    </div>
);
