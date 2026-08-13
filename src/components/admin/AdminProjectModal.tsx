import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Project, ProjectCategory, ProjectStatus } from '../../types';
import { createProject, updateProject } from '../../services/db';
import { uploadImage } from '../../services/storage';
import { useData } from '../../context/DataContext';
import { Upload, Image as ImageIcon, Save, Layers } from 'lucide-react';

interface AdminProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const AdminProjectModal: React.FC<AdminProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { showToast } = useData();

  const [title, setTitle] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [category, setCategory] = useState<ProjectCategory>('Modular Kitchen');
  const [description, setDescription] = useState<string>('');
  const [woodType, setWoodType] = useState<string>('');
  const [materialsStr, setMaterialsStr] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [status, setStatus] = useState<ProjectStatus>('Completed');
  const [coverImage, setCoverImage] = useState<string>('');
  const [beforeImage, setBeforeImage] = useState<string>('');
  const [afterImage, setAfterImage] = useState<string>('');
  const [blueprintUrl, setBlueprintUrl] = useState<string>('');
  const [customerReview, setCustomerReview] = useState<string>('');
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setClientName(projectToEdit.client_name || '');
      setLocation(projectToEdit.location || '');
      setCategory(projectToEdit.category);
      setDescription(projectToEdit.description);
      setWoodType(projectToEdit.wood_type || '');
      setMaterialsStr(projectToEdit.materials ? projectToEdit.materials.join(', ') : '');
      setBudget(projectToEdit.budget || '');
      setTimeline(projectToEdit.timeline || '');
      setStatus(projectToEdit.status);
      setCoverImage(projectToEdit.cover_image);
      setBeforeImage(projectToEdit.before_image || '');
      setAfterImage(projectToEdit.after_image || '');
      setBlueprintUrl(projectToEdit.blueprint_url || '');
      setCustomerReview(projectToEdit.customer_review || '');
      setIsPublished(projectToEdit.is_published);
    } else {
      setTitle('');
      setClientName('');
      setLocation('');
      setCategory('Modular Kitchen');
      setDescription('');
      setWoodType('');
      setMaterialsStr('');
      setBudget('');
      setTimeline('');
      setStatus('Completed');
      setCoverImage('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200');
      setBeforeImage('');
      setAfterImage('');
      setBlueprintUrl('');
      setCustomerReview('');
      setIsPublished(true);
    }
  }, [projectToEdit, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await uploadImage(file);
        setter(base64);
        showToast('Image uploaded successfully', 'success');
      } catch (err) {
        showToast('Failed to process image file', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coverImage.trim()) {
      showToast('Project title and cover image are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        client_name: clientName.trim() || undefined,
        location: location.trim() || undefined,
        category,
        description: description.trim(),
        wood_type: woodType.trim() || undefined,
        materials: materialsStr ? materialsStr.split(',').map((s) => s.trim()).filter(Boolean) : [],
        budget: budget.trim() || undefined,
        timeline: timeline.trim() || undefined,
        status,
        cover_image: coverImage.trim(),
        before_image: beforeImage.trim() || undefined,
        after_image: afterImage.trim() || coverImage.trim(),
        blueprint_url: blueprintUrl.trim() || undefined,
        customer_review: customerReview.trim() || undefined,
        is_published: isPublished,
      };

      if (projectToEdit) {
        await updateProject(projectToEdit.id, payload);
        showToast('Project updated successfully!', 'success');
      } else {
        await createProject(payload);
        showToast('New Project created and published!', 'success');
      }
      onClose();
    } catch (err) {
      showToast('Failed to save project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const categories: ProjectCategory[] = [
    'Modular Kitchen',
    'Wardrobe',
    'Living Room',
    'Bedroom',
    'Commercial',
    'Villa',
    'Custom Furniture',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Interior Project' : 'Create New Interior Project'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Project Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Royal Burma Teak Modular Kitchen"
              required
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Dr. Rajesh"
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Anna Nagar, Chennai"
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Wood Type</label>
            <input
              type="text"
              value={woodType}
              onChange={(e) => setWoodType(e.target.value)}
              placeholder="e.g. Burma Teak & Marine Ply"
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. ₹4,50,000"
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Timeline</label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 35 Days"
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
            placeholder="Detailed description of craftsmanship, layout, materials, and hardware used..."
            required
            className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Cover Image Upload & Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Cover Image URL *</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
              className="flex-grow bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
            <label className="cursor-pointer px-4 py-2 bg-charcoal-700 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1 shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setCoverImage)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Before / After Slider Image Inputs */}
        <div className="p-4 bg-charcoal-900/60 border border-gold-500/20 rounded-xl space-y-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block">
            Before & After Image Comparison (Optional Slider)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Before Image URL</label>
              <input
                type="text"
                value={beforeImage}
                onChange={(e) => setBeforeImage(e.target.value)}
                placeholder="Raw site / initial state URL"
                className="w-full bg-charcoal-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-100"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">After Image URL</label>
              <input
                type="text"
                value={afterImage}
                onChange={(e) => setAfterImage(e.target.value)}
                placeholder="Finished woodwork URL"
                className="w-full bg-charcoal-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Customer Review */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Customer Review / Testimonial</label>
          <input
            type="text"
            value={customerReview}
            onChange={(e) => setCustomerReview(e.target.value)}
            placeholder="e.g. K. Selvam sir delivered pure perfection..."
            className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center space-x-3 pt-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 text-gold-500 rounded bg-charcoal-900 border-gold-500/30 focus:ring-gold-400"
          />
          <label htmlFor="isPublished" className="text-xs font-semibold text-gray-300 cursor-pointer">
            Publish on Public Website
          </label>
        </div>

        <div className="pt-4 border-t border-gold-500/20 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-xs font-semibold hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs shadow-gold-glow hover:brightness-110 flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : projectToEdit ? 'Update Project' : 'Publish Project'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
