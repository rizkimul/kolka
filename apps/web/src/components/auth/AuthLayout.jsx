import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex flex-col items-center justify-center p-6">
      {/* Logo KOLKA */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Sparkles className="w-10 h-10 text-purple-600" />
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            KOLKA
          </h1>
          <Sparkles className="w-10 h-10 text-pink-600" />
        </div>
        <p className="text-lg font-semibold text-gray-700">Kamus Pintar SPOK</p>
        <p className="text-sm text-gray-600">Belajar Bahasa Indonesia dengan Mudah</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        {children}
      </div>
      
      {/* Toggle Link */}
      <div className="mt-6 text-center">
        {isLogin ? (
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-purple-600 font-semibold hover:text-purple-700">
              Daftar sekarang
            </Link>
          </p>
        ) : (
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-700">
              Masuk di sini
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
