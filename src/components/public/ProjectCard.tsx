import React from 'react';
import { Project } from '../../types';
import { motion } from 'framer-motion';
import { MapPin, Calendar, IndianRupee, Layers, ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      onClick={() => onSelect(project)}
      className="group relative bg-charcoal-800/80 border border-gold-500/20 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg hover:border-gold-500/60 hover:shadow-gold-glow transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Cover Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={project.cover_image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent" />

        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-charcoal-900/90 text-gold-400 border border-gold-500/30 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
          {project.category}
        </span>

        {/* Status Badge */}
        <span
          className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            project.status === 'Completed'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : project.status === 'In Progress'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-serif font-bold text-gray-100 group-hover:text-gold-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-gold-400/60 group-hover:text-gold-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Specs Grid */}
        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gold-500/10 text-xs text-gray-300">
          {project.wood_type && (
            <div className="flex items-center space-x-1.5 text-gray-300">
              <Layers className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="truncate">{project.wood_type}</span>
            </div>
          )}

          {project.location && (
            <div className="flex items-center space-x-1.5 text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          )}

          {project.budget && (
            <div className="flex items-center space-x-1.5 text-gray-300">
              <IndianRupee className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>{project.budget}</span>
            </div>
          )}

          {project.timeline && (
            <div className="flex items-center space-x-1.5 text-gray-300">
              <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>{project.timeline}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
