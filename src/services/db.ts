import { createClient } from '@supabase/supabase-js';
import {
  Project,
  GalleryItem,
  Service,
  Material,
  Appointment,
  Message,
  Review,
  SiteSettings,
  AppointmentStatus,
  ReviewStatus,
} from '../types';

// Detect Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Storage Keys for Local Storage Fallback Engine
const STORAGE_KEYS = {
  SETTINGS: 'jm_site_settings',
  PROJECTS: 'jm_projects',
  GALLERY: 'jm_gallery',
  SERVICES: 'jm_services',
  MATERIALS: 'jm_materials',
  APPOINTMENTS: 'jm_appointments',
  MESSAGES: 'jm_messages',
  REVIEWS: 'jm_reviews',
};

// Default Site Settings
const DEFAULT_SETTINGS: SiteSettings = {
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
};

// Event emitter for reactive local state sync
type DataChangeListener = () => void;
const listeners: DataChangeListener[] = [];

export const subscribeToData = (listener: DataChangeListener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

const notifyListeners = () => {
  listeners.forEach((fn) => fn());
};

// Local Storage Helper Utilities
const getLocal = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from LocalStorage:`, e);
    return defaultValue;
  }
};

const setLocal = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (e) {
    console.error(`Error saving ${key} to LocalStorage:`, e);
  }
};

// ==================== SITE SETTINGS ====================
export const getSiteSettings = async (): Promise<SiteSettings> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .single();
      if (!error && data) return data as SiteSettings;
    } catch (e) {
      console.warn('Supabase site_settings fetch error, fallback to LocalStorage', e);
    }
  }
  return getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
  const current = await getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...settings,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('site_settings').upsert(updated);
    } catch (e) {
      console.warn('Supabase update error:', e);
    }
  }

  setLocal(STORAGE_KEYS.SETTINGS, updated);
  return updated;
};

// ==================== PROJECTS ====================
export const getProjects = async (includeUnpublished = false): Promise<Project[]> => {
  if (supabase) {
    try {
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!includeUnpublished) query = query.eq('is_published', true);
      const { data, error } = await query;
      if (!error && data) return data as Project[];
    } catch (e) {
      console.warn('Supabase projects fetch error, fallback to LocalStorage', e);
    }
  }
  const all = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, []);
  return includeUnpublished ? all : all.filter((p) => p.is_published);
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at'>): Promise<Project> => {
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').insert(newProject).select().single();
      if (!error && data) {
        notifyListeners();
        return data as Project;
      }
    } catch (e) {
      console.warn('Supabase insert error:', e);
    }
  }

  const existing = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, []);
  setLocal(STORAGE_KEYS.PROJECTS, [newProject, ...existing]);
  return newProject;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  const all = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, []);
  const index = all.findIndex((p) => p.id === id);
  const updatedProject = index > -1 ? { ...all[index], ...updates, updated_at: new Date().toISOString() } : null;

  if (supabase) {
    try {
      await supabase.from('projects').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    } catch (e) {
      console.warn('Supabase update error:', e);
    }
  }

  if (updatedProject && index > -1) {
    all[index] = updatedProject;
    setLocal(STORAGE_KEYS.PROJECTS, all);
  }
  return updatedProject;
};

export const deleteProject = async (id: string): Promise<boolean> => {
  if (supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  const all = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, []);
  const filtered = all.filter((p) => p.id !== id);
  setLocal(STORAGE_KEYS.PROJECTS, filtered);
  return true;
};

// ==================== GALLERY ====================
export const getGalleryItems = async (includeUnpublished = false): Promise<GalleryItem[]> => {
  if (supabase) {
    try {
      let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (!includeUnpublished) query = query.eq('is_published', true);
      const { data, error } = await query;
      if (!error && data) return data as GalleryItem[];
    } catch (e) {
      console.warn('Supabase gallery fetch error:', e);
    }
  }
  const all = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, []);
  return includeUnpublished ? all : all.filter((item) => item.is_published);
};

export const createGalleryItem = async (item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<GalleryItem> => {
  const newItem: GalleryItem = {
    ...item,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('gallery').insert(newItem).select().single();
      if (!error && data) return data as GalleryItem;
    } catch (e) {
      console.warn('Supabase insert gallery error:', e);
    }
  }

  const existing = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, []);
  setLocal(STORAGE_KEYS.GALLERY, [newItem, ...existing]);
  return newItem;
};

export const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> => {
  const all = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, []);
  const index = all.findIndex((g) => g.id === id);
  if (index === -1) return null;

  const updated = { ...all[index], ...updates };

  if (supabase) {
    try {
      await supabase.from('gallery').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase gallery update error:', e);
    }
  }

  all[index] = updated;
  setLocal(STORAGE_KEYS.GALLERY, all);
  return updated;
};

export const deleteGalleryItem = async (id: string): Promise<boolean> => {
  if (supabase) {
    try {
      await supabase.from('gallery').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase gallery delete error:', e);
    }
  }
  const all = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, []);
  setLocal(STORAGE_KEYS.GALLERY, all.filter((g) => g.id !== id));
  return true;
};

// ==================== SERVICES ====================
export const getServices = async (includeUnpublished = false): Promise<Service[]> => {
  if (supabase) {
    try {
      let query = supabase.from('services').select('*').order('created_at', { ascending: false });
      if (!includeUnpublished) query = query.eq('is_published', true);
      const { data, error } = await query;
      if (!error && data) return data as Service[];
    } catch (e) {
      console.warn('Supabase services error:', e);
    }
  }
  const all = getLocal<Service[]>(STORAGE_KEYS.SERVICES, []);
  return includeUnpublished ? all : all.filter((s) => s.is_published);
};

export const createService = async (service: Omit<Service, 'id' | 'created_at'>): Promise<Service> => {
  const newService: Service = {
    ...service,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('services').insert(newService).select().single();
      if (!error && data) return data as Service;
    } catch (e) {
      console.warn('Supabase insert service error:', e);
    }
  }

  const existing = getLocal<Service[]>(STORAGE_KEYS.SERVICES, []);
  setLocal(STORAGE_KEYS.SERVICES, [newService, ...existing]);
  return newService;
};

export const updateService = async (id: string, updates: Partial<Service>): Promise<Service | null> => {
  const all = getLocal<Service[]>(STORAGE_KEYS.SERVICES, []);
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const updated = { ...all[index], ...updates };

  if (supabase) {
    try {
      await supabase.from('services').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase update service error:', e);
    }
  }

  all[index] = updated;
  setLocal(STORAGE_KEYS.SERVICES, all);
  return updated;
};

export const deleteService = async (id: string): Promise<boolean> => {
  if (supabase) {
    try {
      await supabase.from('services').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete service error:', e);
    }
  }
  const all = getLocal<Service[]>(STORAGE_KEYS.SERVICES, []);
  setLocal(STORAGE_KEYS.SERVICES, all.filter((s) => s.id !== id));
  return true;
};

// ==================== MATERIALS ====================
export const getMaterials = async (includeUnpublished = false): Promise<Material[]> => {
  if (supabase) {
    try {
      let query = supabase.from('materials').select('*').order('created_at', { ascending: false });
      if (!includeUnpublished) query = query.eq('is_published', true);
      const { data, error } = await query;
      if (!error && data) return data as Material[];
    } catch (e) {
      console.warn('Supabase materials error:', e);
    }
  }
  const all = getLocal<Material[]>(STORAGE_KEYS.MATERIALS, []);
  return includeUnpublished ? all : all.filter((m) => m.is_published);
};

export const createMaterial = async (material: Omit<Material, 'id' | 'created_at'>): Promise<Material> => {
  const newMaterial: Material = {
    ...material,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('materials').insert(newMaterial).select().single();
      if (!error && data) return data as Material;
    } catch (e) {
      console.warn('Supabase insert material error:', e);
    }
  }

  const existing = getLocal<Material[]>(STORAGE_KEYS.MATERIALS, []);
  setLocal(STORAGE_KEYS.MATERIALS, [newMaterial, ...existing]);
  return newMaterial;
};

export const updateMaterial = async (id: string, updates: Partial<Material>): Promise<Material | null> => {
  const all = getLocal<Material[]>(STORAGE_KEYS.MATERIALS, []);
  const index = all.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const updated = { ...all[index], ...updates };

  if (supabase) {
    try {
      await supabase.from('materials').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase update material error:', e);
    }
  }

  all[index] = updated;
  setLocal(STORAGE_KEYS.MATERIALS, all);
  return updated;
};

export const deleteMaterial = async (id: string): Promise<boolean> => {
  if (supabase) {
    try {
      await supabase.from('materials').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete material error:', e);
    }
  }
  const all = getLocal<Material[]>(STORAGE_KEYS.MATERIALS, []);
  setLocal(STORAGE_KEYS.MATERIALS, all.filter((m) => m.id !== id));
  return true;
};

// ==================== APPOINTMENTS ====================
export const getAppointments = async (): Promise<Appointment[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Appointment[];
    } catch (e) {
      console.warn('Supabase appointments error:', e);
    }
  }
  return getLocal<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'status'>): Promise<Appointment> => {
  const newAppointment: Appointment = {
    ...appointment,
    id: crypto.randomUUID(),
    status: 'Pending',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('appointments').insert(newAppointment).select().single();
      if (!error && data) {
        notifyListeners();
        return data as Appointment;
      }
    } catch (e) {
      console.warn('Supabase insert appointment error:', e);
    }
  }

  const existing = getLocal<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
  setLocal(STORAGE_KEYS.APPOINTMENTS, [newAppointment, ...existing]);
  return newAppointment;
};

export const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatus,
  adminNotes?: string,
  preferredDate?: string
): Promise<Appointment | null> => {
  const all = getLocal<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
  const index = all.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updates: Partial<Appointment> = { status };
  if (adminNotes !== undefined) updates.admin_notes = adminNotes;
  if (preferredDate) updates.preferred_date = preferredDate;

  const updated = { ...all[index], ...updates };

  if (supabase) {
    try {
      await supabase.from('appointments').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase appointment update error:', e);
    }
  }

  all[index] = updated;
  setLocal(STORAGE_KEYS.APPOINTMENTS, all);
  return updated;
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  if (supabase) {
    try {
      await supabase.from('appointments').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase appointment delete error:', e);
    }
  }
  const all = getLocal<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
  setLocal(STORAGE_KEYS.APPOINTMENTS, all.filter((a) => a.id !== id));
  return true;
};

// ==================== MESSAGES ====================
export const getMessages = async (): Promise<Message[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Message[];
    } catch (e) {
      console.warn('Supabase messages error:', e);
    }
  }
  return getLocal<Message[]>(STORAGE_KEYS.MESSAGES, []);
};

export const createMessage = async (msg: Omit<Message, 'id' | 'created_at' | 'is_read' | 'is_archived'>): Promise<Message> => {
  const newMessage: Message = {
    ...msg,
    id: crypto.randomUUID(),
    is_read: false,
    is_archived: false,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('messages').insert(newMessage).select().single();
      if (!error && data) {
        notifyListeners();
        return data as Message;
      }
    } catch (e) {
      console.warn('Supabase insert message error:', e);
    }
  }

  const existing = getLocal<Message[]>(STORAGE_KEYS.MESSAGES, []);
  setLocal(STORAGE_KEYS.MESSAGES, [newMessage, ...existing]);
  return newMessage;
};

export const markMessageRead = async (id: string, isRead: boolean): Promise<boolean> => {
  const all = getLocal<Message[]>(STORAGE_KEYS.MESSAGES, []);
  const index = all.findIndex((m) => m.id === id);
  if (index > -1) {
    all[index].is_read = isRead;
    setLocal(STORAGE_KEYS.MESSAGES, all);
  }

  if (supabase) {
    try {
      await supabase.from('messages').update({ is_read: isRead }).eq('id', id);
    } catch (e) {
      console.warn('Supabase message read error:', e);
    }
  }
  return true;
};

export const archiveMessage = async (id: string, isArchived: boolean): Promise<boolean> => {
  const all = getLocal<Message[]>(STORAGE_KEYS.MESSAGES, []);
  const index = all.findIndex((m) => m.id === id);
  if (index > -1) {
    all[index].is_archived = isArchived;
    setLocal(STORAGE_KEYS.MESSAGES, all);
  }

  if (supabase) {
    try {
      await supabase.from('messages').update({ is_archived: isArchived }).eq('id', id);
    } catch (e) {
      console.warn('Supabase message archive error:', e);
    }
  }
  return true;
};

export const deleteMessage = async (id: string): Promise<boolean> => {
  if (supabase) {
    try {
      await supabase.from('messages').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase message delete error:', e);
    }
  }
  const all = getLocal<Message[]>(STORAGE_KEYS.MESSAGES, []);
  setLocal(STORAGE_KEYS.MESSAGES, all.filter((m) => m.id !== id));
  return true;
};

// ==================== REVIEWS ====================
export const getReviews = async (includeUnapproved = false): Promise<Review[]> => {
  if (supabase) {
    try {
      let query = supabase.from('reviews').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
      if (!includeUnapproved) query = query.eq('status', 'Approved');
      const { data, error } = await query;
      if (!error && data) return data as Review[];
    } catch (e) {
      console.warn('Supabase reviews error:', e);
    }
  }
  const all = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, []);
  const list = includeUnapproved ? all : all.filter((r) => r.status === 'Approved');
  return list.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
};

export const createReview = async (review: Omit<Review, 'id' | 'created_at' | 'status'>): Promise<Review> => {
  const newReview: Review = {
    ...review,
    id: crypto.randomUUID(),
    status: 'Pending',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('reviews').insert(newReview).select().single();
      if (!error && data) {
        notifyListeners();
        return data as Review;
      }
    } catch (e) {
      console.warn('Supabase insert review error:', e);
    }
  }

  const existing = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, []);
  setLocal(STORAGE_KEYS.REVIEWS, [newReview, ...existing]);
  return newReview;
};

export const updateReviewStatus = async (id: string, status: ReviewStatus): Promise<boolean> => {
  const all = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, []);
  const index = all.findIndex((r) => r.id === id);
  if (index > -1) {
    all[index].status = status;
    setLocal(STORAGE_KEYS.REVIEWS, all);
  }

  if (supabase) {
    try {
      await supabase.from('reviews').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase review status update error:', e);
    }
  }
  return true;
};

export const togglePinReview = async (id: string): Promise<boolean> => {
  const all = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, []);
  const index = all.findIndex((r) => r.id === id);
  if (index > -1) {
    all[index].is_pinned = !all[index].is_pinned;
    setLocal(STORAGE_KEYS.REVIEWS, all);
  }

  if (supabase) {
    try {
      await supabase.from('reviews').update({ is_pinned: all[index]?.is_pinned }).eq('id', id);
    } catch (e) {
      console.warn('Supabase review pin error:', e);
    }
  }
  return true;
};

export const deleteReview = async (id: string): Promise<boolean> => {
  if (supabase) {
    try {
      await supabase.from('reviews').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase review delete error:', e);
    }
  }
  const all = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, []);
  setLocal(STORAGE_KEYS.REVIEWS, all.filter((r) => r.id !== id));
  return true;
};

// ==================== SEED / CLEAR UTILITIES ====================
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  notifyListeners();
};

export const seedSampleData = async (): Promise<void> => {
  const sampleProjects: Project[] = [
    {
      id: crypto.randomUUID(),
      title: 'Luxury Royal Teak Modular Kitchen',
      client_name: 'Dr. Rajesh & Family',
      location: 'Anna Nagar, Chennai',
      category: 'Modular Kitchen',
      description: 'Handcrafted premium teak wood kitchen layout featuring marine-ply carcasses, Blum soft-close hinges, quartz countertops, and integrated ambient LED strip lighting.',
      wood_type: 'Burma Teak & Marine Plywood',
      materials: ['Marine Ply BWP', 'Burma Teak Finish', 'Quartz Stone', 'Hafele Fittings'],
      budget: '₹6,50,000',
      timeline: '45 Days',
      status: 'Completed',
      cover_image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
      before_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      after_image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
      blueprint_url: '',
      specifications: {
        Layout: 'L-Shaped with Island',
        Countertop: 'Calacatta Quartz',
        'Cabinet Finish': 'High-Gloss Teak Veneer',
        Accessories: 'Pull-out Pantry & Magic Corner',
      },
      customer_review: 'K. Selvam sir delivered pure perfection. The woodwork quality in our kitchen is world class.',
      is_published: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Modern Master Suite Floor-to-Ceiling Wardrobe',
      client_name: 'Mr. Suresh Kumar',
      location: 'Velachery, Chennai',
      category: 'Wardrobe',
      description: 'Custom floor-to-ceiling walk-in wardrobe with bronze fluted glass doors, concealed velvet jewelry drawers, and automated sensor lights.',
      wood_type: 'Calibrated Plywood & Engineered Veneer',
      materials: ['Greenply BWP', 'Fluted Glass', 'Italian Leather Handles'],
      budget: '₹4,20,000',
      timeline: '30 Days',
      status: 'Completed',
      cover_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
      before_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      after_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
      specifications: {
        Doors: 'Sliding Fluted Glass & Wood',
        'Internal Layout': 'His & Hers Dual Wardrobe',
        Accessories: 'Tie Pullouts & Shoe Matrix',
      },
      customer_review: 'The precision and finish of the woodwork surpassed our expectations. Truly premium work.',
      is_published: true,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Contemporary Living Room Accent & Media Wall',
      client_name: 'Anand Architectural Studio',
      location: 'ECR, Chennai',
      category: 'Living Room',
      description: 'Bespoke wooden louvers wall paneling with integrated fireplace display, floating console in solid walnut wood, and warm cove lighting.',
      wood_type: 'American Walnut & Veneer Flutes',
      materials: ['Walnut Wood', 'Acoustic Slat Panels', 'Charcoal Louvers'],
      budget: '₹3,80,000',
      timeline: '25 Days',
      status: 'Completed',
      cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      customer_review: 'JM Interior turned our living room into a 5-star sanctuary. Incredible attention to detail!',
      is_published: true,
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
  ];

  const sampleGallery: GalleryItem[] = [
    {
      id: crypto.randomUUID(),
      title: 'Teak Island Countertop Finish',
      category: 'Modular Kitchen',
      image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
      is_published: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Concealed LED Closet Storage',
      category: 'Wardrobe',
      image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
      is_published: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Acoustic Wooden Wall Paneling',
      category: 'Living Room',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      is_published: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Custom Curved Oak Bedhead',
      category: 'Bedroom',
      image_url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800',
      is_published: true,
      created_at: new Date().toISOString(),
    },
  ];

  const sampleServices: Service[] = [
    {
      id: crypto.randomUUID(),
      name: 'Custom Modular Kitchens',
      category: 'Kitchen Interiors',
      description: 'Ergonomic, water-resistant modular kitchen designs crafted with marine-ply carcasses, high-gloss lacquered finishes, and German soft-close fittings.',
      image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
      features: ['100% Termite Proof Marine Ply', 'Blum/Hafele Soft-Close Hardware', 'Quartz & Granite Countertops', 'Custom Pantry & Tall Units'],
      price_range: '₹2.5L - ₹12L',
      is_published: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Luxury Wardrobes & Walk-In Closets',
      category: 'Bedroom Solutions',
      description: 'Precision-engineered floor-to-ceiling wardrobes available in sliding, hinged, and walk-in configurations with integrated sensor illumination.',
      image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
      features: ['Fluted Glass & Mirror Options', 'Concealed Jewelry Drawers', 'Automatic Motion Sensor LEDs', 'Custom Shoe Racks & Tie Trays'],
      price_range: '₹1.5L - ₹8L',
      is_published: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Complete Home Interior Turnkey Execution',
      category: 'Full Residence',
      description: 'End-to-end interior design and architectural woodwork execution from 3D design to hand-carved solid wood installations.',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      features: ['Dedicated Workshop Craftsmanship', '3D Design & Space Planning', 'Fixed Timeline Guarantee', 'Post-Handover Maintenance Warranty'],
      price_range: '₹5L - ₹35L',
      is_published: true,
      created_at: new Date().toISOString(),
    },
  ];

  const sampleMaterials: Material[] = [
    {
      id: crypto.randomUUID(),
      name: 'Burma Teak Wood',
      description: 'First-grade natural Burma teak with rich golden-brown grain, exceptional oil content, and unmatched longevity.',
      image_url: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&q=80&w=800',
      durability: 5,
      finish: 'Natural Matte / Gloss Polish',
      maintenance: 'Low',
      water_resistance: 'High',
      termite_resistance: '100% Termite Proof',
      cost_level: 'Ultra Luxury',
      is_published: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'BWP Grade Marine Plywood (IS 710)',
      description: 'Boiling Waterproof marine ply built with high-density hardwood veneers and phenolic resin, ideal for kitchens and humid environments.',
      image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      durability: 5,
      finish: 'Core Substrate',
      maintenance: 'Low',
      water_resistance: 'Waterproof',
      termite_resistance: 'Treated',
      cost_level: 'Premium',
      is_published: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Acrylic & PU Lacquer Panels',
      description: 'Ultra-high gloss and anti-fingerprint matte acrylic sheets bonded on HDMR boards for futuristic kitchen and wardrobe facades.',
      image_url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=800',
      durability: 4,
      finish: 'Mirror Gloss / Super Matte',
      maintenance: 'Low',
      water_resistance: 'High',
      termite_resistance: 'High',
      cost_level: 'Premium',
      is_published: true,
      created_at: new Date().toISOString(),
    },
  ];

  const sampleReviews: Review[] = [
    {
      id: crypto.randomUUID(),
      client_name: 'K. Vigneshwar',
      location: 'Nungambakkam, Chennai',
      project_title: '3BHK Complete Woodwork',
      rating: 5,
      comment: 'K. Selvam and his team completed our 3BHK interior woodwork in just 38 days. Every drawer slides like butter, and the teak finish is breathtaking.',
      status: 'Approved',
      is_pinned: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      client_name: 'Mrs. Lakshmi Narayan',
      location: 'Adyar, Chennai',
      project_title: 'Modular Teak Kitchen',
      rating: 5,
      comment: 'Highly professional craftsman. The marine ply quality and quartz countertops are top notch. Worth every rupee.',
      status: 'Approved',
      is_pinned: true,
      created_at: new Date().toISOString(),
    },
  ];

  setLocal(STORAGE_KEYS.PROJECTS, sampleProjects);
  setLocal(STORAGE_KEYS.GALLERY, sampleGallery);
  setLocal(STORAGE_KEYS.SERVICES, sampleServices);
  setLocal(STORAGE_KEYS.MATERIALS, sampleMaterials);
  setLocal(STORAGE_KEYS.REVIEWS, sampleReviews);

  notifyListeners();
};
