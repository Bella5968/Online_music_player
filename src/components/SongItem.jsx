import React from "react";
import { useState } from "react";
import PlaylistModal from "./PlaylistModal";

function SongItem({ track }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex justify-between items-center py-2 border-b">
      <div>
        <p>{track.title}</p>
        <p className="text-sm text-gray-500">{track.artist.name}</p>
      </div>

      <div className="space-x-2">
        <button onClick={() => {/* add play logic here */}}>▶️</button>
        <button onClick={() => setShowModal(true)}>➕</button>
      </div>

      <PlaylistModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedTrack={{
          id: track.id,
          title: track.title,
          artist: track.artist.name,
          preview: track.preview,
        }}
      />
    </div>
  );
}

export default SongItem;