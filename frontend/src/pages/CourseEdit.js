import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function CourseEdit() {
  const { id } = useParams(); // URL からコースIDを取得
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // 既存のコースデータを取得
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://higatch.mokomichi.jp:8000/api/courses/${id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setName(response.data.name);
        setDescription(response.data.description);
      } catch (error) {
        console.error("コース情報の取得エラー:", error);
      }
    };
    fetchCourse();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://higatch.mokomichi.jp:8000/api/courses/${id}/`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("コースが更新されました！");
      navigate("/course-management");
    } catch (error) {
      console.error("コース更新エラー:", error.response);
      alert("更新に失敗しました");
    }
  };

  return (
    <div className="course-edit-container">
      <h2>コース編集</h2>
      <form onSubmit={handleSubmit}>
        <label>
          コース名:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          説明:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <button type="submit">保存</button>
        <button type="button" onClick={() => navigate("/course-management")}>
          キャンセル
        </button>
      </form>
    </div>
  );
}

export default CourseEdit;
