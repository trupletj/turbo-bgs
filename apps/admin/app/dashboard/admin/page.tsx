import { Button } from "@/components/ui/button";
import UserSearchForm from "@/components/user-search-form";
import Link from "next/link";
import React from "react";

const UserSearchPage = () => {
  return (
    <div className="flex gap-3">
      <Button asChild>
        <Link href={"/admin/permissions"}>Үйлдлийн тохиргоо</Link>
      </Button>
      <Button asChild>
        <Link href={"/admin/roles"}>Эрхийн тохиргоо</Link>
      </Button>
      <Button asChild>
        <Link href={"/admin/users"}>Хэрэглэгчийн тохиргоо</Link>
      </Button>
    </div>
  );
};

export default UserSearchPage;
