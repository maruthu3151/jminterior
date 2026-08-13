import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { AdminMaterialModal } from '../../components/admin/AdminMaterialModal';
import { deleteMaterial, updateMaterial } from '../../services/db';
import { Material } from '../../types';
import { PlusCircle, Edit3, Trash2, Eye, EyeOff, Layers, Star } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const AdminMaterialsPage: React.FC = () => {
  const { allMaterials, showToast } = useData();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [materialToEdit, setMaterialToEdit] = useState<Material | null>(null);

  const handleTogglePublish = async (material: Material) => {
    try {
      await updateMaterial(material.id, { is_published: !material.is_published });
      showToast(`Material ${!material.is_published ? 'Published' : 'Hidden'}`, 'success');
    } catch (e) {
      showToast('Error updating material', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMaterial(id);
      showToast('Material removed from guide', 'success');
    } catch (e) {
      showToast('Error deleting material', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Materials & Wood Guide Management"
        subtitle="Configure material ratings, durability specs, and cost tiers"
      />

      <div className="px-8 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setMaterialToEdit(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs shadow-gold-glow hover:brightness-110 flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Wood/Material Spec</span>
          </button>
        </div>

        {allMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl p-6 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-gold-400 bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/20">
                      {mat.cost_level}
                    </span>
                    <button
                      onClick={() => handleTogglePublish(mat)}
                      className={`text-xs font-semibold flex items-center space-x-1 ${
                        mat.is_published ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {mat.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h3 className="font-serif font-bold text-gray-100 text-lg mb-1">{mat.name}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4">{mat.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-gold-500/10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Durability</span>
                    <div className="flex text-gold-400">
                      {Array.from({ length: mat.durability }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold-400" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                    <span className="text-gray-400">{mat.termite_resistance}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setMaterialToEdit(mat);
                          setModalOpen(true);
                        }}
                        className="p-1 text-gold-400 hover:bg-gold-500/10 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(mat.id)}
                        className="p-1 text-red-400 hover:bg-red-950/40 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title="No Materials Configured"
            description="Add raw material specs like Burma Teak wood, BWP Marine Ply, and Acrylic finishes."
            actionLabel="Add Material"
            onAction={() => {
              setMaterialToEdit(null);
              setModalOpen(true);
            }}
          />
        )}
      </div>

      <AdminMaterialModal isOpen={modalOpen} onClose={() => setModalOpen(false)} materialToEdit={materialToEdit} />
    </div>
  );
};
