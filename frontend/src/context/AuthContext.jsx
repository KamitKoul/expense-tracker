import { createContext, useState, useEffect } from "react";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      API.get("/users/me")
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken("");
          setUser(null);
          setLoading(false);
        });
    } else {
        setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post("/users/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await API.post("/users", { name, email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
