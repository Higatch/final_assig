import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 トークンがある場合にユーザー情報を取得
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://higatch.mokomichi.jp:8000/api/users/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("セッションエラー:", error);
        handleLogout();
      }
    };

    fetchUserData();
  }, [token]);

  // 🔹 ログイン処理
  const login = async (username, password) => {
    try {
      const response = await axios.post("http://higatch.mokomichi.jp:8000/api/token/", {
        username,
        password,
      });

      const newToken = response.data.access;
      localStorage.setItem("token", newToken);
      setToken(newToken);

      const userResponse = await axios.get("http://higatch.mokomichi.jp:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${newToken}` },
      });

      setUser(userResponse.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("ログインエラー:", error);
      alert("ログインに失敗しました。ユーザー名またはパスワードを確認してください。");
    }
  };

  // 🔹 ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
