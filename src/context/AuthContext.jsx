import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedAdmin = localStorage.getItem("adminUser");
      const savedUser = localStorage.getItem("user");

      if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (err) {
      console.error("Session restore failed", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
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
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("adminUser");
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        user,
        loginUser,
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
