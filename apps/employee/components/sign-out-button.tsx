"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const SignOutButton = () => {
    return (
        <Button variant={"ghost"} onClick={() => signOut()}>Системээс гарах</Button>
    )
}

export default SignOutButton