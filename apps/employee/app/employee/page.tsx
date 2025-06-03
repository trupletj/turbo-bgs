import { SectionCards } from "@/components/section-cards"
import { auth } from "@/auth"
import AttendenceHistory from "@/components/attendance-history"

export default async function Page() {

  const session = await auth()
  const arr = session?.user?.name?.split(" ") || []
  const name = arr[0] || ""
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6 font-bold">
        Сайн уу? {name}
      </div>
      <AttendenceHistory />
      <SectionCards />
    </div>

  )
}
