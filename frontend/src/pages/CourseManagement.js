import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // コース一覧を取得
const handleDelete = async (courseId) => {
  if (!window.confirm("このコースを削除しますか？")) {
    return;
  }

  try {
    const response = await fetch(`http://higatch.mokomichi.jp:8000/api/courses/${courseId}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      alert("コースを削除しました！");
      setCourses(courses.filter((course) => course.id !== courseId));
    } else {
      alert("削除に失敗しました");
    }
  } catch (error) {
    console.error("削除エラー:", error);
    alert("エラーが発生しました");
  }
};


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://higatch.mokomichi.jp:8000/api/courses/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("コース取得エラー:", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="course-management-container">
      <h2>コース管理</h2>
      <button onClick={() => navigate("/dashboard")}>ダッシュボードに戻る</button>

      <h3>登録済みコース</h3>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
              {course.name}
              <button onClick={() => handleDelete(course.id)}>削除</button>
          </li>
        ))}
      </ul>
      
      <button onClick={() => navigate("/course/new")}>新しいコースを作成</button>
    </div>
  );
}

export default CourseManagement;
