import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://higatch.mokomichi.jp:8000/api/users/me/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
        alert("セッションが無効です。再度ログインしてください。");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>ダッシュボード</h2>
      <p>ようこそ, {user.nickname} さん</p>

      {user.is_teacher ? (
        <div>
          <h3>教員用メニュー</h3>
          <button onClick={() => navigate("/course-management")}>コース管理</button>
          <button onClick={() => navigate("/schedule-management")}>予約枠管理</button>
        </div>
      ) : (
        <div>
          <h3>生徒用メニュー</h3>
          <button onClick={() => navigate("/reservation")}>予約する</button>
        </div>
      )}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        ログアウト
      </button>
    </div>
  );
};


export default Dashboard;
