import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

// Create a playlist
export async function createPlaylist(userId, name) {
  return await addDoc(collection(db, "playlists"), {
    userId,
    name,
    tracks: [],
    createdAt: new Date(),
  });
}

// Get all playlists for a user
export async function getUserPlaylists(userId) {
  const q = query(collection(db, "playlists"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Add track to a playlist
export async function addTrackToPlaylist(playlistId, track) {
  const playlistRef = doc(db, "playlists", playlistId);
  const snapshot = await getDocs(collection(db, "playlists"));
  const selected = snapshot.docs.find((doc) => doc.id === playlistId);
  const existingTracks = selected?.data().tracks || [];
  await updateDoc(playlistRef, {
    tracks: [...existingTracks, track],
  });
}

// Remove track from a playlist
export async function removeTrackFromPlaylist(playlistId, trackId) {
  const playlistRef = doc(db, "playlists", playlistId);
  const snapshot = await getDocs(collection(db, "playlists"));
  const selected = snapshot.docs.find((doc) => doc.id === playlistId);
  const existingTracks = selected?.data().tracks || [];
  const updatedTracks = existingTracks.filter((track) => track.id !== trackId);
  await updateDoc(playlistRef, {
    tracks: updatedTracks,
  });
}

// Delete a playlist
export async function deletePlaylist(playlistId) {
  await deleteDoc(doc(db, "playlists", playlistId));
}
