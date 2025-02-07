import React, { useState, useEffect } from "react";
import axios from "axios";

const ReservationForm = () => {
  const [course, setCourse] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [courses, setCourses] = useState([]); // 既存のコース一覧

  useEffect(() => {
    // 既存のコースを取得
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://higatch.mokomichi.jp:8000/api/courses/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("コース一覧の取得に失敗:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://higatch.mokomichi.jp:8000/api/schedules/",
        {
          course: course,
          start_time: startTime,
          end_time: endTime,
          teacher: localStorage.getItem("user_id"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("予約追加成功:", response.data);
      alert("予約を追加しました！");
      window.location.href = "/reservations"; // 予約一覧にリダイレクト
    } catch (error) {
      console.error("予約追加エラー:", error.response ? error.response.data : error);
      alert("予約の追加に失敗しました");
    }
  };

  return (
    <div>
      <h2>予約を追加</h2>
      <form onSubmit={handleSubmit}>
        <label>
          コースを選択:
          <select value={course} onChange={(e) => setCourse(e.target.value)} required>
            <option value="">コースを選択</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          開始時間:
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </label>
        <label>
          終了時間:
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </label>
        <button type="submit">追加</button>
      </form>
    </div>
  );
};

export default ReservationForm;
