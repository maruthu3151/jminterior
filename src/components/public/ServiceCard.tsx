import React from 'react';
import { Service } from '../../types';
import { motion } from 'framer-motion';
import { CheckCircle, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group bg-charcoal-800/80 border border-gold-500/20 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg hover:border-gold-500/60 hover:shadow-gold-glow transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Header */}
      {service.image_url && (
        <div className="relative h-56 overflow-hidden">
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/30 to-transparent" />
          <span className="absolute top-4 left-4 bg-charcoal-900/90 text-gold-400 border border-gold-500/30 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md flex items-center space-x-1">
            <Tag className="w-3 h-3" />
            <span>{service.category}</span>
          </span>
        </div>
      )}

      {/* Body Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-bold text-gray-100 group-hover:text-gold-400 transition-colors mb-2">
          {service.name}
        </h3>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">
          {service.description}
        </p>

        {/* Feature Badges */}
        {service.features && service.features.length > 0 && (
          <div className="mb-6 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-400/80">Key Deliverables</span>
            <ul className="space-y-1.5 text-xs text-gray-300">
              {service.features.map((feat, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer with Price Range & Book CTA */}
        <div className="pt-4 border-t border-gold-500/10 flex items-center justify-between mt-auto">
          {service.price_range && (
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Estimated Price</span>
              <span className="text-sm font-bold text-gold-400">{service.price_range}</span>
            </div>
          )}
          <Link
            to="/appointment"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-gold-400 hover:text-white transition-colors ml-auto"
          >
            <span>Consult Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
