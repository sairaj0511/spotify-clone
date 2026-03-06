// albumRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAlbums, getAlbum, createAlbum, deleteAlbum } = require('../controllers/albumController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAlbums);
router.get('/:id', getAlbum);
router.post('/', protect, adminOnly, upload.single('cover'), createAlbum);
router.delete('/:id', protect, adminOnly, deleteAlbum);

module.exports = router;
