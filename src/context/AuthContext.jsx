import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { userAuth, userDB } from "../firebaseUser";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for Legacy User session first (synchronous check)
    const savedLegacy = localStorage.getItem("legacyUser");
    if (savedLegacy) {
      setUser(JSON.parse(savedLegacy));
      setLoading(false);
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(userAuth, async (firebaseUser) => {
      try {
        // Load admin from localStorage
        const savedAdmin = localStorage.getItem("adminUser");
        if (savedAdmin) {
          setAdmin(JSON.parse(savedAdmin));
        }

        if (firebaseUser) {
          // Firebase User detected
          const userDoc = await getDoc(doc(userDB, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: "user",
              source: "firebase",
              displayName: `${userData.firstName} ${userData.lastName}`,
              ...userData
            });

            // 🔄 Real-time Overrides Listener
            onSnapshot(doc(userDB, 'overrides', firebaseUser.uid), (snapshot) => {
              if (snapshot.exists()) {
                setUser(prev => ({ ...prev, ...snapshot.data() }));
              }
            });

            // Clear legacy if Firebase takes over
            localStorage.removeItem("legacyUser");
          } else {
            await signOut(userAuth);
            setUser(null);
          }
        } else if (!savedLegacy) {
          // Only clear if no legacy user is active
          setUser(null);
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginAdmin = (email, password) => {
    if (email === "admin@vajra.com" && password === "Admin123") {
      const adminData = {
        name: "Mahesh Kalvakuntla",
        email,
        role: "admin",
        loginAt: new Date().toISOString(),
      };
      setAdmin(adminData);
      localStorage.setItem("adminUser", JSON.stringify(adminData));
      return true;
    }
    return false;
  };

  const loginUser = (userData) => {
    setUser(userData);
  };

  const loginLegacyUser = (userData) => {
    setUser(userData);
    localStorage.setItem("legacyUser", JSON.stringify(userData));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("adminUser");
  };

  const logoutUser = async () => {
    try {
      await signOut(userAuth);
      setUser(null);
      localStorage.removeItem("legacyUser");
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      localStorage.removeItem("legacyUser");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        user,
        loginUser,
        loginLegacyUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        isAdminLoggedIn: Boolean(admin),
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );


};

export const useAuth = () => useContext(AuthContext);
