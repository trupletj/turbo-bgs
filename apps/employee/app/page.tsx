import Image from "next/image";
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@repo/database'


export default async function Home() {
 
  const supabase = await createClient()
  const { data: users } = await supabase.from("user").select();
  const user = await prisma.user.findFirst({
    where: {
      register_number: "УЮ90012131",
    },
  })


  return (
    <>{user && user?.first_name}
    
    <div>
      {JSON.stringify(users, null, 2)}
    </div>
    </>
  )
}
