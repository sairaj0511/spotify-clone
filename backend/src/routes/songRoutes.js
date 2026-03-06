const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getSongs, getSong, uploadSong, deleteSong, toggleLike, downloadSong, getTrending } = require('../controllers/songController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.get('/', getSongs);
router.get('/trending', getTrending);
router.get('/:id', getSong);
router.post('/', protect, adminOnly, upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), uploadSong);
router.delete('/:id', protect, adminOnly, deleteSong);
router.post('/:id/like', protect, toggleLike);
router.get('/:id/download', protect, downloadSong);

module.exports = router;
