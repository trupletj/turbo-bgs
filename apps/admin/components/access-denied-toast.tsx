"use client";

import { formatDuration } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AccessToast = () => {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("error") === "no-access") {
      toast.error("Таны эрх хүрэлцэхгүй байна", { autoClose: 1500 });
    }
  }, [params]);

  return null;
};
