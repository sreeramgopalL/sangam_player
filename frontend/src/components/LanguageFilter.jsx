import React from 'react';

const languages = [
  { id: 'all', label: 'All Languages' },
  { id: 'tamil', label: 'Tamil' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'telugu', label: 'Telugu' },
  { id: 'malayalam', label: 'Malayalam' },
  { id: 'kannada', label: 'Kannada' },
  { id: 'punjabi', label: 'Punjabi' },
  { id: 'english', label: 'English' }
];

const LanguageFilter = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onSelect(lang.id)}
          className={`px-4 py-2 rounded-full transition-all duration-300 border ${
            selected === lang.id
              ? 'bg-gradient-to-r from-gold to-yellow-500 text-burgundy-deep border-gold shadow-[0_0_10px_gold] font-semibold scale-105'
              : 'bg-burgundy-dark/50 text-beige border-beige/20 hover:border-gold/50 hover:text-gold'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageFilter;
