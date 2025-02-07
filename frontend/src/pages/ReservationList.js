import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);

  // 予約データを取得
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://higatch.mokomichi.jp:8000/api/reservations/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReservations(response.data);
      } catch (error) {
        console.error("予約データの取得に失敗:", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <h2>予約一覧</h2>
      <button onClick={() => window.location.href = "/reservations/new"}>予約を追加</button>
      <ul>
        {reservations.map((res) => (
          <li key={res.id}>
            {res.start_time} - {res.end_time} (コースID: {res.course}) 
            <button onClick={() => window.location.href = `/reservations/edit/${res.id}`}>編集</button>
            <button onClick={() => handleDelete(res.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 予約を削除する関数
const handleDelete = async (id) => {
  if (window.confirm("本当にこの予約を削除しますか？")) {
    try {
      await axios.delete(`http://higatch.mokomichi.jp:8000/api/reservations/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("予約を削除しました！");
      window.location.reload(); // ページをリロード
    } catch (error) {
      console.error("削除に失敗:", error);
      alert("予約の削除に失敗しました");
    }
  }
};

export default ReservationList;
