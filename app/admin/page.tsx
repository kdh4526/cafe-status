"use client";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminPage() {

  const updateStatus = async (
    status: string,
    emoji: string
  ) => {
    try {

      await setDoc(
        doc(db, "cafes", "main"),
        {
          status: status,
          emoji: emoji,
          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );

      alert("저장 성공!");

    } catch (error) {

      console.log(error);
      alert("에러 발생!");

    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">

      <h1 className="text-6xl font-bold mb-10">
        관리자 페이지
      </h1>

      <div className="flex gap-4">

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

    </main>
  );
}