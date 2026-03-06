const express = require('express');
const router = express.Router();
const {
  getMyPlaylists, getPublicPlaylists, getPlaylist,
  createPlaylist, updatePlaylist, deletePlaylist,
  addSongToPlaylist, removeSongFromPlaylist,
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/public', getPublicPlaylists);
router.get('/my', protect, getMyPlaylists);
router.get('/:id', getPlaylist);
router.post('/', protect, createPlaylist);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);

module.exports = router;
