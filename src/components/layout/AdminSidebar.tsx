import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Image as ImageIcon,
  Wrench,
  Layers,
  CalendarCheck,
  MessageSquare,
  Star,
  Settings,
  Globe,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const { stats } = useData();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase, badge: stats.totalProjects },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon, badge: stats.totalGallery },
    { name: 'Services', path: '/admin/services', icon: Wrench, badge: stats.totalServices },
    { name: 'Materials', path: '/admin/materials', icon: Layers },
    { name: 'Appointments', path: '/admin/appointments', icon: CalendarCheck, badge: stats.pendingAppointments, highlight: stats.pendingAppointments > 0 },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare, badge: stats.unreadMessages, highlight: stats.unreadMessages > 0 },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-charcoal-900 border-r border-gold-500/20 flex flex-col h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-gold-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gold-gradient p-0.5 shadow-gold-glow">
            <div className="w-full h-full bg-charcoal-900 rounded-[7px] flex items-center justify-center">
              <span className="font-serif font-bold text-gold-400 text-sm">JM</span>
            </div>
          </div>
          <div>
            <h2 className="font-serif font-bold text-gray-100 text-base tracking-wide">JM CMS</h2>
            <span className="text-[10px] text-gold-400 font-semibold tracking-wider uppercase block">
              Admin Portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gold-gradient text-charcoal-900 font-bold shadow-gold-glow'
                  : 'text-gray-400 hover:text-gold-400 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-charcoal-900' : 'text-gold-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      item.highlight
                        ? 'bg-red-500 text-white animate-pulse'
                        : isActive
                        ? 'bg-charcoal-900 text-gold-400'
                        : 'bg-gold-500/20 text-gold-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gold-500/20 space-y-2">
        <NavLink
          to="/"
          target="_blank"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-gold-400 hover:bg-white/5 transition-colors"
        >
          <Globe className="w-4 h-4 text-gold-400" />
          <span>View Public Site</span>
        </NavLink>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 border border-red-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};
