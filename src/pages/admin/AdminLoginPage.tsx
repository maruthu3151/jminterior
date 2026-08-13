import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ShieldCheck, Lock, User, KeyRound, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
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
      navigate('/admin');
    } else {
      setError('Invalid Admin Username or Passkey. Default Passkey: selvam123');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-charcoal-800 border border-gold-500/30 rounded-3xl p-8 shadow-gold-glow space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center shadow-gold-glow">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-100">Admin Portal Login</h2>
          <p className="text-xs text-gray-400">JM INTERIOR • Owner: K. Selvam</p>
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
              <User className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (SELVAM)"
                required
                className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Security Passkey</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter Passkey"
                required
                className="w-full bg-charcoal-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-gold-400"
              />
            </div>
            <p className="text-[11px] text-gold-400/70 mt-1">Default Passkey: <code className="bg-charcoal-900 px-1 py-0.5 rounded text-gold-400">selvam123</code></p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gold-gradient text-charcoal-900 font-bold rounded-xl shadow-gold-glow hover:brightness-110 flex items-center justify-center space-x-2 text-sm"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Admin CMS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
