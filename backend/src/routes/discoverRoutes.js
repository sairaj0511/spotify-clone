const express = require('express');
const router = express.Router();
const { discoverTrending, discoverSearch, discoverArtists } = require('../controllers/discoverController');

router.get('/trending', discoverTrending);
router.get('/search', discoverSearch);
router.get('/artists', discoverArtists);

module.exports = router;
