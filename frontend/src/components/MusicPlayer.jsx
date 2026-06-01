import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import { useGlitter } from '../hooks/useGlitter';
import FullScreenPlayer from './FullScreenPlayer';

const MusicPlayer = ({ currentSong, playlist, onNext, onPrev, favorites = [], onToggleFavorite }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const audioRef = useRef(null);
  const { triggerBurst } = useGlitter();

  // Auto-play when song changes
  useEffect(() => {
    if (audioRef.current && currentSong?.audio_url) {
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      setProgress(0);
    }
  }, [currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleEnded = () => {
    setProgress(0);
    onNext();
  };

  const togglePlay = (e) => {
    e.stopPropagation();
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
      {/* Hidden audio element */}
      {currentSong.audio_url && (
        <audio
          ref={audioRef}
          src={currentSong.audio_url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      )}

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
              <p className="text-white font-semibold text-sm truncate leading-tight">{currentSong.name}</p>
              <p className="text-white/50 text-xs truncate mt-0.5">{currentSong.artists?.join(', ')}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={togglePlay}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all"
              >
                {isPlaying
                  ? <Pause size={16} className="text-white fill-white" />
                  : <Play size={16} className="text-white fill-white ml-0.5" />
                }
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
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
