"use client";

import type React from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "User";

  useEffect(() => {
    checkAuth()
  }, [checkAuth]); // Only run once on mount

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/auth/signin");
    }
  }, [isLoading, isAuthenticated, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">CalorieTracker</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  else if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-md font-semibold">CalorieTracker</h1>
            <div className="text-sm text-muted-foreground">
              Welcome, {fullName}
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
