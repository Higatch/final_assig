import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewCourse = () => {
  const [courseName, setCourseName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://higatch.mokomichi.jp:8000/api/courses/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: courseName }),
      });

      if (response.ok) {
        alert("コースを作成しました！");
        navigate("/course-management"); // コース管理画面に遷移
      } else {
        alert("コース作成に失敗しました");
      }
    } catch (error) {
      console.error("作成エラー:", error);
      alert("エラーが発生しました");
    }
  };

  return (
    <div className="container">
      <h2>新規コース作成</h2>
      <form onSubmit={handleSubmit}>
        <label>
          コース名:
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </label>
        <button type="submit">作成</button>
      </form>
      <button onClick={() => navigate("/course-management")}>戻る</button>
    </div>
  );
};

export default NewCourse;
