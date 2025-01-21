"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CreateAgentButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/agents/create")
  }

  return <Button onClick={handleClick}>Create Agent</Button>
}

