# 🎵 Spotify Clone — MERN Stack

A full-featured Spotify clone built with **MongoDB, Express, React, Node.js** in a monorepo structure.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎵 Music Player | Play/pause, seek, volume, shuffle, repeat (none/all/one) |
| 🔐 Auth | Register/Login with JWT, role-based (user/admin) |
| ❤️ Liked Songs | Like/unlike songs, view all liked songs |
| ⬇️ Downloads | Download songs directly from the player |
| 📂 Playlists | Create, manage, add/remove songs |
| 💿 Albums | Browse albums, view tracks |
| 🌍 Discover | Trending songs & artists via Last.fm API |
| 🛡️ Admin Panel | Upload songs/albums, manage users, view stats |

---

## 📁 Project Structure

```
spotify-clone/
├── backend/
│   ├── src/
│   │   ├── config/       # DB + Cloudinary setup
│   │   ├── controllers/  # Auth, Songs, Albums, Playlists, Admin, Discover
│   │   ├── middleware/   # JWT auth middleware
│   │   ├── models/       # User, Song, Album, Playlist schemas
│   │   └── routes/       # All API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/   # Sidebar, Topbar, Layout
│   │   │   └── player/   # Player, SongCard, AlbumCard
│   │   ├── context/      # AuthContext, PlayerContext
│   │   ├── pages/        # All page components
│   │   └── utils/        # Axios API utility
│   └── package.json
└── package.json          # Root (concurrently)
```

---

## 🚀 Setup & Installation

### 1. Clone / navigate to the project
```bash
cd spotify-clone
```

### 2. Install all dependencies
```bash
npm run install-all
```

### 3. Configure environment variables

Copy the example and fill in your values:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/spotify-clone   # or MongoDB Atlas URI
JWT_SECRET=your_super_secret_key_here

# Cloudinary (free account at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Last.fm API key (free at last.fm/api)
LASTFM_API_KEY=your_lastfm_api_key
```

### 4. Run in development
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🔧 Setting Up External Services

### MongoDB
- **Local**: Install MongoDB locally — URI: `mongodb://localhost:27017/spotify-clone`
- **Cloud (recommended)**: Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)

### Cloudinary (for song/image uploads)
1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud name, API Key, API Secret

### Last.fm API (for Discover page)
1. Register at [last.fm/api](https://www.last.fm/api/account/create)
2. Create an API application → copy API Key

---

## 🔑 Admin Access

To make yourself admin:
1. Register a normal account
2. Connect to MongoDB and update the user:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```
3. Or use the Admin Panel → Users tab to promote any user

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get profile (protected)

### Songs
- `GET /api/songs` — Get all songs (query: `search`, `genre`, `limit`, `page`)
- `GET /api/songs/trending` — Top songs by plays
- `GET /api/songs/:id` — Get single song + increment plays
- `POST /api/songs` — Upload song (Admin, multipart)
- `DELETE /api/songs/:id` — Delete song (Admin)
- `POST /api/songs/:id/like` — Toggle like
- `GET /api/songs/:id/download` — Get download URL

### Albums
- `GET /api/albums` — All albums
- `GET /api/albums/:id` — Single album with songs
- `POST /api/albums` — Create album (Admin)
- `DELETE /api/albums/:id` — Delete album (Admin)

### Playlists
- `GET /api/playlists/my` — My playlists
- `POST /api/playlists` — Create playlist
- `PUT /api/playlists/:id` — Update playlist
- `DELETE /api/playlists/:id` — Delete playlist
- `POST /api/playlists/:id/songs` — Add song
- `DELETE /api/playlists/:id/songs/:songId` — Remove song

### Admin
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/users` — All users
- `PUT /api/admin/users/:id/role` — Change user role
- `DELETE /api/admin/users/:id` — Delete user

### Discover
- `GET /api/discover/trending` — Last.fm trending tracks
- `GET /api/discover/search?q=query` — Search Last.fm
- `GET /api/discover/artists` — Top artists

---

## 🛠️ Tech Stack

**Frontend**: React 18, React Router v6, Tailwind CSS, Axios, React Toastify, React Icons  
**Backend**: Node.js, Express, Mongoose, JWT, Bcrypt, Multer, Cloudinary SDK  
**Database**: MongoDB  
**Media Storage**: Cloudinary  
**External API**: Last.fm (song discovery)

---

## 📝 Notes

- Songs are stored on **Cloudinary** (audio + images)
- All audio streams directly from Cloudinary URL
- Download works by returning the Cloudinary URL to the client
- The Discover page shows Last.fm metadata only — actual playback comes from your uploaded songs
