'use server';
import {prisma} from '@repo/database';

export async function findByRegister(register_number: string) {
  const user = await prisma.user.findUnique({
    where: {
      register_number,
    },
  });
  return user;
}
