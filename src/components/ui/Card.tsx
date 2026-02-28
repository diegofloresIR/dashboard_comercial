import React from 'react';
import CountUp from 'react-countup';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CardProps {
    title: string;
    value: number | string;
    subValue?: string;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    isCurrency?: boolean;
}

export const Card = ({ title, value, subValue, icon: Icon, trend, trendValue, isCurrency }: CardProps) => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
    const isNumber = !isNaN(numericValue) && typeof value !== 'string' || (typeof value === 'string' && !isNaN(parseFloat(value)));

    return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 transition-colors">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend === 'up'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                        }`}>
                        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {trendValue}
                    </div>
                )}
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {isNumber ? (
                        <CountUp
                            end={numericValue}
                            duration={2}
                            separator=","
                            decimals={numericValue % 1 !== 0 ? 1 : 0}
                            prefix={isCurrency ? '€' : ''}
                            suffix={typeof value === 'string' && value.includes('%') ? '%' : ''}
                        />
                    ) : (
                        value
                    )}
                </span>
                {subValue && <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">{subValue}</span>}
            </div>
        </div>
    );
};
