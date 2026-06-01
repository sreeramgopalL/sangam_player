import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Heart, ChevronDown,
  Shuffle, Repeat, ListMusic
} from 'lucide-react';

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const FullScreenPlayer = ({ currentSong, onNext, onPrev, onClose, audioRef, isPlaying, setIsPlaying, isFavorite, onToggleFavorite }) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };
    const handleLoaded = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoaded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoaded);
    };
  }, [audioRef, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const albumArt = currentSong?.album?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #3C0008 0%, #6B2A00 40%, #8B5E00 80%, #3C0008 100%)',
      }}
    >
      {/* Blurred background layer */}
      <div
        className="absolute inset-0 opacity-40 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${albumArt})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-6 pt-safe">

        {/* Top bar */}
        <div className="flex items-center justify-between pt-10 pb-6">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
          >
            <ChevronDown size={22} className="text-white" />
          </button>
          <div className="text-center">
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">Now Playing</p>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <ListMusic size={18} className="text-white" />
          </button>
        </div>

        {/* Album Art */}
        <div className="flex justify-center mb-8 flex-1 items-center max-h-72">
          <div
            className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(212,175,55,0.15)',
            }}
          >
            <img
              src={albumArt}
              alt={currentSong?.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          </div>
        </div>

        {/* Song Info + Like */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex-grow min-w-0 pr-4">
            <h2 className="text-white font-bold text-xl truncate leading-tight">{currentSong?.name}</h2>
            <p className="text-white/60 text-sm mt-0.5 truncate">{currentSong?.artists?.join(', ')}</p>
          </div>
          <button
            onClick={onToggleFavorite}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isFavorite ? 'bg-red-500/20' : 'bg-white/10'}`}
          >
            <Heart
              size={20}
              className={`transition-colors duration-300 ${isFavorite ? 'text-red-400 fill-red-400' : 'text-white/70'}`}
            />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="relative h-1.5 bg-white/20 rounded-full mb-2">
            <div
              className="absolute left-0 top-0 h-full bg-white rounded-full transition-all"
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
            {/* Thumb dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg pointer-events-none"
              style={{ left: `calc(${progress}% - 7px)` }}
            />
          </div>
          <div className="flex justify-between text-white/50 text-xs">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-5 mb-6">
          {/* Shuffle */}
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isShuffled ? 'bg-gold/30 text-gold' : 'text-white/50'}`}
          >
            <Shuffle size={18} />
          </button>

          {/* Prev - pill button */}
          <button
            onClick={onPrev}
            className="flex items-center justify-center w-14 h-12 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 active:scale-95 transition-all"
          >
            <SkipBack size={22} className="text-white fill-white" />
          </button>

          {/* Play/Pause - large pill */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-20 h-14 rounded-2xl bg-white hover:bg-white/90 active:scale-95 transition-all shadow-lg"
          >
            {isPlaying
              ? <Pause size={28} className="text-gray-900 fill-gray-900" />
              : <Play size={28} className="text-gray-900 fill-gray-900 ml-1" />
            }
          </button>

          {/* Next - pill button */}
          <button
            onClick={onNext}
            className="flex items-center justify-center w-14 h-12 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 active:scale-95 transition-all"
          >
            <SkipForward size={22} className="text-white fill-white" />
          </button>

          {/* Repeat */}
          <button
            onClick={() => setIsRepeating(!isRepeating)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isRepeating ? 'bg-gold/30 text-gold' : 'text-white/50'}`}
          >
            <Repeat size={18} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setIsMuted(!isMuted)}>
            <VolumeX size={18} className="text-white/50" />
          </button>
          <div className="flex-1 relative h-1.5 bg-white/20 rounded-full">
            <div
              className="absolute left-0 top-0 h-full bg-white/70 rounded-full"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <button onClick={() => setIsMuted(false)}>
            <Volume2 size={18} className="text-white/50" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenPlayer;
