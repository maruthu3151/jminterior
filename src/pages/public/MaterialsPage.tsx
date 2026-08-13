import React from 'react';
import { useData } from '../../context/DataContext';
import { MaterialCard } from '../../components/public/MaterialCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Layers, ShieldCheck, Droplets, Bug, Sparkles } from 'lucide-react';

export const MaterialsPage: React.FC = () => {
  const { materials } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
          Raw Material Quality Standards
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-100">
          Materials & Wood Guide
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          We use only 100% genuine BWP grade marine plywood, seasoned Burma teak, and high-density engineered boards to guarantee lifetime durability and zero termite damage.
        </p>
      </div>

      {/* Material Property Guarantee Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-5 bg-charcoal-800/60 border border-gold-500/20 rounded-2xl">
          <ShieldCheck className="w-8 h-8 text-gold-400 mx-auto mb-2" />
          <h4 className="font-bold text-gray-100 text-sm">IS 710 BWP Certified</h4>
          <p className="text-xs text-gray-400 mt-1">72-hour boiling waterproof test standard</p>
        </div>

        <div className="p-5 bg-charcoal-800/60 border border-gold-500/20 rounded-2xl">
          <Bug className="w-8 h-8 text-gold-400 mx-auto mb-2" />
          <h4 className="font-bold text-gray-100 text-sm">Termite-Proof Chemistry</h4>
          <p className="text-xs text-gray-400 mt-1">Chemically treated core veneers with 10-year warranty</p>
        </div>

        <div className="p-5 bg-charcoal-800/60 border border-gold-500/20 rounded-2xl">
          <Sparkles className="w-8 h-8 text-gold-400 mx-auto mb-2" />
          <h4 className="font-bold text-gray-100 text-sm">Premium Polish & Veneers</h4>
          <p className="text-xs text-gray-400 mt-1">PU lacquer, acrylic, and natural Burma teak grains</p>
        </div>
      </div>

      {/* Materials Grid */}
      {materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {materials.map((mat) => (
            <MaterialCard key={mat.id} material={mat} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No Materials Published Yet"
          description="The materials specification guide is currently empty. Add raw materials, teak wood grades, and marine ply details via the Admin CMS."
        />
      )}
    </div>
  );
};
