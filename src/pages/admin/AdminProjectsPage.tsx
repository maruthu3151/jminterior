import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { AdminProjectModal } from '../../components/admin/AdminProjectModal';
import { deleteProject, updateProject } from '../../services/db';
import { Project } from '../../types';
import { PlusCircle, Edit3, Trash2, Eye, EyeOff, Search, Briefcase } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const AdminProjectsPage: React.FC = () => {
  const { allProjects, showToast } = useData();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = allProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTogglePublish = async (project: Project) => {
    try {
      await updateProject(project.id, { is_published: !project.is_published });
      showToast(
        `Project "${project.title}" ${!project.is_published ? 'Published' : 'Unpublished'}`,
        'success'
      );
    } catch (e) {
      showToast('Failed to update publish state', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      showToast('Project deleted successfully', 'success');
      setDeleteConfirmId(null);
    } catch (e) {
      showToast('Failed to delete project', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Projects Management"
        subtitle="Add, edit, publish, or remove interior & woodwork portfolio projects"
      />

      <div className="px-8 space-y-6">
        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-charcoal-800 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <button
            onClick={() => {
              setProjectToEdit(null);
              setModalOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs shadow-gold-glow hover:brightness-110 flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>

        {/* Projects List */}
        {filtered.length > 0 ? (
          <div className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-charcoal-900 text-gold-400 font-serif border-b border-gold-500/20 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Project</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Wood & Budget</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Visibility</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/10">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center space-x-3">
                        <img
                          src={p.cover_image}
                          alt={p.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gold-500/20 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-gray-100 text-sm block">{p.title}</span>
                          <span className="text-gray-400 text-[11px]">{p.client_name} • {p.location}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-gold-500/10 text-gold-400 font-semibold border border-gold-500/20">
                          {p.category}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-200">{p.wood_type || 'Custom Wood'}</span>
                          <span className="text-gold-400">{p.budget}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            p.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                            p.is_published
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                        >
                          {p.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{p.is_published ? 'Published' : 'Hidden'}</span>
                        </button>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setProjectToEdit(p);
                            setModalOpen(true);
                          }}
                          className="p-1.5 bg-charcoal-700 hover:bg-gold-500/20 text-gold-400 rounded-lg border border-gold-500/20 transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 rounded-lg border border-red-500/20 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No Projects Found"
            description="Start by adding your first luxury interior project or Burma teak kitchen installation."
            actionLabel="Add Project Now"
            onAction={() => {
              setProjectToEdit(null);
              setModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Project Add/Edit Modal */}
      <AdminProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-charcoal-800 border border-gold-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <h3 className="text-lg font-serif font-bold text-gray-100">Confirm Permanent Delete</h3>
            <p className="text-xs text-gray-400">Are you sure you want to remove this project from your database?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-charcoal-700 text-gray-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
