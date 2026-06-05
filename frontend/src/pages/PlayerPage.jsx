import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Star, 
  MoreHorizontal, 
  Shuffle, 
  Repeat, 
  ArrowLeft 
} from 'lucide-react';

// Client-side timed lyrics mapping for premium visuals
const getLyricsForSong = (songName) => {
  const name = (songName || '').toLowerCase();
  
  if (name.includes('aagasa') || name.includes('veeran')) {
    return [
      { time: 0, text: "♫ (Santhosh Narayanan Beats Intro) ♫", translation: "Instrumental Intro" },
      { time: 8, text: "ஆகாச வீரன் நெஞ்சில்...", translation: "The sky warrior's heart..." },
      { time: 15, text: "பூமி அதிரும் வேகம் கொண்டு வந்தானே...", translation: "He came with the speed that shakes the earth..." },
      { time: 25, text: "காற்றின் திசையை மாற்றிடும் அவனது விசை...", translation: "His force changes the direction of the wind..." },
      { time: 35, text: "நெஞ்சில் ஒரு துணிவோடு...", translation: "With courage in his chest..." },
      { time: 45, text: "ஆகாச வீரன் எழுகிறான்!", translation: "The sky warrior rises!" },
      { time: 55, text: "♫ (Chorus Instrumental Interlude) ♫", translation: "Instrumental Interlude" },
      { time: 68, text: "யாரும் தடுத்திட முடியாது...", translation: "No one can stop him..." },
      { time: 78, text: "பாதை முழுதும் வெற்றி முரசு கொட்டுதே...", translation: "The drum of victory beats all along the path..." },
      { time: 90, text: "♫ (Outro Beat Fade) ♫", translation: "Outro" }
    ];
  }

  if (name.includes('aariraro')) {
    return [
      { time: 0, text: "♫ (Soothing Flute Intro) ♫", translation: "Lullaby Theme" },
      { time: 10, text: "ஆரிராரோ ஆரிராரோ...", translation: "Aariraro Aariraro..." },
      { time: 20, text: "தாயின் மடியில் நீயும் தூங்குவாயோ...", translation: "Will you sleep in your mother's lap..." },
      { time: 32, text: "கவலைகள் எல்லாம் மறந்து போகுமே...", translation: "All worries will fade away..." },
      { time: 45, text: "உன் முகம் பார்க்கும் போதிலே...", translation: "When looking at your face..." },
      { time: 58, text: "ஆரிராரோ ஆரிராரோ...", translation: "Aariraro Aariraro..." },
      { time: 70, text: "♫ (Violin Instrumental) ♫", translation: "Violin Interlude" },
      { time: 85, text: "விண்மீன்கள் உன்னை காவல் காக்குமே...", translation: "The stars will guard you..." },
      { time: 98, text: "நிம்மதியான உறக்கம் கொள்ளடி...", translation: "Have a peaceful sleep..." },
      { time: 110, text: "♫ (Flute Outro) ♫", translation: "Outro" }
    ];
  }

  // Default synced lyric lines
  return [
    { time: 0, text: "♫ (Intro Instrumental) ♫", translation: "Let the sound wash over you" },
    { time: 10, text: "Every breath I take feels like a dream", translation: "ஒவ்வொரு மூச்சும் கனவாகவே தெரிகிறது" },
    { time: 20, text: "Walking under the stars, just you and me", translation: "நட்சத்திரங்களின் கீழ், நீயும் நானும் மட்டும்" },
    { time: 30, text: "Let the music play and heal our souls", translation: "இசை ஒலிக்கட்டும், நம் ஆன்மாவை குணப்படுத்தட்டும்" },
    { time: 42, text: "With you, I feel complete and whole", translation: "உன்னுடன் இருந்தால் நான் முழுமையாக உணர்கிறேன்" },
    { time: 55, text: "♫ (Instrumental Solo) ♫", translation: "Guitar and keyboard interlude" },
    { time: 70, text: "Hold my hand, we will fly so high", translation: "என் கையைப் பிடி, நாம் உயரமாகப் பறப்போம்" },
    { time: 82, text: "Beyond the clouds, into the open sky", translation: "மேகங்களுக்கு அப்பால், திறந்த வானத்தில்" },
    { time: 95, text: "♫ (Bridge Instrumental) ♫", translation: "Feel the drums rising" },
    { time: 110, text: "No more doubts and no more fears", translation: "இனி சந்தேகங்களும் இல்லை, பயமும் இல்லை" },
    { time: 122, text: "We will laugh away all the tears", translation: "அனைத்து கண்ணீரையும் சிரித்து மறப்போம்" },
    { time: 135, text: "♫ (Chorus Repeat) ♫", translation: "Theme chorus" },
    { time: 150, text: "♫ (Soft Outro Fade) ♫", translation: "Music fading out..." }
  ];
};

