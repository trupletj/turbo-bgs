"use client";
import { getJobPostionOne } from "@/action/JobPositionService";
import { user as User } from "@repo/database/generated/prisma/client/client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

type JobPositionType = {
  name?: string | null;
  organization?: { name: string } | null;
} | null;

const UserInfo = ({ user }: { user: User }) => {
  const [jobPosition, setJobPosition] = useState<JobPositionType>({
    name: null,
    organization: null,
  });

  useEffect(() => {
    const res = getJobPostionOne({
      where: {
        bteg_id: user.job_position_id ?? undefined,
        is_active: false,
      },
      include: {
        organization: true,
      },
    });
  }, []);

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      <h2 className="text-lg font-semibold">
        {user.first_name} {user.last_name}
      </h2>
      <p>РД: {user.register_number}</p>
      <p>Албан тушаал ID: {user.job_position_id}</p>
      <p>И-мэйл: {user.email}</p>
      <p>Гэрийн хаяг: {user.address}</p>

      {jobPosition && (
        <>
          <p>Албан тушаал нэр: {jobPosition.name ?? "Тодорхойгүй"}</p>
          <p>Байгууллага: {jobPosition.organization?.name ?? "Тодорхойгүй"}</p>
        </>
      )}

      <Button>Бүртгэх</Button>
    </div>
  );
};

export default UserInfo;
