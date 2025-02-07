import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();

  const { user } = useAuth();
useEffect(() => {
    const fetchSchedules = async () => {
        try {
            const response = await fetch("http://higatch.mokomichi.jp:8000/api/schedules/", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();

            if (Array.isArray(data)) {  // 🔍 ここで `data` が配列か確認
                setSchedules(data);
            } else {
                console.error("取得したデータが配列ではありません:", data);
                setSchedules([]);  // ❌ データが不正な場合は空配列をセット
            }
        } catch (error) {
            console.error("予約枠の取得エラー:", error);
            setSchedules([]);  // ❌ エラーが発生した場合も空配列をセット
        }
    };

    fetchSchedules();
}, []);

useEffect(() => {
    const fetchCourses = async () => {
        try {
            const response = await fetch("http://higatch.mokomichi.jp:8000/api/courses/", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();
            console.log("取得したコースデータ:", data);  // 🔍 レスポンス確認用

            if (Array.isArray(data)) {  
                setCourses(data);  // ✅ コース一覧をセット
            } else {
                console.error("コース一覧の取得に失敗しました:", data);
                setCourses([]);  // ❌ 失敗時は空の配列をセット
            }
        } catch (error) {
            console.error("コース一覧の取得エラー:", error);
            setCourses([]);  // ❌ エラー時も空配列にする
        }
    };

    fetchCourses();
}, []);

  // 予約枠を作成
const handleCreate = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !startTime || !endTime) {
        alert("すべての項目を入力してください！");
        return;
    }

    const formattedStartTime = new Date(startTime).toISOString();
    const formattedEndTime = new Date(endTime).toISOString();

    try {
        const response = await fetch("http://higatch.mokomichi.jp:8000/api/schedules/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                course: selectedCourse,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
                teacher: user.id,
            }),
        });

        if (response.ok) {
            alert("予約枠を作成しました！");
            window.location.reload();
        } else {
            const errorData = await response.json();
            console.error("エラー詳細:", errorData);
            alert(`予約枠の作成に失敗しました: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.error("作成エラー:", error);
        alert("エラーが発生しました");
    }
};

  // 予約枠を削除
  const handleDelete = async (scheduleId) => {
    if (!window.confirm("この予約枠を削除しますか？")) return;

    try {
      const response = await fetch(`http://higatch.mokomichi.jp:8000/api/schedules/${scheduleId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        alert("予約枠を削除しました！");
        window.location.reload();
      } else {
        alert("削除に失敗しました");
      }
    } catch (error) {
      console.error("削除エラー:", error);
      alert("エラーが発生しました");
    }
  };

  return (
    <div className="container">
      <h2>予約枠管理</h2>

      {/* 予約枠の作成フォーム */}
      <form onSubmit={handleCreate}>
        <label>
          コース:
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
            <option value="">コースを選択</option>
    {Array.isArray(courses) && courses.length > 0 ? (
        courses.map((course) => (
                 <option key={course.id} value={course.id}>{course.name}</option>
              ))
          ) : (
              <option value="" disabled>コースがありません</option>
           )}
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
        <button type="submit">予約枠を追加</button>
      </form>

      {/* 予約枠一覧 */}
      <h3>予約枠一覧</h3>
      <ul>
        {schedules.length === 0 ? (
          <p>予約枠がありません</p>
        ) : (
          schedules.map((schedule) => (
            <li key={schedule.id}>
              {schedule.course_name} ({schedule.start_time} - {schedule.end_time})
              <button onClick={() => handleDelete(schedule.id)}>削除</button>
            </li>
          ))
        )}
      </ul>

      <button onClick={() => navigate("/dashboard")}>ダッシュボードへ戻る</button>
    </div>
  );
};
export default ScheduleManagement;
