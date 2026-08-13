import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ShieldCheck, Lock, User, KeyRound, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const { settings, showToast } = useData();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('SELVAM');
  const [passkey, setPasskey] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(username, passkey, settings.admin_passkey);
    if (success) {
      showToast('Admin Authentication Successful!', 'success');
      onClose();
      navigate('/admin');
    } else {
      setError('Invalid Admin Username or Passkey. Default Passkey: selvam123');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center pb-4 border-b border-gold-500/20 mb-6">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center shadow-gold-glow">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-gray-100">Admin Authentication</h3>
        <p className="text-xs text-gray-400 mt-1">JM INTERIOR Management Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Admin Username</label>
          <div className="relative">
            <User className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username (SELVAM)"
              required
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400 shadow-inner"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Admin Security Passkey</label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter Admin Passkey"
              required
              className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400 shadow-inner"
            />
          </div>
          <p className="text-[11px] text-gold-400/70 mt-1">Default Passkey: <code className="bg-charcoal-900 px-1 py-0.5 rounded text-gold-400 font-mono">selvam123</code></p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gold-gradient text-charcoal-900 font-bold rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 mt-4"
        >
          <Lock className="w-4 h-4" />
          <span>Authenticate & Open Admin CMS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </Modal>
  );
};
