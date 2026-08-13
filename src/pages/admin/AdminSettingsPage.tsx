import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { updateSiteSettings, seedSampleData, clearAllData } from '../../services/db';
import { Save, RefreshCw, Trash2, KeyRound, Globe, Phone, MapPin, Building, Sparkles } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, showToast } = useData();

  const [companyName, setCompanyName] = useState<string>(settings.company_name);
  const [ownerName, setOwnerName] = useState<string>(settings.owner_name);
  const [tagline, setTagline] = useState<string>(settings.tagline);
  const [primaryPhone, setPrimaryPhone] = useState<string>(settings.phones[0] || '7358549554');
  const [secondaryPhone, setSecondaryPhone] = useState<string>(settings.phones[1] || '9342004411');
  const [email, setEmail] = useState<string>(settings.email);
  const [whatsapp, setWhatsapp] = useState<string>(settings.whatsapp);
  const [address, setAddress] = useState<string>(settings.address);
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>(settings.google_maps_url);
  const [logoUrl, setLogoUrl] = useState<string>(settings.logo_url);
  const [adminPasskey, setAdminPasskey] = useState<string>(settings.admin_passkey);
  const [metaTitle, setMetaTitle] = useState<string>(settings.meta_title);
  const [metaDescription, setMetaDescription] = useState<string>(settings.meta_description);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateSiteSettings({
        company_name: companyName.trim(),
        owner_name: ownerName.trim(),
        tagline: tagline.trim(),
        phones: [primaryPhone.trim(), secondaryPhone.trim()].filter(Boolean),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        address: address.trim(),
        google_maps_url: googleMapsUrl.trim(),
        logo_url: logoUrl.trim(),
        admin_passkey: adminPasskey.trim(),
        meta_title: metaTitle.trim(),
        meta_description: metaDescription.trim(),
      });
      showToast('Site settings updated globally!', 'success');
    } catch (e) {
      showToast('Failed to save site settings', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedData = async () => {
    if (window.confirm('Populate sample luxury woodwork projects, services, gallery photos, and reviews?')) {
      await seedSampleData();
      showToast('Sample Demo Data seeded successfully!', 'success');
    }
  };

  const handleClearData = () => {
    if (window.confirm('WARNING: Are you sure you want to clear all projects, messages, and appointments from local storage?')) {
      clearAllData();
      showToast('Database reset to empty state', 'info');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Business & System Settings"
        subtitle="Manage business details, contact information, branding, and security passkey"
      />

      <div className="px-8 max-w-4xl space-y-8">
        <form onSubmit={handleSubmit} className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl p-6 shadow-lg space-y-6">
          {/* Business Core Info */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-gray-100 text-lg border-b border-gold-500/20 pb-2 flex items-center space-x-2">
              <Building className="w-5 h-5 text-gold-400" />
              <span>Business Profile</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 pt-4 border-t border-gold-500/10">
            <h3 className="font-serif font-bold text-gray-100 text-lg border-b border-gold-500/20 pb-2 flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gold-400" />
              <span>Contact & Communication Channels</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  required
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Secondary Phone</label>
                <input
                  type="text"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Business Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">WhatsApp Number (With Country Code)</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="917358549554"
                  required
                  className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Workshop Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Google Maps URL</label>
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
              />
            </div>
          </div>

          {/* Security Passkey */}
          <div className="space-y-4 pt-4 border-t border-gold-500/10">
            <h3 className="font-serif font-bold text-gray-100 text-lg border-b border-gold-500/20 pb-2 flex items-center space-x-2">
              <KeyRound className="w-5 h-5 text-gold-400" />
              <span>Admin Security Credentials</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Admin Passkey</label>
              <input
                type="password"
                value={adminPasskey}
                onChange={(e) => setAdminPasskey(e.target.value)}
                required
                className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-sm text-gray-100"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Used to log into the Admin Management CMS with username <strong className="text-gold-400">SELVAM</strong>.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gold-500/20 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl text-xs shadow-gold-glow flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>

        {/* Utilities: Seed & Clear Data */}
        <div className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="font-serif font-bold text-gray-100 text-lg border-b border-gold-500/20 pb-2 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span>Database Maintenance Utilities</span>
          </h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSeedData}
              className="flex-1 px-5 py-3 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Populate Sample Demo Data</span>
            </button>

            <button
              onClick={handleClearData}
              className="flex-1 px-5 py-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Database to Zero State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
