"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
  onSnapshot,
} from "firebase/firestore";

export default function Home() {
  const [status, setStatus] = useState("불러오는 중...");
  const [emoji, setEmoji] = useState("⏳");
  const [updatedAt, setUpdatedAt] = useState("");
  const [views, setViews] = useState(0);

  useEffect(() => {
    const ref = doc(db, "cafes", "main");

    // 방문자 수 증가
    const increaseViews = async () => {
      await updateDoc(ref, {
        views: increment(1),
      });
    };

    increaseViews();

    // 실시간 감지
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.data();

      if (data) {
        setStatus(data.status);
        setEmoji(data.emoji);
        setViews(data.views || 0);

        if (data.updatedAt) {
          const date = data.updatedAt.toDate();

          setUpdatedAt(
            date.toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "white",
          padding: "50px",
          borderRadius: "20px",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          width: "320px",
        }}
      >
        <h1>☕ 현재 카페 상태</h1>

        <div
          style={{
            fontSize: "80px",
            marginTop: "20px",
          }}
        >
          {emoji}
        </div>

        <h2
          style={{
            marginTop: "10px",
            fontSize: "40px",
          }}
        >
          {status}
        </h2>

        <p
          style={{
            marginTop: "30px",
            color: "gray",
            fontSize: "14px",
          }}
        >
          마지막 업데이트
          <br />
          {updatedAt}
        </p>

        <p
          style={{
            marginTop: "15px",
            color: "#666",
            fontSize: "14px",
          }}
        >
          방문자 수: {views}
        </p>
      </div>
    </main>
  );
}