"use client";

import { useEffect, useState } from "react";

import {
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../lib/firebase";

export default function AdminPage() {

  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const updateStatus = async (
    status: string,
    emoji: string
  ) => {

    try {

      const ref = doc(db, "cafes", "main");

      await updateDoc(ref, {
        status,
        emoji,
        updatedAt: new Date(),
      });

      alert("저장 성공!");

    } catch (error) {

      console.log(error);
      alert("에러 발생!");

    }
  };

  // 방문자 수 불러오기
  useEffect(() => {

    const viewsRef = doc(db, "stats", "views");

    const unsubscribe = onSnapshot(
      viewsRef,
      (snapshot) => {

        const data = snapshot.data();

        if (data) {

          setTodayCount(data.todayCount ?? 0);
          setTotalCount(data.totalCount ?? 0);

        }
      }
    );

    return () => unsubscribe();

  }, []);

  // 오늘 방문자 초기화
  const resetTodayViews = async () => {

    const viewsRef = doc(db, "stats", "views");

    await updateDoc(viewsRef, {
      todayCount: 0,
    });

    alert("오늘 방문자 초기화 완료");

  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">

      <h1 className="text-5xl font-bold mb-10">
        관리자 페이지
      </h1>

      <div className="flex gap-4 mb-10">

        <button
          onClick={() =>
            updateStatus("여유", "🟢")
          }
          className="bg-green-500 text-white px-6 py-3 rounded-xl text-2xl"
        >
          여유
        </button>

        <button
          onClick={() =>
            updateStatus("보통", "🟡")
          }
          className="bg-yellow-400 text-white px-6 py-3 rounded-xl text-2xl"
        >
          보통
        </button>

        <button
          onClick={() =>
            updateStatus("혼잡", "🔴")
          }
          className="bg-red-500 text-white px-6 py-3 rounded-xl text-2xl"
        >
          혼잡
        </button>

      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-[320px]">

        <div className="mb-6">

          <div className="text-gray-500 mb-1">
            오늘 방문자
          </div>

          <div className="text-4xl font-bold">
            {todayCount}
          </div>

        </div>

        <div className="mb-8">

          <div className="text-gray-500 mb-1">
            총 방문자
          </div>

          <div className="text-4xl font-bold">
            {totalCount}
          </div>

        </div>

        <button
          onClick={resetTodayViews}
          className="bg-black text-white px-5 py-3 rounded-xl"
        >
          오늘 방문자 초기화
        </button>

      </div>

    </main>
  );
}