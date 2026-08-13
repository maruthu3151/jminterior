import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { createMessage } from '../../services/db';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useData();

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const primaryPhone = settings.phones[0] || '7358549554';
  const secondaryPhone = settings.phones[1] || '9342004411';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('Name, phone number, and message are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await createMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        subject: subject.trim() || undefined,
        message: message.trim(),
      });
      showToast('Message sent to JM Interior Admin!', 'success');
      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      showToast('Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-100">
          Contact JM INTERIOR
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Have questions about modular kitchens, custom wardrobes, or woodwork pricing? Reach out to <strong className="text-gold-400">{settings.owner_name}</strong> directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-charcoal-800/80 border border-gold-500/20 p-6 rounded-2xl space-y-4">
            <h3 className="font-serif font-bold text-gray-100 text-lg border-b border-gold-500/20 pb-2">
              Direct Phone Channels
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${primaryPhone}`}
                className="flex items-center space-x-3 text-gold-400 hover:text-white font-bold p-2.5 bg-charcoal-900 rounded-xl border border-gold-500/20"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>+91 {primaryPhone} (Primary)</span>
              </a>

              <a
                href={`tel:${secondaryPhone}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-gold-400 font-semibold p-2.5 bg-charcoal-900 rounded-xl border border-gold-500/10"
              >
                <Phone className="w-4 h-4 shrink-0 text-gold-400" />
                <span>+91 {secondaryPhone} (Secondary)</span>
              </a>
            </div>
          </div>

          <div className="bg-charcoal-800/80 border border-gold-500/20 p-6 rounded-2xl space-y-4">
            <h3 className="font-serif font-bold text-gray-100 text-lg border-b border-gold-500/20 pb-2">
              Instant Messaging & Email
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 text-emerald-400 hover:text-white font-bold p-2.5 bg-charcoal-900 rounded-xl border border-emerald-500/30"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>WhatsApp Direct Chat</span>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-gold-400 text-xs p-2.5 bg-charcoal-900 rounded-xl border border-gold-500/10"
              >
                <Mail className="w-4 h-4 shrink-0 text-gold-400" />
                <span>{settings.email}</span>
              </a>
            </div>
          </div>

          <div className="bg-charcoal-800/80 border border-gold-500/20 p-6 rounded-2xl space-y-3">
            <h3 className="font-serif font-bold text-gray-100 text-lg border-b border-gold-500/20 pb-2">
              Workshop Address
            </h3>
            <div className="flex items-start space-x-2 text-xs text-gray-300">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            <a
              href={settings.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-400 hover:text-white pt-2"
            >
              <span>View Map Location</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-charcoal-800/80 border border-gold-500/30 p-8 rounded-3xl backdrop-blur-md shadow-gold-glow">
          <h3 className="text-2xl font-serif font-bold text-gray-100 mb-6">Send Us a Direct Message</h3>

          {submitted ? (
            <div className="p-8 text-center space-y-4 bg-gold-500/10 border border-gold-500/30 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-gold-400 mx-auto" />
              <h4 className="text-xl font-serif font-bold text-gray-100">Thank You!</h4>
              <p className="text-sm text-gray-300 max-w-md mx-auto">
                Your message has been saved to our system. K. Selvam or our team will contact you shortly on your phone number.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    required
                    className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Modular Kitchen Inquiry"
                    className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Your Message *</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project requirements, space measurements, or preferred timeline..."
                  required
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl shadow-gold-glow hover:brightness-110 flex items-center justify-center space-x-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : 'Send Message to Admin'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
