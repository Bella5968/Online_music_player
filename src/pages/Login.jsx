import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";

export default function Login() {
  const { login, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await login(); // Google sign-in
      navigate("/library");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      navigate("/library");
    } catch (err) {
      alert("Email sign-in failed: " + err.message);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUpWithEmail(email, password);
      navigate("/library");
    } catch (err) {
      alert("Sign up failed: " + err.message);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin} className="m-4 px-4 py-2 bg-green-600 text-gray-900 font-semibold">
        Login with Google
      </button>
      <form className="m-4 flex flex-col gap-2" onSubmit={handleEmailSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 text-gray-900"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 text-gray-900"
        />
        <button type="submit" className="bg-blue-600 text-gray-900 font-semibold px-4 py-2">Sign In</button>
        <button type="button" onClick={handleEmailSignUp} className="bg-gray-600 text-gray-900 font-semibold px-4 py-2">
          Sign Up
        </button>
      </form>
    </div>
  );
}

