import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Volume2 } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';

const spokData = {
  S: {
    title: 'Subjek',
    color: 'red',
    bgColor: 'bg-red-500',
    hoverBg: 'hover:bg-red-600',
    textColor: 'text-red-600',
    lightBg: 'bg-red-50',
    borderColor: 'border-red-500',
    description: 'Subjek adalah pelaku atau yang melakukan tindakan dalam kalimat.',
    examples: [
      { parts: [{ text: 'Ibu', type: 'S' }, { text: 'memasak', type: 'P' }, { text: 'sayur', type: 'O' }, { text: 'di dapur', type: 'K' }] },
      { parts: [{ text: 'Anak-anak', type: 'S' }, { text: 'bermain', type: 'P' }, { text: 'bola', type: 'O' }] },
      { parts: [{ text: 'Kucing', type: 'S' }, { text: 'tidur', type: 'P' }, { text: 'di sofa', type: 'K' }] },
    ],
  },
  P: {
    title: 'Predikat',
    color: 'yellow',
    bgColor: 'bg-yellow-500',
    hoverBg: 'hover:bg-yellow-600',
    textColor: 'text-yellow-600',
    lightBg: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    description: 'Predikat adalah kata kerja atau tindakan yang dilakukan oleh subjek.',
    examples: [
      { parts: [{ text: 'Ibu', type: 'S' }, { text: 'memasak', type: 'P' }, { text: 'sayur', type: 'O' }, { text: 'di dapur', type: 'K' }] },
      { parts: [{ text: 'Anak-anak', type: 'S' }, { text: 'bermain', type: 'P' }, { text: 'bola', type: 'O' }] },
      { parts: [{ text: 'Kucing', type: 'S' }, { text: 'tidur', type: 'P' }, { text: 'di sofa', type: 'K' }] },
    ],
  },
  O: {
    title: 'Objek',
    color: 'blue',
    bgColor: 'bg-blue-500',
    hoverBg: 'hover:bg-blue-600',
    textColor: 'text-blue-600',
    lightBg: 'bg-blue-50',
    borderColor: 'border-blue-500',
    description: 'Objek adalah sesuatu yang dikenai tindakan dari subjek.',
    examples: [
      { parts: [{ text: 'Ibu', type: 'S' }, { text: 'memasak', type: 'P' }, { text: 'sayur', type: 'O' }] },
      { parts: [{ text: 'Anak-anak', type: 'S' }, { text: 'bermain', type: 'P' }, { text: 'bola', type: 'O' }] },
      { parts: [{ text: 'Adik', type: 'S' }, { text: 'membaca', type: 'P' }, { text: 'buku', type: 'O' }] },
    ],
  },
  K: {
    title: 'Keterangan',
    color: 'green',
    bgColor: 'bg-green-500',
    hoverBg: 'hover:bg-green-600',
    textColor: 'text-green-600',
    lightBg: 'bg-green-50',
    borderColor: 'border-green-500',
    description: 'Keterangan adalah informasi tambahan (waktu, tempat, cara).',
    examples: [
      { parts: [{ text: 'Ibu', type: 'S' }, { text: 'memasak', type: 'P' }, { text: 'di dapur', type: 'K' }] },
      { parts: [{ text: 'Ayah', type: 'S' }, { text: 'pergi', type: 'P' }, { text: 'pagi hari', type: 'K' }] },
      { parts: [{ text: 'Adik', type: 'S' }, { text: 'menulis', type: 'P' }, { text: 'dengan pensil', type: 'K' }] },
    ],
  },
};


const exampleSentences = [
  {
    sentence: [
      { text: 'Ayah', type: 'S' },
      { text: 'membaca', type: 'P' },
      { text: 'koran', type: 'O' },
      { text: 'di teras', type: 'K' },
    ],
  },
  {
    sentence: [
      { text: 'Adik', type: 'S' },
      { text: 'minum', type: 'P' },
      { text: 'susu', type: 'O' },
      { text: 'setiap pagi', type: 'K' },
    ],
  },
  {
    sentence: [
      { text: 'Kakak', type: 'S' },
      { text: 'menulis', type: 'P' },
      { text: 'surat', type: 'O' },
      { text: 'dengan rapi', type: 'K' },
    ],
  },
];

