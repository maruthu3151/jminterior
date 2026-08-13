import React from 'react';
import { useData } from '../../context/DataContext';
import { Award, ShieldCheck, MapPin, Phone, Mail, Clock, Hammer, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const { settings } = useData();
  const primaryPhone = settings.phones[0] || '7358549554';
  const secondaryPhone = settings.phones[1] || '9342004411';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3.5 py-1.5 rounded-full inline-block">
            Master Craftsmanship Since 2010
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-100 leading-tight">
            Building Luxury Interiors With Honesty & Precision
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-gold-400">{settings.company_name}</strong> was founded by master craftsman <strong className="text-gold-400">{settings.owner_name}</strong> with a singular mission: to deliver world-class modular kitchens, custom wardrobes, and architectural woodwork with zero compromise on material honesty.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Operating from our dedicated workshop in Nesapakkam, Chennai, we eliminate middlemen and third-party contractors. Every cabinet joint, teak veneer polish, and hardware alignment is inspected personally by K. Selvam before installation at your home.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/appointment"
              className="px-6 py-3 bg-gold-gradient text-charcoal-900 font-bold text-sm rounded-xl shadow-gold-glow hover:brightness-110"
            >
              Book Site Meeting
            </Link>
            <a
              href={`tel:${primaryPhone}`}
              className="px-6 py-3 border border-gold-500/40 text-gold-400 font-bold text-sm rounded-xl hover:bg-gold-500/10"
            >
              Call K. Selvam Direct
            </a>
          </div>
        </div>

        {/* Workshop Image */}
        <div className="relative rounded-3xl overflow-hidden border border-gold-500/30 shadow-gold-glow">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200"
            alt="Woodwork Workshop Craftsman"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-charcoal-900/90 border border-gold-500/30 rounded-2xl backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <Hammer className="w-6 h-6 text-gold-400 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-100 text-sm">{settings.owner_name}</h4>
                <p className="text-xs text-gray-400">Founder & Chief Craftsman, JM Interior</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-serif font-bold text-gray-100">Our Woodwork Philosophy</h2>
          <p className="text-gray-400 text-xs">Four pillars that define every project executed by JM Interior</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Direct Workshop Pricing',
              desc: 'No expensive showrooms or agent commissions. You pay strictly for premium wood & hardware.',
            },
            {
              title: '100% Genuine Marine Ply',
              desc: 'We never mix low-grade particle boards in kitchen carcasses. Only IS 710 certified BWP ply.',
            },
            {
              title: 'Custom 3D Planning',
              desc: 'Every inch of your modular kitchen and walk-in closet is planned in 3D before cutting wood.',
            },
            {
              title: 'Lifetime Support',
              desc: 'Post-installation service for hardware adjustments, drawer alignment, and polish touchups.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-charcoal-800/80 border border-gold-500/20 rounded-2xl space-y-2">
              <CheckCircle2 className="w-6 h-6 text-gold-400" />
              <h3 className="font-serif font-bold text-gray-100 text-base">{item.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workshop Location & Map */}
      <div className="p-8 bg-charcoal-800 border border-gold-500/30 rounded-3xl backdrop-blur-md shadow-gold-glow grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-serif font-bold text-gray-100">Visit Our Workshop</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            We welcome client site visits! Drop by our workshop in Nesapakkam to inspect raw wood samples, Blum hardware mechanisms, and active kitchen assemblies.
          </p>

          <div className="space-y-3 text-xs text-gray-300 pt-2">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <span>+91 {primaryPhone} / +91 {secondaryPhone}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{settings.email}</span>
            </div>
          </div>
        </div>

        {/* Embedded Map / Map Button */}
        <div className="lg:col-span-2 relative min-h-[250px] bg-charcoal-900 border border-gold-500/20 rounded-2xl overflow-hidden flex items-center justify-center p-6 text-center">
          <div className="space-y-3">
            <MapPin className="w-12 h-12 text-gold-400 mx-auto animate-bounce" />
            <h4 className="font-serif font-bold text-lg text-gray-100">JM Interior Workshop • Nesapakkam</h4>
            <p className="text-xs text-gray-400">4/29 Kamarajar Street, Nesapakkam, Chennai, Tamil Nadu - 600078</p>
            <a
              href={settings.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs shadow-gold-glow"
            >
              <span>Get Directions in Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
