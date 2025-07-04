"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser } from "@/action/UserService";
import { user as User } from "@repo/database/generated/prisma/client/client";

const AddProfile = () => {
  const [registerNumber, setRegisterNumber] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerNumber.trim()) return;

    setLoading(true);
    setError("");
    try {
      const foundUser = await getUser({
        where: { register_number: registerNumber, is_active: true },
      });
      setUser(foundUser);
    } catch (err) {
      setError("Хэрэглэгч олдсонгүй эсвэл алдаа гарлаа");
      console.error("Хэрэглэгч хайх үед алдаа:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Хэрэглэгч бүртгэнэ</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={registerNumber}
            onChange={(e) => setRegisterNumber(e.target.value)}
            placeholder="Регистрийн дугаар"
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Хайж байна..." : "Хайх"}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {user ? (
        <div className="border p-4 rounded-lg">
          <h2 className="font-semibold">Олдсон хэрэглэгч:</h2>
          <p>Нэр: {user.first_name}</p>
          <p>Регистр: {user.register_number}</p>
          {/* Бусад мэдээлэл */}
        </div>
      ) : (
        <p className="text-gray-500">Регистрийн дугаараар хайлт хийх</p>
      )}
    </div>
  );
};

export default AddProfile;
