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
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Menu Bermain</h1>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-md mx-auto px-6 py-8 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className={`w-full ${item.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-left group hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-700">{item.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BermainMenu;
