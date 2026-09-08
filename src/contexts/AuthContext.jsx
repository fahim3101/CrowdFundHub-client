import { createContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();
const API_URL = import.meta.env.VITE_API_URL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [credits, setCredits] = useState(0);
  // loading stays true until Firebase tells us the auth state,
  // this is what stops a hard-reload on a private route from bouncing to /login
  const [loading, setLoading] = useState(true);

  const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const updateUserProfile = (profile) => updateProfile(auth.currentUser, profile);
  const logOut = () => {
    localStorage.removeItem('access-token');
    return signOut(auth);
  };

  // After Firebase confirms who's logged in, fetch our own JWT + role/credits
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;

      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const tokenRes = await axios.post(`${API_URL}/jwt`, { email: currentUser.email });
          const token = tokenRes.data.token;
          localStorage.setItem('access-token', token);

          // Fetch role from DB. A 404 just means the user record hasn't been
          // created yet (Register.jsx or Google sign-in flow handles that).
          // We must NOT auto-create a record here with a hardcoded role,
          // because that races with the explicit registration flow and
          // can overwrite a freshly-created creator with 'supporter'.
          let roleRes;
          try {
            roleRes = await axios.get(`${API_URL}/users/role/${currentUser.email}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (roleErr) {
            if (roleErr.response?.status === 404) {
              // Brand-new Firebase login — DB row not written yet.
              if (isMounted) setLoading(false);
              return;
            }
            throw roleErr;
          }

          if (isMounted) {
            setRole(roleRes.data.role);
            setCredits(roleRes.data.credits);
          }
        } catch (err) {
          // Keep existing role/credits on error to prevent refresh loop
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
      } else {
        localStorage.removeItem('access-token');
        if (isMounted) {
          setRole(null);
          setCredits(0);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const refreshCredits = async () => {
    if (!user?.email) return;
    const token = localStorage.getItem('access-token');
    try {
      const res = await axios.get(`${API_URL}/users/role/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredits(res.data.credits);
    } catch {
      // silent: navbar keeps old value
    }
  };

  // Re-fetch the user's role from the DB. Call this after explicit
  // user-record creation (e.g. after Register.jsx POSTs to /users) to make
  // sure the context reflects the freshly-written role.
  const refreshRole = async (targetEmail) => {
    const email = targetEmail || user?.email;
    if (!email) return;
    const token = localStorage.getItem('access-token');
    try {
      const res = await axios.get(`${API_URL}/users/role/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.role);
      setCredits(res.data.credits);
    } catch (err) {
      if (err.response?.status !== 404) {
        // silent except real errors
      }
    }
  };

  const authInfo = {
    user,
    role,
    credits,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    updateUserProfile,
    logOut,
    refreshCredits,
    refreshRole,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
