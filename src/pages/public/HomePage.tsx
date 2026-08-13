import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  ShieldCheck,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Briefcase,
  Wrench,
  ImageIcon,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ProjectCard } from '../../components/public/ProjectCard';
import { ServiceCard } from '../../components/public/ServiceCard';
import { BeforeAfterSlider } from '../../components/ui/BeforeAfterSlider';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Project } from '../../types';

export const HomePage: React.FC = () => {
  const { projects, services, gallery, settings } = useData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const primaryPhone = settings.phones[0] || '7358549554';

  const featuredProjects = projects.slice(0, 3);
  const featuredServices = services.slice(0, 3);
  const featuredGallery = gallery.slice(0, 4);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-gold-500/20">
        {/* Background Image Overlay with Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
            alt="JM Interior Luxury Woodwork"
            className="w-full h-full object-cover scale-105 filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/75 to-charcoal-900/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.15)_0%,transparent_70%)]" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 pt-12">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 backdrop-blur-md shadow-gold-glow"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
              Chennai's Premier Woodwork & Interior Studio
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-gray-100 leading-tight"
          >
            Crafting Premium Interior Spaces <br className="hidden sm:inline" />
            <span className="bg-gold-gradient bg-clip-text text-transparent">With Precision</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Luxury Interiors • Modular Kitchens • Custom Furniture • Complete Interior Solutions under the master leadership of <strong className="text-gold-400 font-semibold">{settings.owner_name}</strong>.
          </motion.p>

          {/* Working CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/projects"
              className="w-full sm:w-auto px-8 py-4 bg-gold-gradient text-charcoal-900 font-bold text-base rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Briefcase className="w-5 h-5" />
              <span>Explore Projects</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/appointment"
              className="w-full sm:w-auto px-8 py-4 bg-charcoal-800/90 border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 font-bold text-base rounded-xl backdrop-blur-md transition-all flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Free Site Consultation</span>
            </Link>
          </motion.div>

          {/* Direct Contact Quick Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300 border-t border-gold-500/10 max-w-2xl mx-auto"
          >
            <a href={`tel:${primaryPhone}`} className="hover:text-gold-400 flex items-center space-x-1.5 font-semibold">
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Call: +91 {primaryPhone}</span>
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 flex items-center space-x-1.5 font-semibold"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Direct</span>
            </a>
            <a
              href={settings.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold-400 flex items-center space-x-1.5"
            >
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>Nesapakkam Workshop, Chennai</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS & CRAFTSMANSHIP HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Award, label: 'Master Craftsmanship', desc: 'Over 15+ years of custom woodwork & interior experience' },
            { icon: ShieldCheck, label: '100% Termite Proof', desc: 'Marine grade BWP plywood & seasoned Burma teak' },
            { icon: Clock, label: 'On-Time Handover', desc: 'Guaranteed project completion within promised timeline' },
            { icon: Sparkles, label: 'Custom 3D & Design', desc: 'Precision engineered layouts customized for your space' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-charcoal-800/60 border border-gold-500/20 p-6 rounded-2xl backdrop-blur-md shadow-lg hover:border-gold-500/40 transition-all"
            >
              <item.icon className="w-8 h-8 text-gold-400 mb-3" />
              <h3 className="font-serif font-bold text-gray-100 text-lg mb-1">{item.label}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 border-b border-gold-500/20 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block mb-1">
              Bespoke Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-100">Our Signature Services</h2>
          </div>
          <Link
            to="/services"
            className="hidden sm:inline-flex items-center space-x-1 text-sm font-bold text-gold-400 hover:text-white transition-colors"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Wrench}
            title="No Services Published Yet"
            description="Our service catalog is currently empty. Use the Admin CMS to add custom modular kitchen, wardrobe, and woodwork services."
          />
        )}
      </section>

      {/* 4. FEATURED PROJECTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 border-b border-gold-500/20 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block mb-1">
              Portfolio Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-100">Recent Interior Projects</h2>
          </div>
          <Link
            to="/projects"
            className="hidden sm:inline-flex items-center space-x-1 text-sm font-bold text-gold-400 hover:text-white transition-colors"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onSelect={(p) => setSelectedProject(p)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No Projects Published Yet"
            description="Our portfolio gallery is currently empty. Log into the Admin CMS via the hammer icon (🔨) to upload and publish your latest woodwork projects."
          />
        )}
      </section>

      {/* 5. GALLERY PREVIEW */}
      {featuredGallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 border-b border-gold-500/20 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block mb-1">
                Visual Craftsmanship
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-100">Craftsmanship Gallery</h2>
            </div>
            <Link
              to="/gallery"
              className="text-sm font-bold text-gold-400 hover:text-white flex items-center space-x-1"
            >
              <span>Full Photo Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredGallery.map((item) => (
              <div
                key={item.id}
                className="relative h-60 rounded-2xl overflow-hidden border border-gold-500/20 shadow-md group"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-gold-400 bg-charcoal-900/80 px-2.5 py-1 rounded-md backdrop-blur-md">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-charcoal-800 border border-gold-500/30 p-10 sm:p-16 overflow-hidden shadow-gold-glow text-center space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full filter blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-100">
            Ready to Transform Your Interior Space?
          </h2>
          <p className="text-gray-300 text-base max-w-2xl mx-auto leading-relaxed">
            Contact <strong className="text-gold-400">{settings.owner_name}</strong> today for a free design consultation, material estimate, or site measurement in Chennai.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              to="/appointment"
              className="px-8 py-3.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl shadow-gold-glow hover:brightness-110 transition-all inline-flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Appointment Now</span>
            </Link>
            <a
              href={`tel:${primaryPhone}`}
              className="px-8 py-3.5 bg-charcoal-900 border border-gold-500/40 text-gold-400 font-bold rounded-xl hover:bg-gold-500/10 transition-all inline-flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call +91 {primaryPhone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <Modal
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Before / After Comparison */}
            <BeforeAfterSlider
              beforeImage={selectedProject.before_image}
              afterImage={selectedProject.after_image || selectedProject.cover_image}
              title={selectedProject.title}
            />

            {/* Description & Details */}
            <div>
              <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-2">Project Overview</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{selectedProject.description}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-charcoal-900 border border-gold-500/20 rounded-xl text-xs">
              <div>
                <span className="text-gray-400 block">Category</span>
                <span className="font-semibold text-gold-400">{selectedProject.category}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Wood Type</span>
                <span className="font-semibold text-gray-200">{selectedProject.wood_type || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Budget</span>
                <span className="font-semibold text-gray-200">{selectedProject.budget || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Timeline</span>
                <span className="font-semibold text-gray-200">{selectedProject.timeline || 'N/A'}</span>
              </div>
            </div>

            {selectedProject.customer_review && (
              <div className="p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl text-xs text-gold-300 italic">
                "{selectedProject.customer_review}"
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
