"use server";
import { prisma } from "@repo/database";
import { sendSms } from "./sms";

export async function matchUserInfo(register_number: string, phone: string) {
  const user = await prisma.user.findUnique({
    where: {
      register_number,
    },
  });
  if (!user || user.phone !== phone) {
    // буруу өгөгдөл ирсэн
    return { type: "error", errorMsg: "Алдаа гарлаа." };
  }

  const user_profile = await prisma.profile.findUnique({
    where: {
      user_id: user.id,
    },
  });
  if (!user_profile) {
    return { type: "error", errorMsg: "Бүртгэл үүсээгүй байна." };
  }

  const code = "" + Math.floor(100000 + Math.random() * 900000);
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      // sms_code: code,
      sms_code: code,
      sms_active: expiresAt,
    },
  });
  // SMS илгээх
  const smsres = await sendSms(phone, `Tanii neg udaagiin code :  ${code}`);

  return {
    type: "ok",
  };
}
