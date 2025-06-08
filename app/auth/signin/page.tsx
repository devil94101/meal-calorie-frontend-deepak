"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Eye, EyeOff } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type SignInFormValues = z.infer<typeof signInSchema>

export default function SignIn() {
  const [apiError, setApiError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { signIn } = useAuthStore()

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignInFormValues) => {
    setApiError("")
    setIsSubmitting(true)
    try {
      const result = await signIn(data.email, data.password)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setApiError(result.error || "Invalid credentials")
      }
    } catch (_) {
      setApiError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemoCredentials = () => {
    form.setValue("email", "hello@example.com")
    form.setValue("password", "test@123A")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Utensils className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to track your daily nutrition and calories</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jane@example.com" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          {...field}
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isSubmitting}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {apiError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2">{apiError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Try the demo:</strong>
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fillDemoCredentials} 
              className="w-full"
              disabled={isSubmitting}
            >
              Fill Demo Credentials
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Email: hello@example.com
              <br />
              Password: test@123A
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
