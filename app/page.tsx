"use client";

import { useEffect, useState } from "react";

import {
  doc,
  onSnapshot,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export default function Home() {
  const [status, setStatus] = useState("불러오는 중...");
  const [emoji, setEmoji] = useState("⏳");
  const [views, setViews] = useState(0);
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    const ref = doc(db, "cafes", "main");

    // 방문자 수 증가
    const increaseViews = async () => {
      try {
        await updateDoc(ref, {
          views: increment(1),
        });
      } catch (error) {
        console.log(error);
      }
    };

    increaseViews();

    // 실시간 데이터 감지
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.data();

      if (data) {
        setStatus(data.status || "정보 없음");
        setEmoji(data.emoji || "❓");
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
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center w-[350px]">

        <h1 className="text-4xl font-bold mb-8">
          ☕ 현재 카페 상태
        </h1>

        <div className="text-8xl mb-4">
          {emoji}
        </div>

        <div className="text-5xl font-bold mb-8">
          {status}
        </div>

        <div className="text-gray-500 text-sm mb-1">
          마지막 업데이트
        </div>

        <div className="text-sm mb-6">
          {updatedAt}
        </div>

        <div className="text-gray-500 text-sm mb-1">
          방문자 수
        </div>

        <div className="text-2xl font-bold">
          {views}
        </div>

      </div>
    </main>
  );
}