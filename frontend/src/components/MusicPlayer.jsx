import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useGlitter } from '../hooks/useGlitter';

const MusicPlayer = ({ currentSong, playlist, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const { triggerBurst } = useGlitter();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, currentSong]);

  const togglePlay = (e) => {
    if (!currentSong) return;
    
    if (e) {
      triggerBurst(e.clientX, e.clientY);
    }
    
    if (!currentSong.audio_url) {
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progressPercent);
    }
  };

  const handleEnded = () => {
    setProgress(0);
    onNext();
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !currentSong?.audio_url) return;
    const seekTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 glass-panel p-4 flex justify-center text-beige-dark/50 z-40">
        Select a vibe to start playing
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-gold/20 p-4 z-40">
      {currentSong.audio_url && (
        <audio 
          ref={audioRef} 
          src={currentSong.audio_url}
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      )}
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-burgundy-deep">
        <div 
          className="h-full bg-gradient-to-r from-gold/50 to-gold shadow-[0_0_5px_gold] transition-all"
          style={{ width: `${progress}%` }}
        />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress || 0}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Song Info */}
        <div className="flex items-center gap-4 w-1/3 min-w-0">
          <img 
            src={currentSong.album?.images?.[0]?.url || 'https://via.placeholder.com/64'} 
            alt={currentSong.name} 
            className="w-14 h-14 rounded shadow-lg object-cover"
          />
          <div className="min-w-0 truncate">
            <h4 className="font-bold text-beige truncate">{currentSong.name}</h4>
            <p className="text-sm text-beige-dark truncate">{currentSong.artists?.join(', ')}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center w-1/3">
          <div className="flex items-center gap-6">
            <button onClick={onPrev} className="text-beige hover:text-gold transition-colors">
              <SkipBack size={24} />
            </button>
            
            <button 
              onClick={togglePlay} 
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-gold to-[#B8860B] text-burgundy-deep hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)] relative"
            >
              {currentSong.audio_url ? (
                isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />
              ) : (
                <Play fill="currentColor" size={24} className="ml-1 opacity-50" />
              )}
            </button>
            
            <button onClick={onNext} className="text-beige hover:text-gold transition-colors">
              <SkipForward size={24} />
            </button>
          </div>
          {!currentSong.audio_url && (
            <span className="text-[10px] text-beige-dark mt-1 text-center">Audio unavailable.</span>
          )}
        </div>

        {/* Volume */}
        <div className="flex items-center justify-end gap-2 w-1/3">
          <button onClick={() => setIsMuted(!isMuted)} className="text-beige hover:text-gold">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 accent-gold bg-burgundy h-1 rounded-full outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
