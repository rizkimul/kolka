import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Gamepad2, Award, LogOut, Sparkles, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, progress, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  // Calculate XP progress to next level
  const totalXp = progress?.totalXp || 0;
  const currentLevelXp = totalXp % 100;
  const maxExp = 100;
  const currentLevel = progress?.currentLevel || 1;
  const totalScore = progress?.totalScore || 0;
  const totalStars = progress?.totalStars || 0;

  const menuItems = [
    {
      id: 'bermain',
      icon: Gamepad2,
      title: 'Bermain',
      subtitle: 'Latihan soal dan permainan',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      route: '/bermain',
    },
    {
      id: 'kamus',
      icon: BookOpen,
      title: 'Kamus Pintar SPOK',
      subtitle: 'Belajar struktur kalimat',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      route: '/kamus',
    },
    {
      id: 'panduan',
      icon: BookOpen,
      title: 'Panduan Penggunaan',
      subtitle: 'Cara menggunakan aplikasi',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      route: '/guide',
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-[900px] mx-auto px-6 py-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600 md:w-10 md:h-10" />
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                KOLKA
              </h1>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 md:px-4 md:py-2 rounded-full md:rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
              aria-label="Keluar"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
              <span className="hidden md:inline text-sm font-medium text-gray-600">Keluar</span>
            </button>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Selamat datang, <span className="font-semibold text-purple-600">{user?.name || 'Pemain'}</span>!
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="max-w-[900px] mx-auto px-6 py-6 md:px-8 lg:px-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-center gap-4 md:gap-6 mb-4">
            <div className="text-4xl md:text-5xl">{user?.image || '🦁'}</div>
            <div className="flex-1">
              <p className="font-bold text-lg md:text-xl text-gray-800">{user?.name || 'Pemain'}</p>
              <p className="text-sm md:text-base text-gray-600">Level {currentLevel}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">{totalScore}</div>
              <div className="text-xs md:text-sm text-gray-600">Total Skor</div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-1">
              <span>XP Progress</span>
              <span>{currentLevelXp}/{maxExp}</span>
            </div>
            <div className="h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(currentLevelXp / maxExp) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Stars */}
          <div className="flex items-center gap-1 justify-center">
            <span className="text-amber-500">⭐</span>
            <span className="font-semibold text-gray-700 md:text-lg">{totalStars} Bintang</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                className={`w-full ${item.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 text-left md:text-center group hover:scale-[1.02] active:scale-[0.98]`}
              >
                {/* Mobile: Horizontal layout */}
                <div className="flex items-start gap-4 md:hidden">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                  </div>
                </div>
                {/* Desktop: Icon above text */}
                <div className="hidden md:flex flex-col items-center gap-4">
                  <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm lg:text-base text-gray-600">{item.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Yakin mau keluar?</h3>
            <p className="text-gray-600 mb-6">Kamu harus login lagi nanti untuk melanjutkan permainan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Keluar...</span>
                  </>
                ) : (
                  'Ya, Keluar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
