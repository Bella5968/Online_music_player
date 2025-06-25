import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Relaxify 🎵</h1>

        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline">Home</Link>

          {user && (
            <>
              <Link to="/library" className="hover:underline">Library</Link>
              <Link to="/profile" className="hover:underline flex items-center gap-2">
                <img
                  src={user.photoURL || "/assets/logo.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-blue-400 object-cover"
                />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
