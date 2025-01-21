"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="mb-8 text-destructive">
        <AlertTriangle size={120} />
      </div>
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
      <p className="text-xl mb-8">We apologize for the inconvenience.</p>
      <div className="max-w-md mb-8">
        <p className="text-muted-foreground">
          An unexpected error occurred. Our team has been notified and is working to fix the issue.
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}

