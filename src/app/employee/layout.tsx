
"use client";

import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { LayoutDashboard, Book, User, Fuel, LogOut, Home, Loader2, Search, FileDown, AreaChart, BarChart, FileText, Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { session, clearSession, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        router.push('/employee-login');
      } else if (session.isAdmin) {
        router.push('/admin/dashboard');
      } else if (!session.isEmployee) {
        router.push('/employee-login');
      }
    }
  }, [session, isLoading, router]);
  
  const handleLogout = () => {
      clearSession();
      router.push('/employee-login');
  }

   if (isLoading || !session || !session.isEmployee) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const navLinks = [
    { href: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/employee/booking', label: 'Booking', icon: Book },
    { href: '/employee/excel-export', label: 'Excel Export', icon: FileDown },
    { href: '/employee/day-end', label: 'Day End', icon: BarChart },
    { href: '/employee/awb-tracking', label: 'AWB / Tracking', icon: Search },
    { href: '/employee/invoice-printing', label: 'Invoice Printing', icon: Printer },
    { href: '/employee/fuel-surcharge', label: 'Redeem Code', icon: Fuel },
    { href: '#', label: 'Rate Compare', icon: AreaChart, disabled: true },
    { href: '#', label: 'Report', icon: FileText, disabled: true },
    { href: '#', label: 'Sender', icon: User, disabled: true },
    { href: '#', label: 'Receiver', icon: User, disabled: true },
    { href: '#', label: 'User', icon: User, disabled: true },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="bg-gray-900 text-white" collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Image src="/images/logo/logo.png" alt="Logo" width={40} height={40} className="bg-white rounded-full p-1"/>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <h2 className="text-lg font-bold">Employee Panel</h2>
              <p className="text-xs text-gray-400">HK SPEED COURIERS</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navLinks.map(link => (
              <SidebarMenuItem key={link.label}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname.startsWith(link.href) && link.href !== '#'}
                  tooltip={{ children: link.label }}
                  className="data-[active=true]:bg-gray-700 hover:bg-gray-700/80"
                  disabled={link.disabled}
                >
                  <Link href={link.href}>
                    <link.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
               <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{children: "Back to Website"}}>
                    <Link href="/">
                        <Home />
                        <span className="group-data-[collapsible=icon]:hidden">Back to Website</span>
                    </Link>
                </SidebarMenuButton>
               </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{children: "Logout"}}>
                    <LogOut />
                    <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-white border-b md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <p className="text-sm font-medium">Welcome, {session?.firstName || 'Employee'}!</p>
        </header>
        <main className="flex-1 flex bg-gray-100/50">
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
