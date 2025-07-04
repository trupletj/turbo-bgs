import { getProfiles } from "@/action/ProfileService";
import { getUser } from "@/action/UserService";
import { Button } from "@/components/ui/button";
import UserList from "@/components/user-list";
import { UserWithJobAndOrg } from "@/types/index";
import Link from "next/link";
import React from "react";

const UsersListPage = async () => {
  const userProfiles = await getProfiles({
    select: {
      user_id: true,
    },
  });

  const profiles: UserWithJobAndOrg[] = await Promise.all(
    userProfiles.map(async (p) => {
      const user = await getUser({
        where: {
          id: p.user_id,
          is_active: true,
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          job_position_id: true,
          job_position: {
            select: {
              name: true,
              organization: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return user as UserWithJobAndOrg;
    })
  );

  return (
    <div>
      <div className="flex justify-between w-full my-3">
        <h1 className="font-bold text-2xl">Бүртгэлтэй ажилчдын жагсаалт</h1>
        <Button asChild>
          <Link href={"/dashboard/admin/users/add"}>Бүртгэх</Link>
        </Button>
      </div>
      <UserList user_list={profiles} />
    </div>
  );
};

export default UsersListPage;
