import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import here

export default function Home() {
  const { user, login, logout, loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate(); // ✅ 2. Define here INSIDE component

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password);
      }
      navigate("/library"); // ✅ 3. Redirect after success
    } catch (err) {
      alert("Authentication failed: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await login();
      navigate("/library"); // ✅ Google login redirect
    } catch (err) {
      console.error("Google login error:", err.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('/assets/BG-1.jpg')` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          <img
            src="/assets/logo.png"
            alt="Relaxify Logo"
            className="inline-block w-20 h-20 align-middle mr-2"
          />
          Relaxify
        </h1>

        {user ? (
          <>
            <p className="mb-4 text-gray-700">
              Welcome,{" "}
              <strong>{user.email || user.displayName}</strong>
            </p>
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {mode === "login" ? "Login" : "Sign Up"}
              </button>
            </form>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-2 mb-4 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Sign in with Google
            </button>

            <p className="text-sm text-gray-600">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                className="ml-1 text-blue-600 underline"
                onClick={() =>
                  setMode(mode === "login" ? "signup" : "login")
                }
              >
                {mode === "login" ? "Sign Up" : "Login"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
