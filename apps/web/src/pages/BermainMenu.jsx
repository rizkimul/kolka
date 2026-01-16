import React from 'react';
import { ArrowLeft, CheckCircle, Layers, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BermainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'melengkapi',
      icon: CheckCircle,
      title: 'Melengkapi Kalimat',
      subtitle: '16 soal latihan',
      description: 'Lengkapi kalimat dengan kata yang tepat',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      route: '/game/melengkapi',
    },
    {
      id: 'menyusun',
      icon: Layers,
      title: 'Menyusun Kalimat',
      subtitle: '4 soal penyusunan',
      description: 'Susun kata-kata menjadi kalimat yang benar',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      route: '/game/menyusun',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-[900px] mx-auto px-6 py-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 md:px-4 md:py-2 rounded-full md:rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline text-sm font-medium text-gray-600">Kembali</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Menu Bermain</h1>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-[900px] mx-auto px-6 py-8 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                className={`w-full ${item.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 text-left group hover:scale-[1.02] active:scale-[0.98]`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base font-medium text-gray-700">{item.subtitle}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BermainMenu;
