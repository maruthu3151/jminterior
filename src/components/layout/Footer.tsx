import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare, Hammer, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Footer: React.FC = () => {
  const { settings } = useData();

  const primaryPhone = settings.phones[0] || '7358549554';
  const secondaryPhone = settings.phones[1] || '9342004411';

  return (
    <footer className="bg-charcoal-900 border-t border-gold-500/20 text-gray-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Vision */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient p-0.5 shadow-gold-glow">
                <div className="w-full h-full bg-charcoal-900 rounded-[10px] flex items-center justify-center">
                  <span className="font-serif font-black text-xl text-gold-400">JM</span>
                </div>
              </div>
              <span className="font-serif font-black text-2xl tracking-wider text-gray-100">
                JM INTERIOR
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Specializing in premium interior design, bespoke modular kitchens, luxury wardrobes, and custom woodworking under the master craftsmanship of <strong className="text-gold-400 font-semibold">{settings.owner_name}</strong>.
            </p>
            <div className="pt-2">
              <span className="text-xs text-gold-400/90 bg-gold-500/10 border border-gold-500/20 px-3 py-1.5 rounded-full inline-block font-semibold">
                Chennai • Nesapakkam Workshop
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-gray-100 text-lg tracking-wide border-b border-gold-500/20 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Featured Projects', path: '/projects' },
                { name: 'Photo Gallery', path: '/gallery' },
                { name: 'Interior Services', path: '/services' },
                { name: 'Materials Guide', path: '/materials' },
                { name: 'About K. Selvam', path: '/about' },
                { name: 'Book Appointment', path: '/appointment' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-gold-400 transition-colors flex items-center space-x-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gold-400/60 group-hover:translate-x-1 transition-transform" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Channels */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-gray-100 text-lg tracking-wide border-b border-gold-500/20 pb-2">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <div className="flex flex-col text-xs space-y-1">
                  <a href={`tel:${primaryPhone}`} className="hover:text-gold-400 font-semibold text-gray-200">
                    +91 {primaryPhone}
                  </a>
                  <a href={`tel:${secondaryPhone}`} className="hover:text-gold-400 text-gray-300">
                    +91 {secondaryPhone}
                  </a>
                </div>
              </li>

              <li className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 text-xs font-semibold text-gray-200"
                >
                  WhatsApp Direct Chat
                </a>
              </li>

              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-400 text-xs text-gray-300">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Workshop Location */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-gray-100 text-lg tracking-wide border-b border-gold-500/20 pb-2">
              Workshop Location
            </h4>
            <div className="flex items-start space-x-3 text-xs leading-relaxed text-gray-300">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
              <span>{settings.address}</span>
            </div>
            <a
              href={settings.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-gold-400 hover:text-white bg-gold-500/10 border border-gold-500/20 px-3.5 py-2 rounded-xl transition-all shadow-gold-sm"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-gold-500/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} JM INTERIOR. Owner: {settings.owner_name}. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="hover:text-gold-400 flex items-center space-x-1">
              <Hammer className="w-3.5 h-3.5 text-gold-400/80" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
