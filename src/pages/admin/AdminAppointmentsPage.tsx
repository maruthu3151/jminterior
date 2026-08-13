import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { AdminAppointmentModal } from '../../components/admin/AdminAppointmentModal';
import { deleteAppointment } from '../../services/db';
import { Appointment, AppointmentStatus } from '../../types';
import { CalendarCheck, Phone, Mail, MapPin, Trash2, Edit3, MessageSquare } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const AdminAppointmentsPage: React.FC = () => {
  const { appointments, showToast } = useData();

  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const filtered = appointments.filter(
    (a) => activeStatus === 'All' || a.status === activeStatus
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);
      showToast('Appointment deleted', 'success');
    } catch (e) {
      showToast('Error deleting appointment', 'error');
    }
  };

  const statusFilters = ['All', 'Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Appointments Management"
        subtitle="Review client consultation bookings, update status, and add internal notes"
      />

      <div className="px-8 space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeStatus === st
                  ? 'bg-gold-gradient text-charcoal-900 shadow-gold-glow'
                  : 'bg-charcoal-800 text-gray-300 border border-gold-500/20 hover:border-gold-500/40'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {filtered.length > 0 ? (
          <div className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-charcoal-900 text-gold-400 font-serif border-b border-gold-500/20 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Client</th>
                    <th className="p-4">Project & Budget</th>
                    <th className="p-4">Requested Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Admin Notes</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/10">
                  {filtered.map((appt) => (
                    <tr key={appt.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-100 text-sm">{appt.client_name}</span>
                          <span className="text-gray-400 text-[11px] flex items-center space-x-1 mt-0.5">
                            <Phone className="w-3 h-3 text-gold-400" />
                            <a href={`tel:${appt.phone}`} className="hover:text-gold-400">
                              {appt.phone}
                            </a>
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-200">{appt.project_type}</span>
                          <span className="text-gold-400">{appt.budget || 'N/A'}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-gray-100">{appt.preferred_date}</span>
                        {appt.preferred_time && (
                          <span className="block text-[11px] text-gray-400">{appt.preferred_time}</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                            appt.status === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : appt.status === 'Pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs truncate text-gray-400 italic">
                        {appt.admin_notes || 'No internal notes'}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedAppt(appt);
                            setModalOpen(true);
                          }}
                          className="p-1.5 bg-charcoal-700 hover:bg-gold-500/20 text-gold-400 rounded-lg border border-gold-500/20"
                          title="Manage Appointment"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(appt.id)}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 rounded-lg border border-red-500/20"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={CalendarCheck}
            title="No Appointments Found"
            description="Client appointment requests submitted from the public site will appear here instantly."
          />
        )}
      </div>

      <AdminAppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appointment={selectedAppt}
      />
    </div>
  );
};
