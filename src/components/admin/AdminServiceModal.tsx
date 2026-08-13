import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Service } from '../../types';
import { createService, updateService } from '../../services/db';
import { uploadImage } from '../../services/storage';
import { useData } from '../../context/DataContext';
import { Upload, Save } from 'lucide-react';

interface AdminServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: Service | null;
}

export const AdminServiceModal: React.FC<AdminServiceModalProps> = ({
  isOpen,
  onClose,
  serviceToEdit,
}) => {
  const { showToast } = useData();

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('Kitchen Interiors');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [featuresStr, setFeaturesStr] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setCategory(serviceToEdit.category);
      setDescription(serviceToEdit.description);
      setImageUrl(serviceToEdit.image_url || '');
      setFeaturesStr(serviceToEdit.features ? serviceToEdit.features.join(', ') : '');
      setPriceRange(serviceToEdit.price_range || '');
      setIsPublished(serviceToEdit.is_published);
    } else {
      setName('');
      setCategory('Kitchen Interiors');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800');
      setFeaturesStr('');
      setPriceRange('');
      setIsPublished(true);
    }
  }, [serviceToEdit, isOpen]);

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
    if (!name.trim() || !description.trim()) {
      showToast('Service name and description are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const featuresArr = featuresStr.split(',').map((s) => s.trim()).filter(Boolean);
      const payload = {
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        image_url: imageUrl.trim() || undefined,
        features: featuresArr,
        price_range: priceRange.trim() || undefined,
        is_published: isPublished,
      };

      if (serviceToEdit) {
        await updateService(serviceToEdit.id, payload);
        showToast('Service updated successfully!', 'success');
      } else {
        await createService(payload);
        showToast('Service created successfully!', 'success');
      }
      onClose();
    } catch (err) {
      showToast('Failed to save service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={serviceToEdit ? 'Edit Interior Service' : 'Add New Interior Service'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Service Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Custom Modular Kitchens"
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
              placeholder="Kitchen, Bedroom, Living Room..."
              required
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Description *</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive description of the interior service offered..."
            required
            className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Price Range</label>
            <input
              type="text"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="e.g. ₹2.5L - ₹10L"
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Features (Comma Separated)</label>
            <input
              type="text"
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              placeholder="100% Termite Proof, Soft-Close Fittings..."
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Header Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
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
            id="servIsPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 text-gold-500 rounded bg-charcoal-900 border-gold-500/30"
          />
          <label htmlFor="servIsPublished" className="text-xs font-semibold text-gray-300 cursor-pointer">
            Publish on Services Page
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
            <span>{submitting ? 'Saving...' : 'Save Service'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
