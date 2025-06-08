import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            404 - Page Not Found
          </h1>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 