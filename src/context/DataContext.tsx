import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Project,
  GalleryItem,
  Service,
  Material,
  Appointment,
  Message,
  Review,
  SiteSettings,
  DashboardStats,
} from '../types';
import {
  getSiteSettings,
  getProjects,
  getGalleryItems,
  getServices,
  getMaterials,
  getAppointments,
  getMessages,
  getReviews,
  subscribeToData,
} from '../services/db';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface DataContextType {
  settings: SiteSettings;
  projects: Project[];
  allProjects: Project[]; // includes unpublished for admin
  gallery: GalleryItem[];
  allGallery: GalleryItem[];
  services: Service[];
  allServices: Service[];
  materials: Material[];
  allMaterials: Material[];
  appointments: Appointment[];
  messages: Message[];
  reviews: Review[];
  allReviews: Review[];
  stats: DashboardStats;
  loading: boolean;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    id: 'default',
    company_name: 'JM INTERIOR',
    owner_name: 'K. Selvam',
    tagline: 'Crafting Premium Interior Spaces with Precision',
    phones: ['7358549554', '9342004411'],
    email: 'contact@jminterior.com',
    whatsapp: '917358549554',
    address: '4/29 Kamarajar Street, Nesapakkam, Chennai, Tamil Nadu - 600078',
    google_maps_url: 'https://maps.google.com/?q=4/29+Kamarajar+Street+Nesapakkam+Chennai',
    logo_url: '',
    admin_passkey: 'selvam123',
    meta_title: 'JM INTERIOR | Premium Interior Design & Woodwork',
    meta_description: 'Luxury modular kitchens, wardrobes, and custom interior design in Chennai by K. Selvam.',
    updated_at: new Date().toISOString(),
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [allGallery, setAllGallery] = useState<GalleryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [sData, pubProj, adminProj, pubGal, adminGal, pubServ, adminServ, pubMat, adminMat, apptsData, msgsData, pubRev, adminRev] =
        await Promise.all([
          getSiteSettings(),
          getProjects(false),
          getProjects(true),
          getGalleryItems(false),
          getGalleryItems(true),
          getServices(false),
          getServices(true),
          getMaterials(false),
          getMaterials(true),
          getAppointments(),
          getMessages(),
          getReviews(false),
          getReviews(true),
        ]);

      setSettings(sData);
      setProjects(pubProj);
      setAllProjects(adminProj);
      setGallery(pubGal);
      setAllGallery(adminGal);
      setServices(pubServ);
      setAllServices(adminServ);
      setMaterials(pubMat);
      setAllMaterials(adminMat);
      setAppointments(apptsData);
      setMessages(msgsData);
      setReviews(pubRev);
      setAllReviews(adminRev);
    } catch (e) {
      console.error('Data refresh error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeToData(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [refreshData]);

  const stats: DashboardStats = {
    totalProjects: allProjects.length,
    pendingAppointments: appointments.filter((a) => a.status === 'Pending').length,
    unreadMessages: messages.filter((m) => !m.is_read).length,
    approvedReviews: allReviews.filter((r) => r.status === 'Approved').length,
    totalGallery: allGallery.length,
    totalServices: allServices.length,
  };

  return (
    <DataContext.Provider
      value={{
        settings,
        projects,
        allProjects,
        gallery,
        allGallery,
        services,
        allServices,
        materials,
        allMaterials,
        appointments,
        messages,
        reviews,
        allReviews,
        stats,
        loading,
        toasts,
        showToast,
        removeToast,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
