const axios = require('axios');

// @desc    Discover new/trending songs using Last.fm API
// @route   GET /api/discover/trending
const discoverTrending = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const apiKey = process.env.LASTFM_API_KEY;

    if (!apiKey) {
      return res.status(503).json({ message: 'Last.fm API key not configured' });
    }

    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'chart.gettoptracks',
        api_key: apiKey,
        format: 'json',
        limit,
        page,
      },
    });

    const tracks = response.data.tracks?.track || [];
    const songs = tracks.map((t) => ({
      title: t.name,
      artist: t.artist?.name || 'Unknown',
      plays: parseInt(t.playcount) || 0,
      listeners: parseInt(t.listeners) || 0,
      image: t.image?.[2]?.['#text'] || '',
      url: t.url,
      mbid: t.mbid,
    }));

    res.json({ songs, total: songs.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trending songs', error: err.message });
  }
};

// @desc    Search songs via Last.fm
// @route   GET /api/discover/search?q=query
const discoverSearch = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query required' });

    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) return res.status(503).json({ message: 'Last.fm API key not configured' });

    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: { method: 'track.search', track: q, api_key: apiKey, format: 'json', limit },
    });

    const tracks = response.data.results?.trackmatches?.track || [];
    const songs = tracks.map((t) => ({
      title: t.name,
      artist: t.artist,
      listeners: parseInt(t.listeners) || 0,
      image: t.image?.[2]?.['#text'] || '',
      url: t.url,
      mbid: t.mbid,
    }));

    res.json({ songs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to search songs', error: err.message });
  }
};

// @desc    Get top artists via Last.fm
// @route   GET /api/discover/artists
const discoverArtists = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) return res.status(503).json({ message: 'Last.fm API key not configured' });

    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: { method: 'chart.gettopartists', api_key: apiKey, format: 'json', limit },
    });

    const artists = (response.data.artists?.artist || []).map((a) => ({
      name: a.name,
      listeners: parseInt(a.listeners) || 0,
      image: a.image?.[2]?.['#text'] || '',
      url: a.url,
    }));

    res.json({ artists });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch artists', error: err.message });
  }
};

module.exports = { discoverTrending, discoverSearch, discoverArtists };
