import React, { useState, useEffect } from 'react';
import LanguageFilter from '../components/LanguageFilter';
import PlaylistPanel from '../components/PlaylistPanel';
import { useSpotify } from '../hooks/useSpotify';
import { Loader2, Cloud, Music } from 'lucide-react';

const Library = ({ setCurrentSong }) => {
  const [viewSource, setViewSource] = useState('drive'); // Default to drive
  const [selectedLang, setSelectedLang] = useState('all');
  const { songs, loading, error, fetchSongsByLanguage, fetchDriveSongs } = useSpotify();

  useEffect(() => {
    if (viewSource === 'drive') {
      fetchDriveSongs();
    } else {
      fetchSongsByLanguage(selectedLang);
    }
    // eslint-disable-next-line
  }, [selectedLang, viewSource]);

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 glitter-text">Music Library</h1>
        <p className="text-beige-dark">Explore hits across all sources</p>

        {/* Source Toggle */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setViewSource('drive')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 font-medium ${
              viewSource === 'drive'
                ? 'bg-gold border-gold text-burgundy-deep shadow-lg shadow-gold/20'
                : 'bg-burgundy-deep/30 border-gold/30 text-beige hover:border-gold/60'
            }`}
          >
            <Cloud size={18} />
            Google Drive (Full Songs)
          </button>
          <button
            onClick={() => setViewSource('local')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 font-medium ${
              viewSource === 'local'
                ? 'bg-gold border-gold text-burgundy-deep shadow-lg shadow-gold/20'
                : 'bg-burgundy-deep/30 border-gold/30 text-beige hover:border-gold/60'
            }`}
          >
            <Music size={18} />
            Spotify Previews
          </button>
        </div>
      </div>

      {viewSource === 'local' && (
        <LanguageFilter selected={selectedLang} onSelect={setSelectedLang} />
      )}

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
          title={
            viewSource === 'drive'
              ? 'Google Drive Playlist'
              : `${selectedLang === 'all' ? 'All' : selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1)} Hits`
          } 
        />
      )}
    </div>
  );
};

export default Library;