const getColorClass = (type) => {
  const colors = {
    S: 'bg-red-500',
    P: 'bg-yellow-500',
    O: 'bg-blue-500',
    K: 'bg-green-500',
  };
  return colors[type];
};

const KamusPage = () => {
  const navigate = useNavigate();
  const { speak } = useTTS();
  const [selectedElement, setSelectedElement] = useState(null);

  const handleSelectElement = (element) => {
    setSelectedElement(element);
    speak(spokData[element].title);
  };

  const handleSpeakExample = (sentence) => {
    speak(sentence);
  };

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
            <h1 className="text-2xl font-bold text-gray-800">Kamus Pintar SPOK</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-8 space-y-6">
        {/* SPOK Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {['S', 'P', 'O', 'K'].map((element) => (
            <button
              key={element}
              onClick={() => handleSelectElement(element)}
              className={`${spokData[element].bgColor} ${spokData[element].hoverBg} rounded-2xl shadow-lg p-8 text-center transition-all hover:scale-105 active:scale-95`}
            >
              <div className="text-5xl font-bold text-white mb-2">{element}</div>
              <div className="text-white font-semibold">{spokData[element].title}</div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedElement && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className={`${spokData[selectedElement].bgColor} px-6 py-4 flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">{spokData[selectedElement].title}</h2>
                <button
                  onClick={() => speak(spokData[selectedElement].title)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <Volume2 className="w-5 h-5 text-white" />
                </button>
              </div>
              <button
                onClick={() => setSelectedElement(null)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Description */}
            <div className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {spokData[selectedElement].description}
              </p>

              {/* Examples */}
              <div className={`${spokData[selectedElement].lightBg} rounded-xl p-4`}>
                <p className={`text-sm font-semibold ${spokData[selectedElement].textColor} mb-3`}>
                  Contoh:
                </p>
                <ul className="space-y-3">
                  {spokData[selectedElement].examples.map((example, index) => {
                    const fullSentence = example.parts.map(p => p.text).join(' ');
                    return (
                      <li key={index} className="flex items-center justify-between">
                        <span className="flex flex-wrap gap-1 items-center">
                          {example.parts.map((part, partIndex) => (
                            <span 
                              key={partIndex}
                              className={`${
                                part.type === selectedElement 
                                  ? `font-bold ${spokData[selectedElement].textColor}` 
                                  : 'text-gray-700'
                              }`}
                            >
                              {part.text}
                            </span>
                          ))}
                        </span>
                        <button
                          onClick={() => handleSpeakExample(fullSentence)}
                          className="p-1 rounded-full hover:bg-gray-200 flex-shrink-0 ml-2"
                        >
                          <Volume2 size={16} className={spokData[selectedElement].textColor} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Example Sentences Section */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Contoh Kalimat SPOK</h3>
          <div className="space-y-4">
            {exampleSentences.map((example, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm opacity-90">Kalimat {index + 1}:</p>
                  <button
                    onClick={() => handleSpeakExample(example.sentence.map(w => w.text).join(' '))}
                    className="p-1 rounded-full hover:bg-white/20"
                  >
                    <Volume2 size={16} className="text-white" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 items-end">
                  {example.sentence.map((word, wordIndex) => (
                    <div key={wordIndex} className="flex flex-col items-center gap-1">
                      <span className={`${getColorClass(word.type)} px-2 py-1 rounded text-xs font-bold`}>
                        {word.type}
                      </span>
                      <span className="text-white font-semibold text-base">
                        {word.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Menu Button */}
        <button
          onClick={() => navigate('/bermain')}
          className="w-full bg-white text-purple-600 font-semibold py-4 rounded-xl shadow-md hover:bg-gray-50 transition-colors"
        >
          Mulai Bermain 🎮
        </button>
      </div>
    </div>
  );
};

export default KamusPage;
