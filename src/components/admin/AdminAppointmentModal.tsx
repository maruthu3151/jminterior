import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Appointment, AppointmentStatus } from '../../types';
import { updateAppointmentStatus } from '../../services/db';
import { useData } from '../../context/DataContext';
import { Calendar, Phone, Mail, MapPin, MessageSquare, Save } from 'lucide-react';

interface AdminAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export const AdminAppointmentModal: React.FC<AdminAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const { showToast } = useData();

  const [status, setStatus] = useState<AppointmentStatus>('Pending');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (appointment) {
      setStatus(appointment.status);
      setAdminNotes(appointment.admin_notes || '');
      setPreferredDate(appointment.preferred_date);
    }
  }, [appointment, isOpen]);

  if (!appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateAppointmentStatus(appointment.id, status, adminNotes.trim(), preferredDate);
      showToast(`Appointment status updated to ${status}`, 'success');
      onClose();
    } catch (err) {
      showToast('Failed to update appointment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Client Appointment" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Briefing Box */}
        <div className="p-4 bg-charcoal-900 border border-gold-500/20 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-gold-500/10 pb-2">
            <span className="font-serif font-bold text-base text-gray-100">{appointment.client_name}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                appointment.status === 'Confirmed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : appointment.status === 'Pending'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {appointment.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-gray-300 pt-1">
            <div className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <a href={`tel:${appointment.phone}`} className="hover:text-gold-400 font-semibold">
                {appointment.phone}
              </a>
            </div>

            {appointment.email && (
              <div className="flex items-center space-x-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <a href={`mailto:${appointment.email}`} className="hover:text-gold-400 truncate">
                  {appointment.email}
                </a>
              </div>
            )}

            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              <span>
                {appointment.preferred_date} {appointment.preferred_time ? `(${appointment.preferred_time})` : ''}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-gold-400">Type:</span>
              <span className="truncate">{appointment.project_type}</span>
            </div>
          </div>

          {appointment.address && (
            <div className="flex items-start space-x-1.5 text-gray-400 pt-1 border-t border-gold-500/10">
              <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
              <span>{appointment.address}</span>
            </div>
          )}

          {appointment.message && (
            <div className="p-2.5 bg-charcoal-800 rounded-lg text-gray-300 italic border border-gold-500/10 mt-2">
              "{appointment.message}"
            </div>
          )}
        </div>

        {/* Status Transition Control */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Appointment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3 py-2 text-sm text-gray-100"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Scheduled Date</label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3 py-2 text-sm text-gray-100"
            />
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Admin Internal Notes</label>
          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal notes, site visit observations, quoted estimates..."
            className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
          />
        </div>

        {/* Quick Launchers: WhatsApp / Call */}
        <div className="flex gap-2 pt-1">
          <a
            href={`https://wa.me/91${appointment.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(appointment.client_name)},%20this%20is%20K.%20Selvam%20from%20JM%20INTERIOR%20regarding%20your%20appointment.`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Client</span>
          </a>
          <a
            href={`tel:${appointment.phone}`}
            className="flex-1 text-center py-2 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Direct Call</span>
          </a>
        </div>

        <div className="pt-4 border-t border-gold-500/20 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-700 text-gray-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs shadow-gold-glow flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Update Appointment'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
