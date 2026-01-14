import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import AvatarPicker from './AvatarPicker';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      showError('Nama harus diisi ya!');
      return;
    }
    if (!formData.email) {
      showError('Email harus diisi ya!');
      return;
    }
    if (!formData.password) {
      showError('Password harus diisi ya!');
      return;
    }
    if (formData.password.length < 6) {
      showError('Password minimal 6 karakter!');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showError('Password tidak sama!');
      return;
    }
    if (!formData.avatar) {
      showError('Pilih avatar kamu dulu!');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatar,
      });
      navigate('/dashboard');
    } catch (err) {
      // Error is already shown via toast in api.js
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Daftar</h2>
      <p className="text-center text-gray-600 mb-6">Yuk kenalan! 👋</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Panggilan
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Contoh: Budi"
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="contoh@email.com"
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Minimal 6 karakter"
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Ulangi Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              placeholder="Ketik ulang password"
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pilih Karaktermu
          </label>
          <AvatarPicker 
            selected={formData.avatar}
            onSelect={(avatar) => updateField('avatar', avatar)}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !formData.name || !formData.email || !formData.password || !formData.avatar}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            'Mulai Petualangan! 🚀'
          )}
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
