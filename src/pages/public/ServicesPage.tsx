import React from 'react';
import { useData } from '../../context/DataContext';
import { ServiceCard } from '../../components/public/ServiceCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Wrench, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServicesPage: React.FC = () => {
  const { services } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
          Craftsmanship Solutions
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-100">
          Interior Design & Woodwork Services
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          From custom modular kitchens engineered with marine-ply carcasses to complete luxury home interior handovers across Chennai.
        </p>
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Wrench}
          title="No Services Published Yet"
          description="Our service catalog is currently empty. Use the Admin CMS to add custom modular kitchen, wardrobe, and woodwork services."
        />
      )}

      {/* Custom Consultation Banner */}
      <div className="p-8 sm:p-12 bg-charcoal-800 border border-gold-500/30 rounded-3xl backdrop-blur-md shadow-gold-glow flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need a Custom Architectural Woodwork Plan?</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-gray-100">Book a Free Site Inspection & Measurement</h3>
          <p className="text-gray-400 text-xs max-w-xl">
            K. Selvam will personally review your space blueprint and provide material estimates with 3D space optimization ideas.
          </p>
        </div>
        <Link
          to="/appointment"
          className="px-6 py-3 bg-gold-gradient text-charcoal-900 font-bold rounded-xl shadow-gold-glow hover:brightness-110 shrink-0 inline-flex items-center space-x-2 text-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Free Appointment</span>
        </Link>
      </div>
    </div>
  );
};
