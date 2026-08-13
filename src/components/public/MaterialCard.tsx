import React from 'react';
import { Material } from '../../types';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Droplets, Bug, DollarSign, Wrench } from 'lucide-react';

interface MaterialCardProps {
  material: Material;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg hover:border-gold-500/60 hover:shadow-gold-glow transition-all duration-300 flex flex-col h-full"
    >
      {/* Header Image */}
      {material.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={material.image_url}
            alt={material.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent" />
          <span className="absolute top-3 right-3 bg-gold-500/90 text-charcoal-900 font-bold text-xs px-3 py-1 rounded-full uppercase shadow-md">
            {material.cost_level}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-bold text-gray-100 mb-2">{material.name}</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">{material.description}</p>

        {/* Rating & Property Matrix */}
        <div className="space-y-3 pt-4 border-t border-gold-500/10 text-xs">
          {/* Durability Rating */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Durability</span>
            </span>
            <div className="flex items-center space-x-1 text-gold-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < material.durability ? 'fill-gold-400 text-gold-400' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Water Resistance */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center space-x-1">
              <Droplets className="w-3.5 h-3.5 text-gold-400" />
              <span>Water Resistance</span>
            </span>
            <span className="font-semibold text-gray-200">{material.water_resistance}</span>
          </div>

          {/* Termite Resistance */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center space-x-1">
              <Bug className="w-3.5 h-3.5 text-gold-400" />
              <span>Termite Proofing</span>
            </span>
            <span className="font-semibold text-gray-200">{material.termite_resistance}</span>
          </div>

          {/* Maintenance & Finish */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center space-x-1">
              <Wrench className="w-3.5 h-3.5 text-gold-400" />
              <span>Maintenance Level</span>
            </span>
            <span className="font-semibold text-gray-200">{material.maintenance}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
