"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SingOutComponent() {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Системээс гарч байна...</h1>
        <p>Таныг автоматаар нэвтрэх хуудас руу шилжүүлнэ</p>
      </div>
    </div>
  );
}
