import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage: string;
  title?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  title,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  if (!beforeImage) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-lg group">
        <img
          src={afterImage}
          alt={title || 'Interior Project'}
          className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-charcoal-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-500/30 text-xs font-semibold text-gold-400 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Completed Interior</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-gold-500/30 shadow-gold-glow select-none cursor-ew-resize group"
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="After Transformation"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <span className="absolute top-4 right-4 z-10 bg-gold-500/90 text-charcoal-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
        After Finish
      </span>

      {/* Before Image (Clipped Overlay) */}
      <div
        className="absolute top-0 bottom-0 left-0 overflow-hidden pointer-events-none border-r-2 border-gold-400"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeImage}
          alt="Before Transformation"
          className="absolute top-0 left-0 max-w-none h-full object-cover"
          style={{ width: containerRef.current ? containerRef.current.clientWidth : '100%' }}
        />
        <span className="absolute top-4 left-4 z-10 bg-charcoal-900/90 text-gray-300 border border-gray-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
          Before
        </span>
      </div>

      {/* Slider Control Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-gold-400 shadow-gold-glow pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gold-500 text-charcoal-900 flex items-center justify-center shadow-gold-glow border-2 border-white/80">
          <MoveHorizontal className="w-5 h-5 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
