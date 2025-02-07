import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("パスワードが一致しません");
      return;
    }

    try {
      const response = await axios.post("http://higatch.mokomichi.jp:8000/api/users/", {
        username,
        password,
        password_confirm: passwordConfirm,
        nickname,
        is_teacher: isTeacher,
      });

      alert("登録成功！ログインしてください");
      navigate("/login"); // 成功後にログイン画面へリダイレクト
    } catch (error) {
      console.error("登録エラー:", error.response?.data || error);
      alert("登録に失敗しました");
    }
  };

  return (
    <div className="register-container">
      <h2>会員登録</h2>
      <form onSubmit={handleSubmit}>
        <label>ユーザー名:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <br/>
        <label>ニックネーム:
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        </label>
        <br/>
        <label>パスワード:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br/>
        <label>パスワード確認:
          <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
        </label>
        <br/>
        <label>
          <input type="checkbox" checked={isTeacher} onChange={() => setIsTeacher(!isTeacher)} />
          教師として登録する
        </label>
        <br/>
        <button type="submit">登録</button>
      </form>
    </div>
  );
};

export default Register;
