
"use client"

import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, CreditCard, LogOut, Ship, Home, Gift, Briefcase, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { session, clearSession, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session?.isAdmin) {
      router.push('/employee-login');
    }
  }, [session, isLoading, router]);

  const handleLogout = () => {
      clearSession();
      router.push('/');
  }

  if (isLoading || !session?.isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/shipments', label: 'Shipments', icon: Ship },
    { href: '/admin/users', label: 'Customers', icon: Users },
    { href: '/admin/employees', label: 'Employees', icon: Briefcase },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/balance-codes', label: 'Balance Codes', icon: Gift },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image src="/images/logo/logo.png" alt="Logo" width={40} height={40} />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">HK SPEED COURIERS</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map(link => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(link.href)}>
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                    <Home />
                    <span>Back to Website</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 bg-background border-b md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <p className="text-sm font-medium">Welcome, {session?.firstName || 'Admin'}!</p>
        </header>
        <main className="p-4 sm:p-6 bg-secondary flex-1">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
