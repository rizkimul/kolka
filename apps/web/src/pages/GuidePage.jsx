import React from 'react';
import { ArrowLeft, BookOpen, Gamepad2, Award, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GuidePage = () => {
  const navigate = useNavigate();

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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Panduan Penggunaan</h1>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="max-w-[900px] mx-auto px-6 py-8 md:px-8 lg:px-12 space-y-6">
        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Selamat Datang di KOLKA!</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            KOLKA (Kamus Pintar SPOK) adalah aplikasi pembelajaran bahasa Indonesia yang dirancang khusus untuk membantu Anda memahami struktur kalimat SPOK dengan cara yang menyenangkan.
          </p>
        </div>

        {/* Apa itu SPOK */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Apa itu SPOK?</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Subjek</p>
                <p className="text-sm text-gray-600">Pelaku atau yang melakukan tindakan</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Predikat</p>
                <p className="text-sm text-gray-600">Tindakan atau kegiatan yang dilakukan</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Objek</p>
                <p className="text-sm text-gray-600">Yang dikenai tindakan</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Keterangan</p>
                <p className="text-sm text-gray-600">Informasi tambahan (waktu, tempat, cara)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Bermain */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Menu Bermain</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-800 mb-2">1. Melengkapi Kalimat</p>
              <p className="text-sm text-gray-600">Lengkapi kalimat dengan memilih kata yang tepat. Seret kata ke kotak yang kosong!</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-2">2. Menyusun Kalimat</p>
              <p className="text-sm text-gray-600">Susun kata-kata acak menjadi kalimat yang benar sesuai pola SPOK.</p>
            </div>
          </div>
        </div>

        {/* Tips Bermain */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Tips Bermain</h3>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="text-amber-600">✓</span>
              <span>Pelajari kamus terlebih dahulu sebelum mengerjakan soal</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">✓</span>
              <span>Perhatikan warna setiap elemen SPOK untuk memudahkan belajar</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">✓</span>
              <span>Klik ikon 🔊 untuk mendengar pengucapan kata</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">✓</span>
              <span>Seret jawaban ke kotak yang tersedia</span>
            </li>
          </ul>
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white text-center">
          <p className="font-semibold mb-2">Selamat Belajar!</p>
          <p className="text-sm opacity-90 mb-4">Semangat dalam mempelajari bahasa Indonesia</p>
          <button
            onClick={() => navigate('/level-selection')}
            className="w-full bg-white text-purple-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Mulai Bermain 🎮
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
