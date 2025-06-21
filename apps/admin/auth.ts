import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@repo/database";
import { findByRegister } from "@repo/actions";
import { CredentialsSignin } from "next-auth";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "CredentialsWithOtp",
      credentials: {
        register_number: {},
        phone: {},
        stage: {},
        otp: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.register_number) {
          throw new CredentialsSignin("Register number is required.");
        }

        // OTP шалгах шат

        const user = await findByRegister(
          credentials.register_number.toString()
        );

        if (!user) {
          throw new CredentialsSignin("InvalidCredentials");
        }
        if (
          !user.sms_code ||
          !user.sms_active ||
          user.sms_active < new Date() ||
          user.sms_code !== credentials.otp
        ) {
          throw new CredentialsSignin("InvalidOtp");
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              sms_code: null,
              sms_active: null,
            },
          });

          return {
            id: user.id + "",
            name: user.first_name,
            email: user.email,
          };
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
