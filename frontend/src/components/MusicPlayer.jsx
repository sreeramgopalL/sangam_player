import React, { useState } from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import { useGlitter } from '../hooks/useGlitter';
import FullScreenPlayer from './FullScreenPlayer';

const cleanSongName = (name) => {
  if (!name) return '';
  return name.replace(/\s*(MassTamilan|MassTamilan\.com|MassTamilan\.dev|MassTamilan\.io|MassTamilan\.fm|MassTamilan\.org|MassTamilan\.in)\b/gi, '').trim();
};

const parseArtistsAndSingers = (artistsArray) => {
  if (!artistsArray || artistsArray.length === 0) {
    return { artist: 'Unknown Artist', singers: '' };
  }
  
  let artistStr = artistsArray[0] || '';
  
  // Clean MassTamilan suffixes from artist string
  artistStr = artistStr.replace(/\s*-\s*(MassTamilan|MassTamilan\.com|MassTamilan\.dev|MassTamilan\.io|MassTamilan\.fm|MassTamilan\.org|MassTamilan\.in)\b/gi, '').trim();
  artistStr = artistStr.replace(/\s*(MassTamilan|MassTamilan\.com|MassTamilan\.dev|MassTamilan\.io|MassTamilan\.fm|MassTamilan\.org|MassTamilan\.in)\b/gi, '').trim();

  const parts = artistStr.split(',').map(p => p.trim()).filter(Boolean);
  
  if (parts.length === 0) {
    return { artist: 'Unknown Artist', singers: '' };
  }
  
  const mainArtist = parts[0];
  const singers = parts.slice(1).join(', ');
  
  return {
    artist: mainArtist,
    singers: singers
  };
};

const MusicPlayer = ({ 
  currentSong, 
  playlist, 
  onNext, 
  onPrev, 
  favorites = [], 
  onToggleFavorite,
  isPlaying,
  setIsPlaying,
  progress,
  audioRef
}) => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const { triggerBurst } = useGlitter();

  const cleanName = cleanSongName(currentSong?.name);
  const { artist, singers } = parseArtistsAndSingers(currentSong?.artists);


  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (!currentSong?.audio_url || !audioRef.current) return;
    if (e) triggerBurst(e.clientX, e.clientY);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    onNext();
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
        <div className="glass-panel rounded-2xl p-4 flex justify-center text-white/40 text-sm">
          🎵 Select a song to start playing
        </div>
      </div>
    );
  }

  const albumArt = currentSong?.album?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80';

  return (
    <>
      {/* Full Screen Player */}
      {showFullScreen && (
        <FullScreenPlayer
          currentSong={currentSong}
          onNext={onNext}
          onPrev={onPrev}
          onClose={() => setShowFullScreen(false)}
          audioRef={audioRef}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isFavorite={favorites.some(s => s.id === currentSong?.id)}
          onToggleFavorite={() => onToggleFavorite(currentSong)}
        />
      )}

      {/* Mini Player Bar - tap to expand */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3"
        onClick={() => setShowFullScreen(true)}
      >
        <div
          className="rounded-2xl overflow-hidden backdrop-blur-xl border border-white/10 cursor-pointer active:scale-[0.98] transition-transform"
          style={{ background: 'rgba(30, 6, 12, 0.88)' }}
        >
          {/* Progress bar at very top */}
          <div className="h-0.5 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-gold/70 to-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-3 px-4 py-3">
            {/* Album art */}
            <img
              src={albumArt}
              alt={currentSong.name}
              className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-lg"
            />

            {/* Song info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate leading-tight">{cleanName}</p>
              <p className="text-white/50 text-[11px] truncate mt-0.5">
                {artist} {singers ? `• ${singers}` : ''}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={togglePlay}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying
                  ? <Pause size={16} className="text-white fill-white" />
                  : <Play size={16} className="text-white fill-white ml-0.5" />
                }
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
              >
                <SkipForward size={16} className="text-white/80" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding spacer */}
      <div className="h-24" />
    </>
  );
};

export default MusicPlayer;
