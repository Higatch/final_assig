import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Reservation = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [reservations, setReservations] = useState([]);

  // 🔹 予約可能なコース一覧を取得
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://higatch.mokomichi.jp:8000/api/courses/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("コース一覧の取得に失敗しました:", error);
      }
    };

    fetchCourses();
  }, [token]);

  // 🔹 選択したコースの予約枠を取得
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`http://higatch.mokomichi.jp:8000/api/schedules/?course=${selectedCourse}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(response.data);
      } catch (error) {
        console.error("予約枠の取得に失敗しました:", error);
      }
    };

    fetchSchedules();
  }, [selectedCourse, token]);

  // 🔹 ユーザーの予約一覧を取得
useEffect(() => {
    axios.get("http://higatch.mokomichi.jp:8000/api/reservations/", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
        console.log("📌 取得した予約一覧:", response.data);
        setReservations(response.data);
    })
    .catch((error) => {
        console.error("❌ 予約一覧の取得エラー:", error.response ? error.response.data : error);
    });

    // スケジュールの詳細を取得
    axios.get("http://higatch.mokomichi.jp:8000/api/schedules/", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
        console.log("📌 取得したスケジュール一覧:", response.data);
        setSchedules(response.data);
    })
    .catch((error) => {
        console.error("❌ スケジュール一覧の取得エラー:", error.response ? error.response.data : error);
    });
}, []);

  // 🔹 予約を送信
const handleReserve = async (e) => {
    e.preventDefault();

    if (!selectedSchedule) {
        alert("予約枠を選択してください。");
        return;
    }

    try {
        const response = await axios.post(
            "http://higatch.mokomichi.jp:8000/api/reservations/",
            { student: user.id, schedule: selectedSchedule },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ 予約成功:", response.data);
        alert("予約が確定しました！");
        setReservations([...reservations, response.data]);  // 予約一覧に追加
    } catch (error) {
        console.error("❌ 予約エラー:", error.response ? error.response.data : error);
        alert(`予約に失敗しました: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    }
};

  // 🔹 予約をキャンセル
  const handleCancel = async (id) => {
    if (!window.confirm("この予約をキャンセルしますか？")) return;

    try {
      await axios.delete(`http://higatch.mokomichi.jp:8000/api/reservations/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("予約をキャンセルしました！");
      setReservations(reservations.filter((res) => res.id !== id));
    } catch (error) {
      console.error("キャンセルに失敗しました:", error);
      alert("予約のキャンセルに失敗しました。");
    }
  };

  return (
    <div className="container">
      <h2>予約システム</h2>

      {/* 🔹 予約フォーム */}
      <form onSubmit={handleReserve}>
        <label>
          コースを選択:
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
            <option value="">-- コースを選択 --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </label>

        <label>
          予約枠を選択:
          <select value={selectedSchedule} onChange={(e) => setSelectedSchedule(e.target.value)} required>
            <option value="">-- 予約枠を選択 --</option>
            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.start_time} - {schedule.end_time}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">予約する</button>
      </form>

      {/* 🔹 予約済みの一覧 */}
      <h3>予約一覧</h3>
      <h3>予約一覧</h3>
      <ul>

        {reservations.length === 0 ? (
        <p>予約がありません</p>
        ) : (
          reservations.map((reservation) => {
            const schedule = schedules.find((s) => s.id === reservation.schedule);
            return (
              <li key={reservation.id}>
                {schedule
                  ? `${schedule.course_name} (${schedule.start_time} - ${schedule.end_time})`
                   : "スケジュール情報がありません"} 
                <button onClick={() => handleCancel(reservation.id)}>キャンセル</button>
              </li>
            );
          })
        )}
      </ul>
      <button onClick={() => navigate("/dashboard")}>ダッシュボードへ戻る</button>
    </div>
  );
};

export default Reservation;
