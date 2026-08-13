import React from 'react';
import { LucideIcon, PlusCircle, Hammer } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-10 border border-gold-500/20 bg-charcoal-800/40 rounded-2xl backdrop-blur-sm max-w-lg mx-auto shadow-gold-sm my-8"
    >
      <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-400 mb-4 shadow-gold-glow">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-serif font-bold text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-md leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gold-gradient text-charcoal-900 font-semibold text-sm rounded-xl hover:brightness-110 shadow-gold-glow transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}

      {!onAction && (
        <div className="inline-flex items-center space-x-2 text-xs text-gold-400/80 bg-gold-500/5 px-4 py-2 rounded-lg border border-gold-500/10">
          <Hammer className="w-3.5 h-3.5" />
          <span>Use Admin CMS to populate this catalog</span>
        </div>
      )}
    </motion.div>
  );
};
