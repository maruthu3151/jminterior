import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastContainer } from './components/ui/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminSidebar } from './components/layout/AdminSidebar';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { MaterialsPage } from './pages/public/MaterialsPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { AppointmentPage } from './pages/public/AppointmentPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminMaterialsPage } from './pages/admin/AdminMaterialsPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-charcoal-900 text-gray-100">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Admin Protected Layout Wrapper
const ProtectedAdminLayout: React.FC = () => {
  const { session } = useAuth();

  if (!session.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-charcoal-900 text-gray-100">
      <AdminSidebar />
      <main className="flex-grow overflow-y-auto h-screen custom-scrollbar">
        <Outlet />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public Website Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/appointment" element={<AppointmentPage />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedAdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="materials" element={<AdminMaterialsPage />} />
              <Route path="appointments" element={<AdminAppointmentsPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
