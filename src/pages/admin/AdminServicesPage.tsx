import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { AdminServiceModal } from '../../components/admin/AdminServiceModal';
import { deleteService, updateService } from '../../services/db';
import { Service } from '../../types';
import { PlusCircle, Edit3, Trash2, Eye, EyeOff, Wrench } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const AdminServicesPage: React.FC = () => {
  const { allServices, showToast } = useData();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);

  const handleTogglePublish = async (service: Service) => {
    try {
      await updateService(service.id, { is_published: !service.is_published });
      showToast(`Service "${service.name}" ${!service.is_published ? 'Published' : 'Hidden'}`, 'success');
    } catch (e) {
      showToast('Error toggling service visibility', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      showToast('Service deleted', 'success');
    } catch (e) {
      showToast('Error deleting service', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Services Management"
        subtitle="Manage interior design offerings, feature deliverables, and price ranges"
      />

      <div className="px-8 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setServiceToEdit(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs shadow-gold-glow hover:brightness-110 flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {allServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allServices.map((service) => (
              <div
                key={service.id}
                className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl p-6 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-gold-400 bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/20">
                      {service.category}
                    </span>
                    <button
                      onClick={() => handleTogglePublish(service)}
                      className={`text-xs font-semibold flex items-center space-x-1 ${
                        service.is_published ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {service.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h3 className="font-serif font-bold text-gray-100 text-lg mb-2">{service.name}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4">{service.description}</p>
                </div>

                <div className="pt-4 border-t border-gold-500/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-gold-400">{service.price_range || 'Custom Quote'}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setServiceToEdit(service);
                        setModalOpen(true);
                      }}
                      className="p-1.5 text-gold-400 hover:bg-gold-500/10 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Wrench}
            title="No Services Configured"
            description="Add custom modular kitchen, wardrobe, and complete residence offerings."
            actionLabel="Add Service"
            onAction={() => {
              setServiceToEdit(null);
              setModalOpen(true);
            }}
          />
        )}
      </div>

      <AdminServiceModal isOpen={modalOpen} onClose={() => setModalOpen(false)} serviceToEdit={serviceToEdit} />
    </div>
  );
};
