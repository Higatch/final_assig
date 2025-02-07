import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ReservationEdit = () => {
  const { id } = useParams();
  const [course, setCourse] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(`http://higatch.mokomichi.jp:8000/api/reservations/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourse(response.data.course);
        setStartTime(response.data.start_time);
        setEndTime(response.data.end_time);
      } catch (error) {
        console.error("予約データの取得に失敗:", error);
      }
    };

    fetchReservation();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://higatch.mokomichi.jp:8000/api/reservations/${id}/`, {
        course: course,
        start_time: startTime,
        end_time: endTime,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      alert("予約を更新しました！");
      window.location.href = "/reservations";
    } catch (error) {
      console.error("更新に失敗:", error);
      alert("更新に失敗しました");
    }
  };

  return (
    <div>
      <h2>予約を編集</h2>
      <form onSubmit={handleUpdate}>
        <label>
          コースID:
          <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} required />
        </label>
        <label>
          開始時間:
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </label>
        <label>
          終了時間:
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </label>
        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export default ReservationEdit;
