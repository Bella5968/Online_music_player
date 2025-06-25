import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, provider } from "../firebase/firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google login
  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login error:", error.message);
    }
  };

  // Email/password login
  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Email/password signup
  const signupWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loginWithEmail, signupWithEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
}