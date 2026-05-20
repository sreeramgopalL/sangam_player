import React, { useState, useEffect } from 'react';
import LanguageFilter from '../components/LanguageFilter';
import PlaylistPanel from '../components/PlaylistPanel';
import { useSpotify } from '../hooks/useSpotify';
import { Loader2 } from 'lucide-react';

const Library = ({ setCurrentSong }) => {
  const [selectedLang, setSelectedLang] = useState('all');
  const { songs, loading, error, fetchSongsByLanguage } = useSpotify();

  useEffect(() => {
    fetchSongsByLanguage(selectedLang);
    // eslint-disable-next-line
  }, [selectedLang]);

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 glitter-text">Music Library</h1>
        <p className="text-beige-dark">Explore hits across all languages</p>
      </div>

      <LanguageFilter selected={selectedLang} onSelect={setSelectedLang} />

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-gold" size={48} />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-400 bg-red-900/20 rounded-xl border border-red-900/50">
          <p>Error loading songs: {error}</p>
        </div>
      ) : (
        <PlaylistPanel 
          songs={songs} 
          onPlaySong={setCurrentSong} 
          title={`${selectedLang === 'all' ? 'All' : selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1)} Hits`} 
        />
      )}
    </div>
  );
};

export default Library;
