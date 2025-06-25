
import { prisma } from "@repo/database";
import { Prisma } from "@repo/database/generated/prisma/client/client";

export const getOrganizations = async(args: Prisma.organizationFindManyArgs= {},
) => {
  try{
    return prisma.organization.findMany(args)
  }catch(e){
    console.log(e)
  }
} 