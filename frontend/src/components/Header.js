import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, handleLogout } = useAuth();

  return (
    <header>
      <h1>予約システム</h1>
      <nav>
        <Link to="/dashboard">ダッシュボード</Link>
        {user && user.is_teacher && <Link to="/manage">予約管理</Link>}
        <button onClick={handleLogout}>ログアウト</button>
      </nav>
    </header>
  );
};

export default Header;
