import React from 'react';
import { Review } from '../../types';
import { motion } from 'framer-motion';
import { Star, Quote, MapPin, CheckCircle2 } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative bg-charcoal-800/70 border border-gold-500/20 p-6 rounded-2xl backdrop-blur-md shadow-lg flex flex-col justify-between"
    >
      <Quote className="absolute top-4 right-4 w-10 h-10 text-gold-500/10 pointer-events-none" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center space-x-1 text-gold-400 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-600'}`}
            />
          ))}
        </div>

        {/* Testimonial Text */}
        <p className="text-gray-300 text-sm leading-relaxed italic mb-6">"{review.comment}"</p>
      </div>

      {/* Author & Project Details */}
      <div className="pt-4 border-t border-gold-500/10 flex items-center justify-between text-xs">
        <div>
          <div className="flex items-center space-x-1 font-bold text-gray-100">
            <span>{review.client_name}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
          </div>
          {review.location && (
            <span className="text-gray-400 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3 h-3 text-gold-400/80" />
              <span>{review.location}</span>
            </span>
          )}
        </div>

        {review.project_title && (
          <span className="bg-gold-500/10 text-gold-400 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-gold-500/20">
            {review.project_title}
          </span>
        )}
      </div>
    </motion.div>
  );
};
