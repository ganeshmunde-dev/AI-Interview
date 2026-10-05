// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { LS_KEYS } from '@/constants/appConstants';
import { mockAuthUser } from '@/data/users';
import { 
  auth, 
  googleProvider, 
  githubProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  isFirebaseConfigured 
} from '@/config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount & auto-login for demo mode
  useEffect(() => {
    const savedToken = localStorage.getItem(LS_KEYS.TOKEN);
    const savedUser  = localStorage.getItem(LS_KEYS.USER);
    const isLoggedOut = localStorage.getItem('interview_logged_out');
    const params = new URLSearchParams(window.location.search);
    const isDemoParam = params.get('demo') === 'true' || params.get('autologin') === 'true';

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem(LS_KEYS.TOKEN);
        localStorage.removeItem(LS_KEYS.USER);
      }
    } else if (isDemoParam || !isLoggedOut) {
      // Auto-authenticate with mock candidate user for seamless demo exploration
      const { token: t, user: u } = mockAuthUser;
      setToken(t);
      setUser(u);
      localStorage.setItem(LS_KEYS.TOKEN, t);
      localStorage.setItem(LS_KEYS.USER, JSON.stringify(u));
    }
    setLoading(false);
  }, []);

  /**
   * Mock login / Password Auth
   */
  const login = async (email, password) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    // Mock validation
    if (email && password) {
      const { token: t, user: u } = mockAuthUser;
      const loggedInUser = { ...u, email, name: email.split('@')[0] };
      setToken(t);
      setUser(loggedInUser);
      localStorage.setItem(LS_KEYS.TOKEN, t);
      localStorage.setItem(LS_KEYS.USER, JSON.stringify(loggedInUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  /**
   * Mock register
   */
  const register = async (name, email, password) => {
    await new Promise(r => setTimeout(r, 1000));
    if (name && email && password) {
      const newUser = { ...mockAuthUser.user, name, email };
      setToken(mockAuthUser.token);
      setUser(newUser);
      localStorage.setItem(LS_KEYS.TOKEN, mockAuthUser.token);
      localStorage.setItem(LS_KEYS.USER, JSON.stringify(newUser));
      return { success: true };
    }
    return { success: false, message: 'Registration failed' };
  };

  /**
   * Real OAuth Social Login via Firebase
   */
  const loginWithSocial = async (provider = 'Google') => {
    // If Firebase is configured with real credentials, trigger the real popup
    if (isFirebaseConfigured() && auth) {
      try {
        const authProvider = provider === 'Google' ? googleProvider : githubProvider;
        if (!authProvider) {
          throw new Error(`${provider} provider is not available.`);
        }
        const userCredential = await signInWithPopup(auth, authProvider);
        const fbUser = userCredential.user;
        const idToken = await fbUser.getIdToken();

        const realUser = {
          ...mockAuthUser.user,
          id: fbUser.uid,
          name: fbUser.displayName || (provider === 'Google' ? 'Google User' : 'GitHub Developer'),
          email: fbUser.email || `${fbUser.uid}@${provider.toLowerCase()}.com`,
          avatar: fbUser.photoURL || null,
          provider: provider.toLowerCase(),
        };

        setToken(idToken);
        setUser(realUser);
        localStorage.setItem(LS_KEYS.TOKEN, idToken);
        localStorage.setItem(LS_KEYS.USER, JSON.stringify(realUser));
        return { success: true, user: realUser };
      } catch (error) {
        console.error(`Firebase ${provider} login error:`, error);
        if (error.code === 'auth/popup-closed-by-user') {
          return { success: false, message: 'Sign-in popup was closed before completing.' };
        }
        if (error.code === 'auth/cancelled-popup-request') {
          return { success: false, message: 'Sign-in cancelled.' };
        }
        if (error.code === 'auth/account-exists-with-different-credential') {
          return { success: false, message: 'An account already exists with the same email using a different provider.' };
        }
        return { success: false, message: error.message || `${provider} login failed` };
      }
    }

    // If Firebase keys are not yet provided in .env
    return { 
      success: false, 
      needsConfig: true,
      message: `Please configure your Firebase credentials in .env to enable real ${provider} authentication.` 
    };
  };

  const logout = async () => {
    if (isFirebaseConfigured() && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error('Firebase signout error:', e);
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem(LS_KEYS.TOKEN);
    localStorage.removeItem(LS_KEYS.USER);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, loginWithSocial, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
