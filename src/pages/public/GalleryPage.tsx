import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Lightbox } from '../../components/ui/Lightbox';
import { EmptyState } from '../../components/ui/EmptyState';
import { Image as ImageIcon, ZoomIn, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export const GalleryPage: React.FC = () => {
  const { gallery } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState<{
    url: string;
    title: string;
    category: string;
  } | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(gallery.map((item) => item.category));
    return ['All', ...Array.from(cats)];
  }, [gallery]);

  const filteredGallery = useMemo(() => {
    if (activeCategory === 'All') return gallery;
    return gallery.filter((item) => item.category === activeCategory);
  }, [gallery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
          Visual Catalog
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-100">
          Craftsmanship Gallery
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          High-definition photography showcasing custom teak wood finishes, marine-ply modular kitchens, walk-in wardrobes, and handcrafted furniture.
        </p>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-gold-gradient text-charcoal-900 shadow-gold-glow'
                  : 'bg-charcoal-800 text-gray-300 border border-gold-500/20 hover:border-gold-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Layout Grid */}
      {filteredGallery.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredGallery.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() =>
                setActiveLightboxImage({
                  url: item.image_url,
                  title: item.title,
                  category: item.category,
                })
              }
              className="relative group rounded-2xl overflow-hidden border border-gold-500/20 shadow-lg cursor-pointer break-inside-avoid bg-charcoal-800"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-gold-400 uppercase tracking-wider bg-gold-500/20 border border-gold-500/30 px-2.5 py-1 rounded-full w-max mb-1">
                  <Tag className="w-3 h-3" />
                  <span>{item.category}</span>
                </span>
                <h3 className="font-serif font-bold text-white text-base flex items-center justify-between">
                  <span>{item.title}</span>
                  <ZoomIn className="w-5 h-5 text-gold-400" />
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ImageIcon}
          title="Gallery is Empty"
          description="No photos have been published in the gallery yet. Use the Admin CMS to upload craftsmanship photos."
        />
      )}

      {/* Lightbox Component */}
      <Lightbox
        imageUrl={activeLightboxImage?.url || null}
        title={activeLightboxImage?.title}
        category={activeLightboxImage?.category}
        onClose={() => setActiveLightboxImage(null)}
      />
    </div>
  );
};
