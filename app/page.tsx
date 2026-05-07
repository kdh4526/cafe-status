"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Home() {
  const [status, setStatus] = useState("불러오는 중...");
  const [emoji, setEmoji] = useState("⏳");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "cafes", "main"),
      (doc) => {
        const data = doc.data();

        if (data) {
          setStatus(data.status);
          setEmoji(data.emoji);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold mb-10">
        ☕ 현재 카페 상태
      </h1>

      <div className="text-9xl mb-6">
        {emoji}
      </div>

      <p className="text-6xl font-bold">
        {status}
      </p>
    </main>
  );
}