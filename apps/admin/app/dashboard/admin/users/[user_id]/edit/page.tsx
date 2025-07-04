"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { profile_role as Role } from "@repo/database/generated/prisma/client/client";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import {
  getProfileRoles,
  getProfileByUserId,
  updateProfileRoles,
} from "@/action/ProfileRoleService";
import { user as User } from "@repo/database/generated/prisma/client/client";
import { getUser } from "@/action/UserService";

const UserRoleEditPage = ({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) => {
  const resolvedParams = React.use(params);
  const userId = resolvedParams.user_id;

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const is_user = await getUser({ where: { id: userId } });
        setUser(is_user);
        const allRoles = await getProfileRoles({});
        setRoles(allRoles);

        const profile = await getProfileByUserId(userId);
        if (profile?.profile_roles) {
          const userRoleIds = new Set(
            profile.profile_roles.map((role) => role.id)
          );
          setSelectedRoles(userRoleIds);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Өгөгдөл ачаалахад алдаа гарлаа");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId]); // Changed dependency to userId

  const handleRoleChange = (roleId: string) => {
    setSelectedRoles((prev) => {
      const updated = new Set(prev);
      if (updated.has(roleId)) {
        updated.delete(roleId);
      } else {
        updated.add(roleId);
      }
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateProfileRoles(userId, Array.from(selectedRoles));

      toast.success("Хэрэглэгчийн эрх амжилттай шинэчлэгдлээ", {
        autoClose: 1000,
        onClose: () => redirect("/dashboard/admin/users"),
      });
    } catch (error) {
      console.error("Error saving roles:", error);
      toast.error("Эрх шинэчлэхэд алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Ачаалж байна...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Хэрэглэгчийн эрх засварлах</h1>

      <div className="border p-6 rounded-lg bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">{user?.nice_name}</h2>
        <h2 className="text-lg font-semibold mb-4">Боломжит эрхүүд:</h2>

        <div className="space-y-3">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`role-${role.id}`}
                checked={selectedRoles.has(role.id)}
                onChange={() => handleRoleChange(role.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`role-${role.id}`}
                className="text-sm font-medium"
              >
                {role.name}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => redirect("/dashboard/admin/users")}
          >
            Буцах
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserRoleEditPage;
