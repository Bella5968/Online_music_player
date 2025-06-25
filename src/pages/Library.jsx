import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserPlaylists, createPlaylist, deletePlaylist } from "../utils/playlistService";
import Player from "../components/Player";
import Search from "./Search";

export default function Library() {
  const { user, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    if (user) {
      getUserPlaylists(user.uid).then(async (pls) => {
        // If user has no playlists, create a default one with default songs
        if (pls.length === 0) {
          const defaultTracks = [
            {
              id: "1",
              title: "Chill Vibes",
              artist: "Lo-Fi Artist",
              preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              albumArt: "/assets/logo.png"
            },
            {
              id: "2",
              title: "Morning Sun",
              artist: "Acoustic Band",
              preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
              albumArt: "/assets/logo.png"
            },
            {
              id: "3",
              title: "Night Drive",
              artist: "Synthwave",
              preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
              albumArt: "/assets/logo.png"
            }
          ];
          const docRef = await createPlaylist(user.uid, "My Playlist");
          await import("../utils/playlistService").then(({ addTrackToPlaylist }) => {
            defaultTracks.forEach(track => addTrackToPlaylist(docRef.id, track));
          });
          const newPlaylist = {
            id: docRef.id,
            name: "My Playlist",
            tracks: defaultTracks
          };
          setPlaylists([newPlaylist]);
          setSelectedPlaylist(newPlaylist);
        } else {
          setPlaylists(pls);
          if (pls.length > 0) setSelectedPlaylist(pls[0]);
        }
      });
    } else {
      setPlaylists([]);
      setSelectedPlaylist(null);
      setCurrentTrack(null);
    }
  }, [user]);

  const handleCreate = async () => {
    console.log("Create playlist clicked, user:", user);
    if (!newPlaylistName.trim()) {
      alert("Please enter a playlist name");
      return;
    }
    if (!user?.uid) {
      alert("User not authenticated");
      return;
    }

    try {
      const docRef = await createPlaylist(user.uid, newPlaylistName);
      console.log("Playlist created with id:", docRef.id);

      const newPlaylist = {
        id: docRef.id,
        name: newPlaylistName,
        tracks: [],
      };
      setPlaylists((prev) => [...prev, newPlaylist]);
      setSelectedPlaylist(newPlaylist);
      setNewPlaylistName("");
    } catch (error) {
      console.error("Failed to create playlist:", error);
      alert("Could not create playlist. See console for details.");
    }
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);

    if (!selectedPlaylist) {
      alert("Select a playlist first");
      return;
    }

    // Avoid duplicate track additions
    const isAlreadyAdded = selectedPlaylist.tracks?.some((t) => t.id === track.id);
    if (isAlreadyAdded) return;

    const updated = {
      ...selectedPlaylist,
      tracks: [...(selectedPlaylist.tracks || []), track],
    };

    setSelectedPlaylist(updated);
    setPlaylists((pls) =>
      pls.map((pl) => (pl.id === selectedPlaylist.id ? updated : pl))
    );
  };

  return (
    <div
      className="min-h-screen w-full p-0 m-0 bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/assets/BG-2.jpg')" }}
    >
      <div className="flex justify-between items-center mb-6 p-6">
        <h1 className="text-2xl font-bold">🎵 Welcome, {user?.email}</h1>
        {/* Removed page-level logout button */}
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="New Playlist Name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Playlist
        </button>
      </div>

      <div className="flex gap-8">
        <div className="w-1/3 border-r pr-4 max-h-[500px] overflow-y-auto">
          {playlists.length === 0 && <p className="text-gray-800">You have no playlists yet.</p>}
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className={`p-2 cursor-pointer rounded flex items-center justify-between ${
                selectedPlaylist?.id === pl.id ? "bg-blue-200" : "hover:bg-gray-100"
              }`}
            >
              <span
                onClick={() => {
                  setSelectedPlaylist(pl);
                  setCurrentTrack(null);
                }}
                className="flex-1 cursor-pointer text-gray-900 font-semibold"
              >
                {pl.name}
              </span>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (window.confirm("Delete this playlist?")) {
                    await deletePlaylist(pl.id);
                    setPlaylists((prev) => prev.filter((p) => p.id !== pl.id));
                    if (selectedPlaylist?.id === pl.id) {
                      setSelectedPlaylist(null);
                      setCurrentTrack(null);
                    }
                  }
                }}
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-xs"
                title="Delete Playlist"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="w-2/3 pl-4">
          <Search onTrackSelect={handleTrackSelect} />

          {!selectedPlaylist ? (
            <p className="text-gray-600 mt-4">Select a playlist to see its tracks</p>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">{selectedPlaylist.name}</h2>
              {selectedPlaylist.tracks?.length === 0 ? (
                <p>No tracks in this playlist.</p>
              ) : (
                <ul>
                  {selectedPlaylist.tracks.map((track, i) => (
                    <li
                      key={track.id + i}
                      className="py-2 border-b cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                      onClick={() => setCurrentTrack(track)}
                    >
                      <span>{track.title} - {track.artist}</span>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          // Remove track from playlist in Firestore
                          await import("../utils/playlistService").then(({ removeTrackFromPlaylist }) => removeTrackFromPlaylist(selectedPlaylist.id, track.id));
                          // Update UI
                          setPlaylists((pls) => pls.map((playlist) =>
                            playlist.id === selectedPlaylist.id
                              ? { ...playlist, tracks: playlist.tracks.filter((t) => t.id !== track.id) }
                              : playlist
                          ));
                          if (currentTrack?.id === track.id) setCurrentTrack(null);
                        }}
                        className="ml-2 px-2 py-1 bg-red-400 text-white rounded hover:bg-red-700 text-xs"
                        title="Remove Track"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {currentTrack && (
            <Player track={currentTrack} trackList={selectedPlaylist?.tracks || []} />
          )}
        </div>
      </div>
    </div>
  );
}
