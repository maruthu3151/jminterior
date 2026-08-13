import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag } from 'lucide-react';

interface LightboxProps {
  imageUrl: string | null;
  title?: string;
  category?: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ imageUrl, title, category, onClose }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (imageUrl) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [imageUrl, onClose]);

  return (
    <AnimatePresence>
      {imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-3 bg-charcoal-800/80 hover:bg-gold-500 hover:text-charcoal-900 text-gray-200 rounded-full border border-gold-500/30 transition-all shadow-gold-glow"
          >
            <X className="w-6 h-6" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
          >
            <img
              src={imageUrl}
              alt={title || 'Gallery Preview'}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-gold-500/30 shadow-2xl"
            />

            {(title || category) && (
              <div className="mt-4 text-center">
                {category && (
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20 mb-2">
                    <Tag className="w-3 h-3" />
                    <span>{category}</span>
                  </span>
                )}
                {title && <h4 className="text-lg font-serif font-bold text-gray-100">{title}</h4>}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
