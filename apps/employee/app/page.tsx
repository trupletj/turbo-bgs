import Image from "next/image";
import { prisma } from '@repo/database'
export default async function Home() {

  const user = await prisma.user.findFirst({
    where: {
      register_number: "УЮ90012131",
    },
  })


  return (
    <>{user && user?.first_name}</>
  )
}
