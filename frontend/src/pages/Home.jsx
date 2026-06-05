import React, { useState, useEffect } from 'react';
import { Play, Pause, Heart, Search, Music, User, Disc, Radio, Sliders, PlayCircle, Loader2 } from 'lucide-react';
import { useSpotify } from '../hooks/useSpotify';

const Home = ({ setCurrentSong, currentSong, setSharedPlaylist, favorites = [], toggleFavorite }) => {
  const { songs, loading, error, fetchLibrarySongs } = useSpotify();
  const [searchQuery, setSearchQuery] = useState('');
  const [activePill, setActivePill] = useState('All');
  const [categoryPills, setCategoryPills] = useState(['All']);
  const [featuredSong, setFeaturedSong] = useState(null);

  // Load songs from library on mount
  useEffect(() => {
    fetchLibrarySongs();
  }, []);

  // Process songs for filters and featured track when loaded
  useEffect(() => {
    if (songs && songs.length > 0) {
      // Find unique languages and vibes to create filter pills
      const languages = Array.from(new Set(songs.map(s => s.language).filter(Boolean)));
      const vibes = Array.from(new Set(songs.map(s => s.vibe).filter(Boolean)));
      
      // Combine them and ensure capitalized format for badges
      const pills = ['All', ...languages, ...vibes];
      setCategoryPills(pills);

      // Choose a featured song (e.g., the first song or a random one)
      setFeaturedSong(songs[0]);
    }
  }, [songs]);

  const isCloud = songs.length > 0 && songs[0].id && songs[0].id.startsWith('drive_');

  // Filter songs based on active pill and search query
  const getFilteredSongs = () => {
    return songs.filter(song => {
      // Search filter
      const matchesSearch = song.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        song.artists?.some(artist => artist.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Category pill filter
      if (activePill === 'All') return true;
      return song.language?.toLowerCase() === activePill.toLowerCase() || 
        song.vibe?.toLowerCase() === activePill.toLowerCase();
    });
  };

  const filteredSongs = getFilteredSongs();

  // Extract unique artists for "Popular Artists"
  const getPopularArtists = () => {
    const artistCounts = {};
    songs.forEach(song => {
      song.artists?.forEach(artist => {
        artistCounts[artist] = (artistCounts[artist] || 0) + 1;
      });
    });
    
    // Sort by count and get top 6
    return Object.entries(artistCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 6);
  };

  const popularArtists = getPopularArtists();

  // Helper to handle playing a song
  const handlePlaySong = (song, customPlaylist = null) => {
    if (!song) return;
    setCurrentSong(song);
    setSharedPlaylist({
      songs: customPlaylist || songs,
      description: isCloud ? 'Google Drive Library' : 'Local Music Library',
      vibeText: activePill
    });
  };

  // Get next 3 songs for the "Next in Queue" preview
  const getNextQueue = () => {
    if (!currentSong) return filteredSongs.slice(0, 3);
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) return songs.slice(0, 3);
    // Wrap around if we reach the end
    const nextSongs = [];
    for (let i = 1; i <= 3; i++) {
      const idx = (currentIndex + i) % songs.length;
      nextSongs.push(songs[idx]);
    }
    return nextSongs;
  };

  const nextQueue = getNextQueue();

  // Generate placeholder avatar urls for artists
  const getArtistAvatar = (artistName, index) => {
    const artistImages = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', // Female 1
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', // Male 1
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80', // Male 2
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', // Female 2
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80', // Male 3
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&q=80', // Female 3
    ];
    return artistImages[index % artistImages.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <Loader2 className="animate-spin text-gold" size={48} />
        <p className="text-beige/70 animate-pulse">Scanning library files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center py-12 text-red-400 bg-red-950/20 rounded-2xl border border-red-900/50 backdrop-blur-md">
          <p className="text-lg font-semibold mb-2">Error loading library</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  if (!songs || songs.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 max-w-4xl text-center">
        <div className="glass-card p-12 flex flex-col items-center">
          <Disc className="w-20 h-20 text-gold mb-6 animate-spin duration-1000" style={{ animationDuration: '6s' }} />
          <h2 className="text-3xl font-bold mb-4 text-gold glitter-text">No Songs Uploaded Yet</h2>
          <p className="text-beige-dark max-w-lg mb-8">
            Please add `.mp3` files to your local music directory or configure your Google Drive parameters in the backend environment file.
          </p>
          <div className="bg-burgundy-dark/50 p-6 rounded-xl border border-gold/10 text-left w-full max-w-md">
            <h3 className="font-semibold text-gold mb-2">Current Storage Configuration:</h3>
            <p className="text-xs text-beige/80 mb-1"><span className="font-medium text-beige">Local Path:</span> C:\Users\Sreeram gopal\Music\new songs sree</p>
            <p className="text-xs text-beige/80"><span className="font-medium text-beige">Source Mode:</span> {isCloud ? 'Cloud (Google Drive)' : 'Local Folder'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 relative z-10 max-w-[1440px]">
      
      {/* Category Pills Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide select-none mb-8">
        {categoryPills.map(pill => (
          <button
            key={pill}
            onClick={() => setActivePill(pill)}
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all duration-300 ${
              activePill === pill
                ? 'bg-gold border-gold text-burgundy-deep shadow-[0_4px_12px_rgba(212,175,55,0.25)] scale-105'
                : 'bg-burgundy-dark/30 border-white/10 text-beige hover:border-gold/50'
            }`}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Main Dashboard Area */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Section 1: Popular Uploads (Top 3 songs) */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">Popular Uploads</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {songs.slice(0, 3).map((song, index) => {
                const isCurrent = currentSong?.id === song.id;
                const albumArt = song.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80';
                return (
                  <div
                    key={`popular-${song.id}`}
                    onClick={() => handlePlaySong(song)}
                    className="glass-card p-4 hover:bg-beige-light/10 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 shadow-md">
                      <img 
                        src={albumArt} 
                        alt={song.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gold text-burgundy-deep hover:scale-110 transition-transform shadow-lg">
                          <Play fill="currentColor" size={24} className="ml-1" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white truncate group-hover:text-gold transition-colors">{song.name}</h3>
                      <p className="text-xs text-beige-dark truncate mt-1">{song.artists?.join(', ')}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-burgundy rounded-full text-gold/90 font-semibold">
                          {song.language || 'Tamil'}
                        </span>
                        {favorites.some(s => s.id === song.id) && (
                          <Heart fill="#D4AF37" className="text-gold" size={14} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Picked for you / Featured banner */}
          {featuredSong && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">Picked for you</h2>
              <div 
                className="relative rounded-2xl overflow-hidden shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center cursor-pointer group"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(107, 0, 26, 0.95) 0%, rgba(26, 0, 5, 0.95) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.15)'
                }}
                onClick={() => handlePlaySong(featuredSong)}
              >
                {/* Visual Glow */}
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-gold/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-gold/15 transition-all duration-500" />
                
                {/* Banner Artwork */}
                <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-xl overflow-hidden flex-shrink-0 shadow-lg border border-white/10">
                  <img 
                    src={featuredSong.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80'} 
                    alt={featuredSong.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="text-gold w-14 h-14" />
                  </div>
                </div>

                {/* Banner Details */}
                <div className="flex-1 text-center md:text-left space-y-3 z-10">
                  <span className="text-[10px] font-bold tracking-widest text-gold bg-gold/15 px-3 py-1 rounded-full uppercase">
                    FEATURED TRACK
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight group-hover:text-gold transition-colors">
                    {featuredSong.name}
                  </h3>
                  <p className="text-sm md:text-base text-beige-dark font-medium">
                    {featuredSong.artists?.join(', ')}
                  </p>
                  <p className="text-xs text-beige/60 max-w-lg leading-relaxed">
                    Now playing from your {isCloud ? 'Google Drive Cloud Library' : 'Local folder storage'}. This is one of the highest-rated songs in your current list.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-3 justify-center md:justify-start">
                    <button 
                      className="px-6 py-2.5 rounded-full bg-gold hover:bg-gold-light text-burgundy-deep font-bold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(featuredSong);
                      }}
                    >
                      <Play fill="currentColor" size={14} /> PLAY NOW
                    </button>
                    <button 
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(featuredSong);
                      }}
                    >
                      <Heart 
                        size={16} 
                        fill={favorites.some(s => s.id === featuredSong.id) ? '#D4AF37' : 'none'} 
                        className={favorites.some(s => s.id === featuredSong.id) ? 'text-gold' : 'text-white'}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: All Songs / Recent Table */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-wide">All Uploaded Tracks</h2>
              <span className="text-xs text-beige-dark font-semibold">
                Showing {filteredSongs.length} of {songs.length}
              </span>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-beige-dark/70">
                      <th className="py-4 px-6 w-16 text-center">#</th>
                      <th className="py-4 px-4">Title</th>
                      <th className="py-4 px-4">Language</th>
                      <th className="py-4 px-4">Vibe</th>
                      <th className="py-4 px-6 w-20 text-center">Favorite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSongs.map((song, index) => {
                      const isCurrent = currentSong?.id === song.id;
                      const albumArt = song.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80';
                      return (
                        <tr 
                          key={`row-${song.id}`}
                          onClick={() => handlePlaySong(song)}
                          className={`group border-b border-white/5 hover:bg-white/5 transition-all duration-150 cursor-pointer ${
                            isCurrent ? 'bg-gold/5' : ''
                          }`}
                        >
                          {/* Play/Index cell */}
                          <td className="py-4 px-6 text-center align-middle">
                            <span className="group-hover:hidden text-beige-dark text-sm">
                              {index + 1}
                            </span>
                            <span className="hidden group-hover:inline-block text-gold">
                              <Play size={14} fill="currentColor" />
                            </span>
                          </td>

                          {/* Song Title and Artists */}
                          <td className="py-4 px-4 align-middle">
                            <div className="flex items-center gap-3">
                              <img 
                                src={albumArt} 
                                alt={song.name} 
                                className="w-10 h-10 rounded object-cover shadow-sm flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <p className={`font-semibold text-sm truncate ${isCurrent ? 'text-gold' : 'text-white'}`}>
                                  {song.name}
                                </p>
                                <p className="text-xs text-beige-dark truncate mt-0.5">
                                  {song.artists?.join(', ')}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Language cell */}
                          <td className="py-4 px-4 align-middle">
                            <span className="text-xs text-beige-dark font-medium capitalize">
                              {song.language || 'Tamil'}
                            </span>
                          </td>

                          {/* Vibe cell */}
                          <td className="py-4 px-4 align-middle">
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-burgundy-dark/60 rounded-full text-gold/80 border border-gold/10 font-bold capitalize">
                              {song.vibe || 'Energetic'}
                            </span>
                          </td>

                          {/* Heart Action cell */}
                          <td className="py-4 px-6 text-center align-middle">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(song);
                              }}
                              className="text-beige-dark hover:text-gold transition-colors p-1"
                            >
                              <Heart 
                                size={16} 
                                fill={favorites.some(s => s.id === song.id) ? '#D4AF37' : 'none'} 
                                className={favorites.some(s => s.id === song.id) ? 'text-gold' : ''}
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Sidebar Panel */}
        <div className="lg:col-span-3 space-y-8 lg:sticky lg:top-24">
          
          {/* Search bar inside Home */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-beige-dark">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-burgundy-deep/70 border border-white/10 text-white placeholder-beige-dark/60 text-xs focus:outline-none focus:border-gold/60 transition-colors"
            />
          </div>

          {/* Popular Artists Section */}
          {popularArtists.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-md font-bold text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-2">
                Popular Artists
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {popularArtists.map((artistName, index) => (
                  <div key={artistName} className="flex flex-col items-center text-center group">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md border border-white/10 mb-2 group-hover:border-gold transition-colors">
                      <img 
                        src={getArtistAvatar(artistName, index)} 
                        alt={artistName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] text-beige truncate w-full group-hover:text-gold transition-colors">
                      {artistName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next in Queue Section */}
          <div className="glass-card p-6">
            <h2 className="text-md font-bold text-white mb-4 uppercase tracking-wider border-b border-white/10 pb-2">
              Next in Queue
            </h2>
            <div className="space-y-4">
              {nextQueue.map((song, index) => {
                const albumArt = song.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80';
                return (
                  <div 
                    key={`queue-${song.id}-${index}`}
                    onClick={() => handlePlaySong(song)}
                    className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-all"
                  >
                    <img 
                      src={albumArt} 
                      alt={song.name} 
                      className="w-10 h-10 rounded object-cover shadow-sm flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-gold transition-colors">
                        {song.name}
                      </p>
                      <p className="text-[10px] text-beige-dark truncate mt-0.5">
                        {song.artists?.join(', ')}
                      </p>
                    </div>
                    <PlayCircle className="text-white/20 group-hover:text-gold w-5 h-5 flex-shrink-0 transition-colors" />
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;
