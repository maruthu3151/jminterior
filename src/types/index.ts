export type ProjectCategory =
  | 'Modular Kitchen'
  | 'Wardrobe'
  | 'Living Room'
  | 'Bedroom'
  | 'Commercial'
  | 'Villa'
  | 'Custom Furniture';

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'Archived';

export interface Project {
  id: string;
  title: string;
  client_name?: string;
  location?: string;
  category: ProjectCategory;
  description: string;
  wood_type?: string;
  materials?: string[];
  budget?: string;
  timeline?: string;
  status: ProjectStatus;
  cover_image: string;
  before_image?: string;
  after_image?: string;
  blueprint_url?: string;
  specifications?: Record<string, string>;
  customer_review?: string;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url?: string;
  features: string[];
  price_range?: string;
  is_published: boolean;
  created_at: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  durability: number; // 1 to 5
  finish: string;
  maintenance: 'Low' | 'Medium' | 'High';
  water_resistance: string;
  termite_resistance: string;
  cost_level: 'Standard' | 'Premium' | 'Ultra Luxury';
  is_published: boolean;
  created_at: string;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  client_name: string;
  phone: string;
  email?: string;
  address?: string;
  project_type: string;
  budget?: string;
  preferred_date: string;
  preferred_time?: string;
  message?: string;
  status: AppointmentStatus;
  admin_notes?: string;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Review {
  id: string;
  client_name: string;
  location?: string;
  project_title?: string;
  rating: number; // 1 to 5
  comment: string;
  status: ReviewStatus;
  is_pinned?: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  owner_name: string;
  tagline: string;
  phones: string[];
  email: string;
  whatsapp: string;
  address: string;
  google_maps_url: string;
  logo_url: string;
  admin_passkey: string;
  meta_title: string;
  meta_description: string;
  updated_at: string;
}

export interface DashboardStats {
  totalProjects: number;
  pendingAppointments: number;
  unreadMessages: number;
  approvedReviews: number;
  totalGallery: number;
  totalServices: number;
}

export interface AuthSession {
  isAuthenticated: boolean;
  user: {
    username: string;
    role: 'admin';
    loginTime: string;
  } | null;
}
