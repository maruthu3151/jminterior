import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Material } from '../../types';
import { createMaterial, updateMaterial } from '../../services/db';
import { uploadImage } from '../../services/storage';
import { useData } from '../../context/DataContext';
import { Upload, Save } from 'lucide-react';

interface AdminMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialToEdit?: Material | null;
}

export const AdminMaterialModal: React.FC<AdminMaterialModalProps> = ({
  isOpen,
  onClose,
  materialToEdit,
}) => {
  const { showToast } = useData();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [durability, setDurability] = useState<number>(5);
  const [finish, setFinish] = useState<string>('Natural Polish');
  const [maintenance, setMaintenance] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [waterResistance, setWaterResistance] = useState<string>('High');
  const [termiteResistance, setTermiteResistance] = useState<string>('100% Termite Proof');
  const [costLevel, setCostLevel] = useState<'Standard' | 'Premium' | 'Ultra Luxury'>('Premium');
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (materialToEdit) {
      setName(materialToEdit.name);
      setDescription(materialToEdit.description);
      setImageUrl(materialToEdit.image_url || '');
      setDurability(materialToEdit.durability);
      setFinish(materialToEdit.finish);
      setMaintenance(materialToEdit.maintenance);
      setWaterResistance(materialToEdit.water_resistance);
      setTermiteResistance(materialToEdit.termite_resistance);
      setCostLevel(materialToEdit.cost_level);
      setIsPublished(materialToEdit.is_published);
    } else {
      setName('');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&q=80&w=800');
      setDurability(5);
      setFinish('Natural Polish');
      setMaintenance('Low');
      setWaterResistance('High');
      setTermiteResistance('100% Termite Proof');
      setCostLevel('Premium');
      setIsPublished(true);
    }
  }, [materialToEdit, isOpen]);

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
      showToast('Material name and description are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        image_url: imageUrl.trim() || undefined,
        durability,
        finish: finish.trim(),
        maintenance,
        water_resistance: waterResistance.trim(),
        termite_resistance: termiteResistance.trim(),
        cost_level: costLevel,
        is_published: isPublished,
      };

      if (materialToEdit) {
        await updateMaterial(materialToEdit.id, payload);
        showToast('Material specification updated!', 'success');
      } else {
        await createMaterial(payload);
        showToast('Material added to guide!', 'success');
      }
      onClose();
    } catch (err) {
      showToast('Failed to save material', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={materialToEdit ? 'Edit Wood/Material Spec' : 'Add Wood/Material Spec'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Material / Wood Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Burma Teak Wood, BWP Marine Ply..."
            required
            className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Description *</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Wood characteristics, grain, density, and application..."
            required
            className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Durability (1-5 Star)</label>
            <select
              value={durability}
              onChange={(e) => setDurability(Number(e.target.value))}
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3 py-2 text-sm text-gray-100"
            >
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>
                  {val} Star
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Maintenance</label>
            <select
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value as 'Low' | 'Medium' | 'High')}
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3 py-2 text-sm text-gray-100"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Cost Tier</label>
            <select
              value={costLevel}
              onChange={(e) => setCostLevel(e.target.value as 'Standard' | 'Premium' | 'Ultra Luxury')}
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3 py-2 text-sm text-gray-100"
            >
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Ultra Luxury">Ultra Luxury</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Finish Type</label>
            <input
              type="text"
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              placeholder="e.g. Natural Gloss"
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Water Resistance</label>
            <input
              type="text"
              value={waterResistance}
              onChange={(e) => setWaterResistance(e.target.value)}
              placeholder="e.g. Waterproof"
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Termite Resistance</label>
            <input
              type="text"
              value={termiteResistance}
              onChange={(e) => setTermiteResistance(e.target.value)}
              placeholder="e.g. 100% Termite Proof"
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Sample Image URL</label>
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
            id="matIsPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 text-gold-500 rounded bg-charcoal-900 border-gold-500/30"
          />
          <label htmlFor="matIsPublished" className="text-xs font-semibold text-gray-300 cursor-pointer">
            Publish on Materials Guide Page
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
            <span>{submitting ? 'Saving...' : 'Save Material Spec'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
