import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 🔹 Link を追加
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("🔄 ログインリクエスト送信...");
      const response = await axios.post("http://higatch.mokomichi.jp:8000/api/token/", {
        username,
        password,
      });

      console.log("✅ ログイン成功！", response.data); // 🔹 レスポンスを確認
      localStorage.setItem("token", response.data.access);
      navigate("/dashboard"); // ✅ ダッシュボードへ遷移
    } catch (error) {
      console.error("❌ ログイン失敗:", error.response ? error.response.data : error);
      alert("ログインに失敗しました。ユーザー名またはパスワードを確認してください");
    }
  };

  return (
    <div className="login-container">
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ユーザーネーム:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <br />
        <label>
          パスワード:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        <button type="submit">ログイン</button>
      </form>

      {/* 🔹 会員登録へのリンクを追加 */}
      <p>
        アカウントをお持ちでない方は{" "}
        <Link to="/register">会員登録</Link>
      </p>
    </div>
  );
}

export default Login;
