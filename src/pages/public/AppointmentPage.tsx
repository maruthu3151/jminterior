import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { createAppointment } from '../../services/db';
import { Calendar, Clock, User, Phone, Mail, MapPin, IndianRupee, Layers, CheckCircle2, Send } from 'lucide-react';

export const AppointmentPage: React.FC = () => {
  const { showToast } = useData();

  const [clientName, setClientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [projectType, setProjectType] = useState<string>('Modular Kitchen');
  const [budget, setBudget] = useState<string>('₹3L - ₹6L');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('10:00 AM - 01:00 PM');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [booked, setBooked] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim() || !preferredDate) {
      showToast('Name, phone number, and preferred date are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await createAppointment({
        client_name: clientName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        project_type: projectType,
        budget: budget || undefined,
        preferred_date: preferredDate,
        preferred_time: preferredTime || undefined,
        message: message.trim() || undefined,
      });

      showToast('Appointment requested successfully!', 'success');
      setBooked(true);
      setClientName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setMessage('');
    } catch (err) {
      showToast('Failed to schedule appointment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const projectTypes = [
    'Modular Kitchen',
    'Walk-in Wardrobe',
    'Living Room Paneling',
    'Bedroom Interior',
    'Villa Full Residence',
    'Commercial Office Woodwork',
    'Custom Furniture',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3.5 py-1.5 rounded-full inline-block">
          Direct Consultation Booking
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-100">
          Book Free Site Inspection
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
          Schedule a personalized site visit or workshop discussion with master craftsman K. Selvam to discuss material choices and budget estimates.
        </p>
      </div>

      {booked ? (
        <div className="p-10 bg-charcoal-800 border border-gold-500/30 rounded-3xl backdrop-blur-md shadow-gold-glow text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-gold-400 mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-gray-100">Appointment Request Received!</h2>
          <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            Your appointment entry has been registered with status <strong className="text-gold-400">Pending</strong>. Our team will review your requested date and confirm via phone call.
          </p>
          <button
            onClick={() => setBooked(false)}
            className="px-6 py-2.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs"
          >
            Book Another Consultation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-charcoal-800/80 border border-gold-500/30 p-8 rounded-3xl backdrop-blur-md shadow-gold-glow space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Your Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Vigneshwar K"
                  required
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 7358549554"
                  required
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. client@example.com"
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Project Type *</label>
              <div className="relative">
                <Layers className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                >
                  {projectTypes.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Estimated Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
              >
                <option value="₹1.5L - ₹3L">₹1.5L - ₹3L</option>
                <option value="₹3L - ₹6L">₹3L - ₹6L</option>
                <option value="₹6L - ₹12L">₹6L - ₹12L</option>
                <option value="Above ₹12L">Above ₹12L</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Preferred Date *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Preferred Time Slot</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                >
                  <option value="10:00 AM - 01:00 PM">Morning (10 AM - 1 PM)</option>
                  <option value="02:00 PM - 05:00 PM">Afternoon (2 PM - 5 PM)</option>
                  <option value="05:00 PM - 08:00 PM">Evening (5 PM - 8 PM)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Site Address (Chennai)</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Door 12, 2nd Main Road, Velachery, Chennai"
                className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Additional Project Details</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide room dimensions, wood finish preferences (e.g., Burma teak veneer), or specific hardware requirements..."
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gold-gradient text-charcoal-900 font-bold rounded-xl shadow-gold-glow hover:brightness-110 flex items-center justify-center space-x-2 text-base"
          >
            <Send className="w-5 h-5" />
            <span>{submitting ? 'Registering Appointment...' : 'Submit Appointment Request'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
