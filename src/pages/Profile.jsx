import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  // Placeholder for update logic
  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage("Profile update feature coming soon!");
  };

  return (
    <div className="max-w-md mx-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile Settings</h2>
      <div className="flex flex-col items-center mb-4">
        <img
          src={user?.photoURL || "/assets/logo.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-blue-400 mb-2 object-cover"
        />
        <div className="text-lg font-semibold">{user?.email}</div>
      </div>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-gray-700">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full border p-2 rounded"
            disabled
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            disabled
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled
        >
          Update Profile
        </button>
      </form>
      {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
    </div>
  );
}
