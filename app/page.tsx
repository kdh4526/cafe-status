"use client";

import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  updateDoc,
  increment,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export default function Home() {
  const [status, setStatus] = useState("불러오는 중...");
  const [emoji, setEmoji] = useState("⏳");
  const [views, setViews] = useState(0);
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    const ref = doc(db, "cafes", "main");

    const setupViews = async () => {
      const snapshot = await getDoc(ref);

      // views 없으면 생성
      if (!snapshot.exists()) {
        await setDoc(ref, {
          views: 0,
        });
      }

      const data = snapshot.data();

      if (data && data.views === undefined) {
        await setDoc(
          ref,
          {
            views: 0,
          },
          { merge: true }
        );
      }

      // 방문자 수 증가
      await updateDoc(ref, {
        views: increment(1),
      });
    };

    setupViews();

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center w-[350px]">

        <h1 className="text-4xl font-bold mb-8">
          ☕ 현재 카페 상태
        </h1>

        <div className="text-8xl mb-4">
          {emoji}
        </div>

        <p className="text-5xl font-bold mb-8">
          {status}
        </p>

        <div className="text-gray-500 text-sm mb-3">
          마지막 업데이트
        </div>

        <div className="text-sm mb-6">
          {updatedAt}
        </div>

        <div className="text-gray-500 text-sm">
          방문자 수
        </div>

        <div className="text-2xl font-bold">
          {views}
        </div>

      </div>
    </main>
  );
}