import React, { useState } from "react";

export default function Search({ onTrackSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchSongs = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=25`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const tracks = data.results.map(track => ({
          id: track.trackId.toString(),
          title: track.trackName,
          artist: track.artistName,
          preview: track.previewUrl,
          artwork: track.artworkUrl100,
        }));
        setResults(tracks);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="mb-6">
      <form onSubmit={searchSongs} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs or artists"
          className="border p-2 rounded flex-grow text-black bg-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {results.length === 0 && !loading && (
        <p className="text-gray-600">No results yet.</p>
      )}

      <ul className="max-h-80 overflow-auto divide-y">
        {results.map(track => (
          <li
            key={track.id}
            className="py-2 flex items-center justify-between hover:bg-gray-100 cursor-pointer"
            onClick={() => onTrackSelect({
              id: track.id.toString(),
              title: track.title,
              artist: track.artist,
              preview: track.preview,
              albumArt: track.artwork
            })}
          >
            <div className="flex items-center gap-3">
              <img src={track.artwork} alt="cover" className="w-10 h-10 rounded" />
              <div>
                <p className="font-semibold">{track.title}</p>
                <p className="text-sm text-gray-600">{track.artist}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
