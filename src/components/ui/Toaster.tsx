import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Toaster = () => {
    const { toasts, removeToast } = useStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-xl pointer-events-auto min-w-[280px] max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300 ${
                        toast.type === 'success'
                            ? 'bg-emerald-50/95 dark:bg-emerald-900/80 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                            : toast.type === 'error'
                            ? 'bg-red-50/95 dark:bg-red-900/80 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
                            : 'bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                >
                    {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />}
                    {toast.type === 'error' && <XCircle className="w-5 h-5 shrink-0 text-red-500" />}
                    {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-indigo-500" />}
                    <p className="text-sm font-medium flex-1">{toast.message}</p>
                    <button onClick={() => removeToast(toast.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
