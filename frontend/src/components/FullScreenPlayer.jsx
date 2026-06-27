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

  const cleanName = cleanSongName(currentSong?.name);
  const { artist, singers } = parseArtistsAndSingers(currentSong?.artists);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1C0206 0%, #3B1501 40%, #4D3401 80%, #1C0206 100%)',
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
      <div className="absolute inset-0 bg-black/55" />

      {/* Card container */}
      <div className="relative z-10 w-full max-w-[420px] h-full md:h-[90vh] md:max-h-[760px] md:rounded-[40px] md:border md:border-white/10 md:bg-black/30 md:backdrop-blur-2xl md:shadow-[0_30px_100px_rgba(0,0,0,0.85)] flex flex-col justify-between p-6 overflow-hidden">
        
        {/* Top bar */}
        <div className="flex items-center justify-between pt-2 pb-4">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
          >
            <ChevronDown size={22} className="text-white" />
          </button>
          <div className="text-center">
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">Now Playing</p>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
            <ListMusic size={18} className="text-white" />
          </button>
        </div>

        {/* Album Art Container */}
        <div className="flex justify-center my-auto items-center flex-1 py-4">
          <div
            className="w-60 h-60 md:w-68 md:h-68 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300"
            style={{
              boxShadow: '0 30px 80px rgba(0,0,0,0.65), 0 0 60px rgba(212,175,55,0.15)',
            }}
          >
            <img
              src={albumArt}
              alt={cleanName}
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          </div>
        </div>

        {/* Info & Controls Area */}
        <div className="space-y-5">
          {/* Song Info + Like */}
          <div className="flex items-center justify-between">
            <div className="flex-grow min-w-0 pr-4">
              <h2 className="text-white font-bold text-xl truncate leading-tight">{cleanName}</h2>
              <p className="text-gold font-medium text-sm mt-1 truncate">{artist}</p>
              {singers && (
                <p className="text-white/50 text-xs mt-0.5 truncate">
                  Singers: <span className="text-white/70">{singers}</span>
                </p>
              )}
            </div>
            <button
              onClick={onToggleFavorite}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 flex-shrink-0 ${isFavorite ? 'bg-red-500/20' : 'bg-white/10'}`}
            >
              <Heart
                size={20}
                className={`transition-colors duration-300 ${isFavorite ? 'text-red-400 fill-red-400' : 'text-white/70'}`}
              />
            </button>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="relative h-1 bg-white/20 rounded-full mb-2">
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
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg pointer-events-none"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-white/50 text-[10px] font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-5">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all hover:bg-white/5 ${isShuffled ? 'bg-gold/20 text-gold' : 'text-white/50'}`}
            >
              <Shuffle size={18} />
            </button>

            {/* Prev */}
            <button
              onClick={onPrev}
              className="flex items-center justify-center w-12 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
            >
              <SkipBack size={20} className="text-white fill-white" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-16 h-12 rounded-xl bg-white hover:bg-white/90 active:scale-95 transition-all shadow-lg"
            >
              {isPlaying
                ? <Pause size={24} className="text-gray-900 fill-gray-900" />
                : <Play size={24} className="text-gray-900 fill-gray-900 ml-0.5" />
              }
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              className="flex items-center justify-center w-12 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
            >
              <SkipForward size={20} className="text-white fill-white" />
            </button>

            {/* Repeat */}
            <button
              onClick={() => setIsRepeating(!isRepeating)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all hover:bg-white/5 ${isRepeating ? 'bg-gold/20 text-gold' : 'text-white/50'}`}
            >
              <Repeat size={18} />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 pt-1">
            <button onClick={() => setIsMuted(!isMuted)} className="text-white/50 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className="flex-1 relative h-1 bg-white/20 rounded-full">
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
          </div>
        </div>

      </div>
    </div>
  );
};

export default FullScreenPlayer;
