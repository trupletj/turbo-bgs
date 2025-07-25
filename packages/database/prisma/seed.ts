import { prisma } from "@repo/database";

async function main() {
  const bteg_ids = ["1765", "5200"];

  for (const bteg_id of bteg_ids) {
    const user = await prisma.user.findFirst({
      where: { bteg_id },
    });

    if (!user) {
      console.error(`Хэрэглэгч олдсонгүй: bteg_id=${bteg_id}`);
      continue;
    }

    let profile = await prisma.profile.findUnique({
      where: { user_id: user.id },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          user_id: user.id,
          profile_roles: {
            connectOrCreate: {
              where: { name: "SuperAdmin" },
              create: { name: "SuperAdmin" },
            },
          },
        },
      });
      console.log(
        `✅ ${user.bteg_id} хэрэглэгчид профайл үүсэж, SuperAdmin эрхтэй холбогдлоо`
      );
    } else {
      const hasSuperAdminRole = await prisma.profile.findFirst({
        where: {
          id: profile.id,
          profile_roles: {
            some: {
              name: "SuperAdmin",
            },
          },
        },
      });

      if (!hasSuperAdminRole) {
        await prisma.profile.update({
          where: { id: profile.id },
          data: {
            profile_roles: {
              connectOrCreate: {
                where: { name: "SuperAdmin" },
                create: { name: "SuperAdmin" },
              },
            },
          },
        });
        console.log(`🔄 ${user.bteg_id} хэрэглэгчид SuperAdmin эрх холбогдлоо`);
      } else {
        console.log(
          `ℹ ${user.bteg_id} хэрэглэгч аль хэдийн SuperAdmin эрхтэй байна`
        );
      }
    }
  }
}

main()
  .catch((e) => {
    console.error("Seed алдаа:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
