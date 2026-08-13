import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { AdminGalleryModal } from '../../components/admin/AdminGalleryModal';
import { deleteGalleryItem, updateGalleryItem } from '../../services/db';
import { GalleryItem } from '../../types';
import { PlusCircle, Edit3, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const AdminGalleryPage: React.FC = () => {
  const { allGallery, showToast } = useData();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<GalleryItem | null>(null);

  const handleTogglePublish = async (item: GalleryItem) => {
    try {
      await updateGalleryItem(item.id, { is_published: !item.is_published });
      showToast(`Gallery item ${!item.is_published ? 'Published' : 'Hidden'}`, 'success');
    } catch (e) {
      showToast('Error updating publish status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGalleryItem(id);
      showToast('Photo deleted from gallery', 'success');
    } catch (e) {
      showToast('Error deleting gallery item', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Gallery Management"
        subtitle="Upload craftsmanship photography for public gallery grid"
      />

      <div className="px-8 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setItemToEdit(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs shadow-gold-glow hover:brightness-110 flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload New Photo</span>
          </button>
        </div>

        {allGallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allGallery.map((item) => (
              <div
                key={item.id}
                className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl overflow-hidden shadow-lg flex flex-col"
              >
                <div className="relative h-48">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-charcoal-900/90 text-gold-400 text-xs px-2.5 py-1 rounded-full font-bold border border-gold-500/20">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                  <h4 className="font-serif font-bold text-gray-100 text-sm">{item.title}</h4>

                  <div className="flex items-center justify-between pt-2 border-t border-gold-500/10">
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={`text-xs font-semibold flex items-center space-x-1 ${
                        item.is_published ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {item.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{item.is_published ? 'Visible' : 'Hidden'}</span>
                    </button>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setItemToEdit(item);
                          setModalOpen(true);
                        }}
                        className="p-1.5 text-gold-400 hover:bg-gold-500/10 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg"
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
            icon={ImageIcon}
            title="Gallery is Empty"
            description="Add high-res photos of completed teak woodwork and modular kitchen assemblies."
            actionLabel="Upload Photo"
            onAction={() => {
              setItemToEdit(null);
              setModalOpen(true);
            }}
          />
        )}
      </div>

      <AdminGalleryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} itemToEdit={itemToEdit} />
    </div>
  );
};
