import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hammer, Menu, X, Phone, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AdminLoginModal } from '../admin/AdminLoginModal';

export const Navbar: React.FC = () => {
  const { settings } = useData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Services', path: '/services' },
    { name: 'Materials', path: '/materials' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const primaryPhone = settings.phones[0] || '7358549554';

  return (
    <>
      <header className="sticky top-0 z-40 bg-charcoal-900/90 backdrop-blur-xl border-b border-gold-500/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gold-gradient p-0.5 shadow-gold-glow group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-charcoal-900 rounded-[10px] flex items-center justify-center">
                  <span className="font-serif font-black text-xl text-gold-400">JM</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-xl tracking-wider text-gray-100 group-hover:text-gold-400 transition-colors">
                  JM INTERIOR
                </span>
                <span className="text-[10px] tracking-widest text-gold-400/80 uppercase font-semibold">
                  Luxury Woodwork & Design
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-gold-400 bg-gold-500/10 font-semibold shadow-gold-sm border border-gold-500/20'
                        : 'text-gray-300 hover:text-gold-400 hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Direct Call, Hammer Icon (Admin trigger), Book CTA */}
            <div className="hidden sm:flex items-center space-x-3">
              <a
                href={`tel:${primaryPhone}`}
                className="p-2.5 rounded-xl border border-gold-500/20 bg-charcoal-800 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/40 transition-colors"
                title="Direct Call"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* Subtle Hammer Icon Trigger for Admin CMS Login Modal */}
              <button
                onClick={() => setAdminModalOpen(true)}
                className="p-2.5 rounded-xl border border-gold-500/20 bg-charcoal-800 text-gray-400 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
                title="Admin Management Login"
              >
                <Hammer className="w-4 h-4" />
              </button>

              <Link
                to="/appointment"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gold-gradient text-charcoal-900 font-bold text-sm rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center space-x-2">
              <button
                onClick={() => setAdminModalOpen(true)}
                className="p-2 text-gray-400 hover:text-gold-400"
              >
                <Hammer className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-300 hover:text-gold-400"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-gold-500/20 bg-charcoal-900 px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-gold-400 bg-gold-500/10 font-bold border border-gold-500/20'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gold-500/10 flex flex-col gap-2">
              <Link
                to="/appointment"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-gold-gradient text-charcoal-900 font-bold rounded-xl"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Admin Login Modal Triggered via Hammer Icon */}
      <AdminLoginModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </>
  );
};
