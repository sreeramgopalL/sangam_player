import { useState, useEffect } from 'react';

export const useSpotify = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSongsByLanguage = async (language = 'all') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/songs?language=${language}`);
      const data = await response.json();
      setSongs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePlaylist = async (text, languagePreference = 'all') => {
    setLoading(true);
    try {
      const response = await fetch('/api/playlist/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, languagePreference }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchDriveSongs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/drive-songs');
      if (!response.ok) {
        throw new Error('Failed to fetch songs from Google Drive');
      }
      const data = await response.json();
      setSongs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { songs, loading, error, fetchSongsByLanguage, generatePlaylist, fetchDriveSongs };
};
