import React from 'react';

const AVATARS = [
  '🦁', '🐯', '🐼', '🐨', '🐸', 
  '🦊', '🐱', '🐶', '🦄', '🐲',
  '🚀', '⭐', '🤖', '👾', '🌟'
];

const AvatarPicker = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {AVATARS.map((avatar) => (
        <button
          key={avatar}
          type="button"
          onClick={() => onSelect(avatar)}
          aria-label={`Pilih avatar ${avatar}`}
          aria-pressed={selected === avatar}
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-2xl
            transition-all duration-200 relative
            ${selected === avatar 
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg scale-110 ring-2 ring-purple-400' 
              : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
            }
          `}
        >
          <span>{avatar}</span>
          {selected === avatar && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              ✓
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default AvatarPicker;
