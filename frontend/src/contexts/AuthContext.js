import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tarkista sessio sivun latautuessa
  useEffect(() => {
    refreshToken();
  }, []);

  const login = async (name, password) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include", // Lähetä ja vastaanota cookies
      body: new URLSearchParams({ name, password })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await res.json();
    setUser({ name: data.username, id: data.user_id, shareToken: data.share_token });
    setAccessToken(data.accessToken);
    return data;
  };

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}user/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setAccessToken(null);
  };

  const refreshToken = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}user/refresh`, {
        method: "POST",
        credentials: "include", // Lähetä cookie
      });

      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);

        // Dekoodaa username tokenista
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        console.log(payload);
        setUser({ name: payload.username, id: payload.user_id, shareToken: payload.share_token  });
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    accessToken,
    login,
    logout,
    refreshToken,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}