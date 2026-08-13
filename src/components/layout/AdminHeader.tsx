import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Bell, ShieldCheck, Database, Layers } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/db';

export const AdminHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  const { session } = useAuth();
  const { stats } = useData();

  return (
    <header className="sticky top-0 z-20 bg-charcoal-900/80 backdrop-blur-md border-b border-gold-500/20 px-8 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-100">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-5">
        {/* Database Engine Indicator */}
        <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border border-gold-500/20 bg-charcoal-800 text-gray-300">
          <Database className="w-3.5 h-3.5 text-gold-400" />
          <span>Engine: <strong className="text-gold-400">{isSupabaseConfigured ? 'Supabase Cloud' : 'Reactive LocalStorage'}</strong></span>
        </div>

        {/* Quick Notifications Indicator */}
        <div className="relative">
          <div className="p-2 rounded-xl border border-gold-500/20 bg-charcoal-800 text-gray-300">
            <Bell className="w-4 h-4 text-gold-400" />
          </div>
          {(stats.pendingAppointments > 0 || stats.unreadMessages > 0) && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </div>

        {/* Logged-In User Profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gold-500/20">
          <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-400 flex items-center justify-center font-bold text-xs shadow-gold-sm">
            <ShieldCheck className="w-5 h-5 text-gold-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-100 tracking-wider">
              {session.user?.username || 'SELVAM'}
            </span>
            <span className="text-[10px] text-gold-400 uppercase tracking-widest">
              Owner / Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
