import React from 'react'
import { VerifyOtpForm } from '@/components/verify-otp-form'
import { auth } from "@/auth"
import { redirect } from "next/navigation";
const page = async () => {
    const session = await auth();
    if (session?.user) { redirect("/dashboard") }
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-2xl flex-col gap-6">
                <VerifyOtpForm />
            </div>
        </div>

    )
}

export default page