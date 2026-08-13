import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ProjectCard } from '../../components/public/ProjectCard';
import { BeforeAfterSlider } from '../../components/ui/BeforeAfterSlider';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Project, ProjectCategory } from '../../types';
import { Search, Briefcase, Tag, Calendar, MapPin, Layers, IndianRupee } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    'All',
    'Modular Kitchen',
    'Wardrobe',
    'Living Room',
    'Bedroom',
    'Commercial',
    'Villa',
    'Custom Furniture',
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.wood_type && p.wood_type.toLowerCase().includes(q)) ||
        (p.materials && p.materials.some((m) => m.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
          Craftsmanship Portfolio
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-100">
          Our Interior & Woodwork Projects
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Explore completed modular kitchens, custom wardrobes, living room wall panels, and bespoke furniture crafted for homes across Chennai.
        </p>
      </div>

      {/* Filter Bar & Search Input */}
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-gold-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project title, location, or materials..."
            className="w-full bg-charcoal-800 border border-gold-500/30 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-gold-400 shadow-gold-sm"
          />
        </div>

        {/* Category Filter Pills */}
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
      </div>

      {/* Projects Grid or Empty State */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={(p) => setSelectedProject(p)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title={searchQuery || activeCategory !== 'All' ? 'No Matching Projects Found' : 'No Projects Published Yet'}
          description={
            searchQuery || activeCategory !== 'All'
              ? 'Try broadening your search query or selecting a different project category.'
              : 'Our project catalog is currently empty. Use the Admin CMS to add completed woodwork projects.'
          }
        />
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <Modal
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Before / After Interactive Slider */}
            <BeforeAfterSlider
              beforeImage={selectedProject.before_image}
              afterImage={selectedProject.after_image || selectedProject.cover_image}
              title={selectedProject.title}
            />

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Project Description</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{selectedProject.description}</p>
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-charcoal-900 border border-gold-500/20 rounded-xl text-xs">
              <div>
                <span className="text-gray-400 block mb-1">Category</span>
                <span className="font-semibold text-gold-400 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{selectedProject.category}</span>
                </span>
              </div>

              <div>
                <span className="text-gray-400 block mb-1">Wood Type</span>
                <span className="font-semibold text-gray-200 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-gold-400" />
                  <span>{selectedProject.wood_type || 'N/A'}</span>
                </span>
              </div>

              <div>
                <span className="text-gray-400 block mb-1">Budget</span>
                <span className="font-semibold text-gray-200 flex items-center space-x-1">
                  <IndianRupee className="w-3.5 h-3.5 text-gold-400" />
                  <span>{selectedProject.budget || 'N/A'}</span>
                </span>
              </div>

              <div>
                <span className="text-gray-400 block mb-1">Timeline</span>
                <span className="font-semibold text-gray-200 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-gold-400" />
                  <span>{selectedProject.timeline || 'N/A'}</span>
                </span>
              </div>
            </div>

            {/* Specifications Map */}
            {selectedProject.specifications && Object.keys(selectedProject.specifications).length > 0 && (
              <div className="p-4 bg-charcoal-900 border border-gold-500/20 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-gold-400 uppercase tracking-wider block">Technical Specifications</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
                  {Object.entries(selectedProject.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-400">{key}:</span>
                      <span className="font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Testimonial */}
            {selectedProject.customer_review && (
              <div className="p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl text-xs text-gold-300 italic">
                <strong className="not-italic block font-bold text-gold-400 mb-1">Client Review:</strong>
                "{selectedProject.customer_review}"
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
