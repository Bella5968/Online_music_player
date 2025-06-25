import React, { useRef, useState, useEffect } from "react";

function Player({ track, trackList = [] }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  // Set index from passed track
  useEffect(() => {
    if (trackList.length > 0 && track) {
      const index = trackList.findIndex(t => t.id === track.id);
      if (index !== -1) setCurrentIndex(index);
    }
  }, [track, trackList]);

  useEffect(() => {
    if (audioRef.current && trackList[currentIndex]?.preview) {
      audioRef.current.pause();
      audioRef.current.load();
      if (playing) audioRef.current.play();
    }
  }, [currentIndex, trackList, playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const timeUpdate = () => setCurrentTime(audio.currentTime);
    const loaded = () => setDuration(audio.duration || 0);
    const ended = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else if (shuffle) {
        handleShuffle();
      } else {
        skipForward();
      }
    };
    audio.addEventListener("timeupdate", timeUpdate);
    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("ended", ended);
    return () => {
      audio.removeEventListener("timeupdate", timeUpdate);
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("ended", ended);
    };
  }, [playing, repeat, shuffle, currentIndex, trackList]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        skipForward();
      } else if (e.code === "ArrowLeft") {
        skipBackward();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  useEffect(() => {
    if (track && track.preview) {
      setPlaying(true); // Auto-play when a new track is selected
    }
  }, [track]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const skipForward = () => {
    if (shuffle) {
      handleShuffle();
      return;
    }
    if (currentIndex < trackList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPlaying(true);
    } else if (repeat) {
      setCurrentIndex(0);
      setPlaying(true);
    }
  };

  const skipBackward = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPlaying(true);
    } else if (repeat) {
      setCurrentIndex(trackList.length - 1);
      setPlaying(true);
    }
  };

  const handleShuffle = () => {
    if (trackList.length > 1) {
      let next;
      do {
        next = Math.floor(Math.random() * trackList.length);
      } while (next === currentIndex);
      setCurrentIndex(next);
      setPlaying(true);
    }
  };

  const forward10 = () => {
    audioRef.current.currentTime += 10;
  };

  const rewind10 = () => {
    audioRef.current.currentTime -= 10;
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolume = (e) => {
    const vol = e.target.value;
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  const currentTrack = trackList[currentIndex];
  const prevTrack = trackList[currentIndex - 1] || null;
  const nextTrack = trackList[currentIndex + 1] || null;

  const formatTime = (t) => {
    if (isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="mt-6 border-t pt-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 max-w-xl mx-auto">
      {currentTrack && (
        <div className="mb-4 flex flex-col items-center">
          <div className="relative mb-2">
            <div className="absolute -inset-2 blur-xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-40 rounded-full"></div>
            <img
              src={currentTrack.albumArt || '/assets/logo.png'}
              alt="Album Art"
              className="w-40 h-40 rounded-2xl object-cover border-4 border-gray-700 shadow-lg relative z-10"
            />
          </div>
          <div className="text-2xl font-bold text-white drop-shadow mb-1">🎧 {currentTrack.title}</div>
          <div className="text-lg text-blue-200 mb-2">{currentTrack.artist}</div>
          <div className="text-xs text-gray-400">
            {prevTrack && <span>Prev: {prevTrack.title} &nbsp;|&nbsp;</span>}
            {nextTrack && <span>Next: {nextTrack.title}</span>}
          </div>
        </div>
      )}
      <audio
        ref={audioRef}
        controls={false}
        className="w-full"
        src={currentTrack?.preview}
        onLoadedMetadata={e => setDuration(e.target.duration)}
        onTimeUpdate={e => setCurrentTime(e.target.currentTime)}
        onVolumeChange={e => setVolume(e.target.volume)}
      />
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-gray-300 font-mono">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (currentTime / duration) * 100 : 0}
          onChange={handleSeek}
          className="w-full accent-pink-500 bg-gray-700 rounded-lg h-2"
        />
        <span className="text-xs text-gray-300 font-mono">{formatTime(duration)}</span>
      </div>
      <div className="flex gap-3 mt-6 justify-center items-center">
        <button onClick={() => setShuffle(!shuffle)} className={`px-3 py-2 rounded-full shadow-none ${shuffle ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"} hover:scale-110 transition-transform`} title="Shuffle">🔀</button>
        <button onClick={rewind10} className="bg-gray-700 text-gray-200 px-3 py-2 rounded-full shadow-none hover:scale-110 transition-transform">⏪</button>
        <button onClick={skipBackward} className="bg-gray-700 text-gray-200 px-3 py-2 rounded-full shadow-none hover:scale-110 transition-transform">⏮</button>
        <button onClick={togglePlay} className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-lg text-xl font-bold hover:scale-110 transition-transform shadow-none">
          {playing ? "⏸" : "▶️"}
        </button>
        <button onClick={skipForward} className="bg-gray-700 text-gray-200 px-3 py-2 rounded-full shadow-none hover:scale-110 transition-transform">⏭</button>
        <button onClick={forward10} className="bg-gray-700 text-gray-200 px-3 py-2 rounded-full shadow-none hover:scale-110 transition-transform">⏩</button>
        <button onClick={() => setRepeat(!repeat)} className={`px-3 py-2 rounded-full shadow-none ${repeat ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"} hover:scale-110 transition-transform`} title="Repeat">🔁</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          className="w-20 accent-blue-400 ml-2"
        />
        <span className="text-xs text-gray-300">🔊</span>
      </div>
      <div className="text-xs text-gray-400 mt-4 text-center">
        <span>Space: Play/Pause &nbsp;|&nbsp; ←/→: Prev/Next</span>
      </div>
    </div>
  );
}

export default Player;