const PlayerPage = ({ 
  sharedPlaylist, 
  setCurrentSong, 
  currentSong,
  isPlaying,
  setIsPlaying,
  progress,
  currentTime,
  duration,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  audioRef,
  onNext,
  onPrev,
  favorites = [],
  toggleFavorite
}) => {
  const navigate = useNavigate();
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const lyricsContainerRef = useRef(null);

  // If no song is loaded but we have a playlist, auto-load the first song
  useEffect(() => {
    if (!currentSong && sharedPlaylist?.songs?.length > 0) {
      setCurrentSong(sharedPlaylist.songs[0]);
    }
  }, [currentSong, sharedPlaylist, setCurrentSong]);

  // Back navigation if no playlist and no song active
  useEffect(() => {
    if ((!sharedPlaylist || sharedPlaylist.songs.length === 0) && !currentSong) {
      navigate('/');
    }
  }, [sharedPlaylist, currentSong, navigate]);

  const activeLyrics = getLyricsForSong(currentSong?.name);

  // Find active lyric line index based on current playback time
  const activeLyricIndex = activeLyrics.reduce((acc, curr, idx) => {
    if (currentTime >= curr.time) return idx;
    return acc;
  }, 0);

  // Auto-scroll active lyric line into center view
  useEffect(() => {
    const activeEl = lyricsContainerRef.current?.querySelector(`[data-lyric-idx="${activeLyricIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeLyricIndex]);

  if (!currentSong) return null;

  const albumArt = currentSong?.album?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80';

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercentage = clickX / width;
    audioRef.current.currentTime = newPercentage * duration;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  const handleVolumeChange = (e) => {
    if (!audioRef.current) return;
    const val = parseFloat(e.target.value);
    audioRef.current.volume = val;
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    const targetMute = !isMuted;
    audioRef.current.muted = targetMute;
    setIsMuted(targetMute);
  };

  const isFavorite = favorites.some(s => s.id === currentSong.id);

  return (
    <div className="relative min-h-[90vh] w-full flex items-center justify-center py-10 px-4 md:px-10 overflow-hidden">
      
      {/* Dynamic blurred mesh gradient backing matching album art color tones */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 blur-[130px] opacity-[0.28] scale-125"
        style={{
          backgroundImage: `url(${albumArt})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />
      <div className="absolute inset-0 z-0 bg-[#0F0205]/75 backdrop-blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col gap-6">
        
        {/* Top bar header */}
        <div className="flex justify-between items-center px-2">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center border border-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-white/40 uppercase tracking-widest text-[10px] font-semibold">
            Now Playing
          </span>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Player controls & art */}
          <div className="flex flex-col">
            
            {/* Album artwork frame */}
            <div className="w-full max-w-sm aspect-square mx-auto rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.65)] border border-white/10 hover:scale-[1.01] transition-transform duration-500 relative group">
              <img 
                src={albumArt} 
                alt={currentSong.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Song Meta Info */}
            <div className="mt-8 flex justify-between items-center max-w-sm w-full mx-auto px-1">
              <div className="min-w-0 flex-1 pr-4">
                <h2 className="text-2xl font-bold text-white tracking-wide truncate">{currentSong.name}</h2>
                <p className="text-white/50 text-sm font-medium mt-1 truncate">{currentSong.artists?.join(', ')}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleFavorite(currentSong)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    isFavorite 
                      ? 'bg-gold/15 border-gold/40 text-gold' 
                      : 'bg-white/5 border-white/5 text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Star size={18} className={isFavorite ? "fill-gold" : ""} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center border border-white/5 transition-all cursor-pointer">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Timings & Progress Seeker */}
            <div className="mt-6 max-w-sm w-full mx-auto">
              <div 
                className="w-full h-1 bg-white/10 hover:h-1.5 rounded-full overflow-hidden relative cursor-pointer transition-all"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-gradient-to-r from-gold to-white rounded-full relative"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-[11px] text-white/45 font-semibold font-mono tracking-wider">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration ? duration - currentTime : 0)}</span>
              </div>
            </div>

            {/* Player Buttons */}
            <div className="mt-6 flex justify-between items-center max-w-sm w-full mx-auto px-4">
              <button 
                onClick={() => setIsShuffle(!isShuffle)}
                className={`transition-colors cursor-pointer ${isShuffle ? 'text-gold' : 'text-white/35 hover:text-white'}`}
              >
                <Shuffle size={18} />
              </button>
              
              <button 
                onClick={onPrev}
                className="text-white/80 hover:text-white active:scale-90 transition-transform cursor-pointer"
              >
                <SkipBack size={28} className="fill-white/10" />
              </button>

              <button 
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-burgundy-deep flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause size={24} className="fill-burgundy-deep text-burgundy-deep" /> : <Play size={24} className="fill-burgundy-deep text-burgundy-deep ml-1" />}
              </button>

              <button 
                onClick={onNext}
                className="text-white/80 hover:text-white active:scale-90 transition-transform cursor-pointer"
              >
                <SkipForward size={28} className="fill-white/10" />
              </button>

              <button 
                onClick={() => setIsRepeat(!isRepeat)}
                className={`transition-colors cursor-pointer ${isRepeat ? 'text-gold' : 'text-white/35 hover:text-white'}`}
              >
                <Repeat size={18} />
              </button>
            </div>

            {/* Volume Seeker */}
            <div className="mt-8 flex items-center gap-3 max-w-sm w-full mx-auto px-1">
              <button 
                onClick={handleMuteToggle}
                className="text-white/45 hover:text-white cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-white/15 hover:bg-white/20 rounded-full appearance-none cursor-pointer accent-gold outline-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-gold"
              />
              <Volume2 size={16} className="text-white/45" />
            </div>

          </div>

          {/* Right Column: Apple Music style dynamic lyrics view */}
          <div className="w-full h-[400px] lg:h-[500px] flex flex-col relative">
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#0F0205] to-transparent pointer-events-none z-10" />
            
            <div 
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto no-scrollbar scroll-smooth space-y-8 py-10 px-2 relative mask-gradient"
            >
              {activeLyrics.map((line, idx) => {
                const isActive = idx === activeLyricIndex;
                return (
                  <div 
                    key={idx}
                    data-lyric-idx={idx}
                    className={`transition-all duration-500 origin-left ${
                      isActive 
                        ? 'text-white text-2xl font-bold opacity-100 scale-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                        : 'text-white/25 text-xl font-semibold opacity-40 scale-95 blur-[0.5px]'
                    }`}
                  >
                    <p className="leading-relaxed">{line.text}</p>
                    {isActive && line.translation && (
                      <p className="text-gold/85 text-sm font-semibold tracking-wide mt-1.5 animate-pulse uppercase">
                        {line.translation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0F0205] to-transparent pointer-events-none z-10" />
          </div>

        </div>

      </div>
    </div>
  );
};

export default PlayerPage;
