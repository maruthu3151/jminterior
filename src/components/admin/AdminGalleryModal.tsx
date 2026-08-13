import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { GalleryItem } from '../../types';
import { createGalleryItem, updateGalleryItem } from '../../services/db';
import { uploadImage } from '../../services/storage';
import { useData } from '../../context/DataContext';
import { Upload, Save } from 'lucide-react';

interface AdminGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: GalleryItem | null;
}

export const AdminGalleryModal: React.FC<AdminGalleryModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
}) => {
  const { showToast } = useData();

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Modular Kitchen');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (itemToEdit) {
      setTitle(itemToEdit.title);
      setCategory(itemToEdit.category);
      setImageUrl(itemToEdit.image_url);
      setIsPublished(itemToEdit.is_published);
    } else {
      setTitle('');
      setCategory('Modular Kitchen');
      setImageUrl('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800');
      setIsPublished(true);
    }
  }, [itemToEdit, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await uploadImage(file);
        setImageUrl(base64);
        showToast('Image uploaded successfully', 'success');
      } catch (err) {
        showToast('Failed to process image file', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      showToast('Title and image are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (itemToEdit) {
        await updateGalleryItem(itemToEdit.id, {
          title: title.trim(),
          category: category.trim(),
          image_url: imageUrl.trim(),
          is_published: isPublished,
        });
        showToast('Gallery item updated!', 'success');
      } else {
        await createGalleryItem({
          title: title.trim(),
          category: category.trim(),
          image_url: imageUrl.trim(),
          is_published: isPublished,
        });
        showToast('Gallery item added!', 'success');
      }
      onClose();
    } catch (err) {
      showToast('Error saving gallery item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Photo Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Burma Teak Island Cabinet"
            required
            className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Category *</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Modular Kitchen, Wardrobe, Living Room..."
            required
            className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Image URL or File *</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              required
              className="flex-grow bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
            <label className="cursor-pointer px-4 py-2 bg-charcoal-700 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1 shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <input
            type="checkbox"
            id="galIsPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 text-gold-500 rounded bg-charcoal-900 border-gold-500/30"
          />
          <label htmlFor="galIsPublished" className="text-xs font-semibold text-gray-300 cursor-pointer">
            Publish in Public Gallery Grid
          </label>
        </div>

        <div className="pt-4 border-t border-gold-500/20 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-700 text-gray-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs shadow-gold-glow flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Save Gallery Photo'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
