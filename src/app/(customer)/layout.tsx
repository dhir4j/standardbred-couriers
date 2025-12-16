
"use client";

import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, LogOut, Home, Loader2, Package, Search, Book, CreditCard, PlusCircle, BookUser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { session, clearSession, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!session || session.isAdmin || session.isEmployee) {
        router.push('/login');
      }
    }
  }, [session, isLoading, router]);

  const handleLogout = () => {
      clearSession();
      router.push('/');
  }

  if (isLoading || !session) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/my-shipments', label: 'My Shipments', icon: Package },
    { href: '/booking', label: 'Create Shipment', icon: PlusCircle },
    { href: '/track', label: 'Track Shipment', icon: Search },
    { href: '/address-book', label: 'Address Book', icon: BookUser },
    { href: '/payments', label: 'Billing & Payments', icon: CreditCard },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image src="/images/logo/logo.png" alt="Logo" width={40} height={40} />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">Customer Section</h2>
              <p className="text-xs text-muted-foreground">HK SPEED COURIERS</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map(link => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild isActive={pathname === link.href}>
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
            <p className="text-sm font-medium">Welcome, {session?.firstName || 'Customer'}!</p>
        </header>
        <main className="p-4 sm:p-6 bg-secondary flex-1">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
