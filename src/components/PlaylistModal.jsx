import React from "react";
import { useState, useEffect } from "react";
import { createPlaylist, getUserPlaylists, addTrackToPlaylist } from "../utils/playlistService";
import { useAuth } from "../context/AuthContext";
import SongItem from "../components/SongItem";

{tracks.map((track) => (
  <SongItem key={track.id} track={track} />
))}

function PlaylistModal({ isOpen, onClose, selectedTrack }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    if (user) {
      getUserPlaylists(user.uid).then(setPlaylists);
    }
  }, [user]);

  const handleCreate = async () => {
    if (newPlaylistName.trim() !== "") {
      await createPlaylist(user.uid, newPlaylistName);
      setNewPlaylistName("");
      const updated = await getUserPlaylists(user.uid);
      setPlaylists(updated);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    await addTrackToPlaylist(playlistId, selectedTrack);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-3">Save to Playlist</h2>

        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New Playlist Name"
          className="border p-2 w-full mb-2"
        />
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-1 mb-4 rounded">
          Create Playlist
        </button>

        <div className="space-y-2">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => handleAddToPlaylist(pl.id)}
              className="block w-full text-left border p-2 rounded hover:bg-blue-100"
            >
              {pl.name}
            </button>
          ))}
        </div>

        <button onClick={onClose} className="mt-4 text-sm text-gray-500">Cancel</button>
      </div>
    </div>
  );
}

export default PlaylistModal;