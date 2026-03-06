const User = require('../models/User');
const Song = require('../models/Song');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');

// @desc    Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalSongs, totalAlbums, totalPlaylists, topSongs, recentUsers] =
      await Promise.all([
        User.countDocuments(),
        Song.countDocuments(),
        Album.countDocuments(),
        Playlist.countDocuments(),
        Song.find().sort({ plays: -1 }).limit(5),
        User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
      ]);
    res.json({ totalUsers, totalSongs, totalAlbums, totalPlaylists, topSongs, recentUsers });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc    Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc    Update user role
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, { role: req.body.role }, { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc    Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getDashboardStats, getAllUsers, updateUserRole, deleteUser };
