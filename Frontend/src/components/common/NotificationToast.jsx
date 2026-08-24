import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const NotificationToast = () => {
  const { notification } = useAuth();

  if (!notification) return null;

  const typeStyles = {
    success: 'bg-emerald-900/90 border-emerald-500 text-emerald-100 shadow-emerald-900/30',
    error: 'bg-rose-900/90 border-rose-500 text-rose-100 shadow-rose-900/30',
    info: 'bg-slate-900/90 border-teal-500 text-slate-100 shadow-slate-900/30',
    warning: 'bg-amber-900/90 border-amber-500 text-amber-100 shadow-amber-900/30'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-bounce duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all ${typeStyles[notification.type] || typeStyles.info}`}>
        {icons[notification.type] || icons.info}
        <p className="text-sm font-medium pr-2">{notification.message}</p>
      </div>
    </div>
  );
};

export default NotificationToast;
