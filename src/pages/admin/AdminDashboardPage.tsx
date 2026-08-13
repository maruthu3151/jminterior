import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { AdminProjectModal } from '../../components/admin/AdminProjectModal';
import { seedSampleData } from '../../services/db';
import {
  Briefcase,
  CalendarCheck,
  MessageSquare,
  Star,
  PlusCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Database,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { stats, appointments, messages, projects, showToast } = useData();
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);

  const handleSeedData = async () => {
    await seedSampleData();
    showToast('Sample Demo Data seeded successfully!', 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Admin Control Center"
        subtitle="Live metrics & instant management tools for JM INTERIOR"
      />

      <div className="px-8 space-y-8">
        {/* Zero Data / Seed Banner Notice if database is empty */}
        {stats.totalProjects === 0 && stats.pendingAppointments === 0 && stats.unreadMessages === 0 && (
          <div className="p-6 bg-charcoal-800 border border-gold-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-gold-glow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gold-500/10 border border-gold-500/30 rounded-xl text-gold-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-gray-100 text-base">Database Initialized (Empty State)</h4>
                <p className="text-xs text-gray-400">
                  Your system starts completely clean. You can add real projects manually or click below to populate sample demo data.
                </p>
              </div>
            </div>
            <button
              onClick={handleSeedData}
              className="px-5 py-2.5 bg-gold-gradient text-charcoal-900 font-bold text-xs rounded-xl shadow-gold-glow hover:brightness-110 shrink-0 flex items-center space-x-1.5"
            >
              <Database className="w-4 h-4" />
              <span>Seed Sample Data</span>
            </button>
          </div>
        )}

        {/* 1. Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-charcoal-800/80 border border-gold-500/20 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Projects</span>
              <div className="p-2 bg-gold-500/10 rounded-lg text-gold-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-serif font-bold text-gray-100">{stats.totalProjects}</span>
            <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-between border-t border-gold-500/10 pt-2">
              <span>Published Catalog</span>
              <Link to="/admin/projects" className="text-gold-400 hover:underline flex items-center">
                Manage <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
          </div>

          <div className="bg-charcoal-800/80 border border-gold-500/20 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Appointments</span>
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-serif font-bold text-amber-400">{stats.pendingAppointments}</span>
            <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-between border-t border-gold-500/10 pt-2">
              <span>Action Needed</span>
              <Link to="/admin/appointments" className="text-gold-400 hover:underline flex items-center">
                Review <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
          </div>

          <div className="bg-charcoal-800/80 border border-gold-500/20 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Unread Messages</span>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-serif font-bold text-blue-400">{stats.unreadMessages}</span>
            <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-between border-t border-gold-500/10 pt-2">
              <span>Inbox Inquiries</span>
              <Link to="/admin/messages" className="text-gold-400 hover:underline flex items-center">
                Open Inbox <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
          </div>

          <div className="bg-charcoal-800/80 border border-gold-500/20 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Approved Reviews</span>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-serif font-bold text-emerald-400">{stats.approvedReviews}</span>
            <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-between border-t border-gold-500/10 pt-2">
              <span>Public Testimonials</span>
              <Link to="/admin/reviews" className="text-gold-400 hover:underline flex items-center">
                Queue <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Quick Action Shortcuts */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-gray-100 text-lg">Quick Shortcuts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setProjectModalOpen(true)}
              className="p-5 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 rounded-2xl transition-all flex items-center space-x-3 group"
            >
              <div className="p-3 bg-gold-gradient text-charcoal-900 rounded-xl font-bold shadow-gold-glow">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-100 text-sm group-hover:text-gold-400 transition-colors">
                  Add New Project
                </h4>
                <p className="text-xs text-gray-400">Upload Before/After photo portfolio</p>
              </div>
            </button>

            <Link
              to="/admin/appointments"
              className="p-5 bg-charcoal-800 hover:bg-charcoal-700 border border-gold-500/20 rounded-2xl transition-all flex items-center space-x-3 group"
            >
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl font-bold">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-100 text-sm group-hover:text-gold-400 transition-colors">
                  Manage Appointments
                </h4>
                <p className="text-xs text-gray-400">Confirm site inspection requests</p>
              </div>
            </Link>

            <Link
              to="/admin/messages"
              className="p-5 bg-charcoal-800 hover:bg-charcoal-700 border border-gold-500/20 rounded-2xl transition-all flex items-center space-x-3 group"
            >
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-100 text-sm group-hover:text-gold-400 transition-colors">
                  Contact Messages
                </h4>
                <p className="text-xs text-gray-400">Reply to client inquiries</p>
              </div>
            </Link>
          </div>
        </div>

        {/* 3. Recent Activity Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Appointments */}
          <div className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-500/10 pb-3">
              <h3 className="font-serif font-bold text-gray-100 text-base flex items-center space-x-2">
                <CalendarCheck className="w-4 h-4 text-gold-400" />
                <span>Recent Appointment Requests</span>
              </h3>
              <Link to="/admin/appointments" className="text-xs text-gold-400 hover:underline">
                View All
              </Link>
            </div>

            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.slice(0, 4).map((appt) => (
                  <div
                    key={appt.id}
                    className="p-3 bg-charcoal-900 border border-gold-500/10 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-gray-100">{appt.client_name}</h4>
                      <span className="text-gray-400">{appt.project_type} • {appt.preferred_date}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        appt.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : appt.status === 'Pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No appointments booked yet.</p>
            )}
          </div>

          {/* Recent Messages */}
          <div className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-500/10 pb-3">
              <h3 className="font-serif font-bold text-gray-100 text-base flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-gold-400" />
                <span>Recent Inbox Messages</span>
              </h3>
              <Link to="/admin/messages" className="text-xs text-gold-400 hover:underline">
                View All
              </Link>
            </div>

            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.slice(0, 4).map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 bg-charcoal-900 border border-gold-500/10 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="truncate pr-2">
                      <h4 className="font-bold text-gray-100">{msg.name}</h4>
                      <p className="text-gray-400 truncate">{msg.message}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] shrink-0 ${
                        msg.is_read ? 'bg-gray-700 text-gray-300' : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {msg.is_read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No messages received yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Admin Project Add Modal */}
      <AdminProjectModal isOpen={projectModalOpen} onClose={() => setProjectModalOpen(false)} />
    </div>
  );
};
