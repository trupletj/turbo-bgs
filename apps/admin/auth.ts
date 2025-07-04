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
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        const profile = await prisma.profile.findUnique({
          where: { user_id: user.id },
          include: {
            profile_roles: {
              include: {
                permissions: true,
              },
            },
          },
        });

        const roles =
          profile?.profile_roles.map((role) => ({ name: role.name })) ?? [];

        const permissions = profile?.profile_roles
          .flatMap((role) => role.permissions)
          .map((perm) => ({
            resource: perm.resource,
            path: perm.path,
            action: perm.action,
          }));

        token.id = user.id;
        token.roles = roles;
        token.permissions = permissions ?? [];
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.roles = token.roles ?? [];
      session.user.permissions = token.permissions ?? [];
      return session;
    },
  },
  session: { strategy: "jwt" },
});
