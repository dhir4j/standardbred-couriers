
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Mail, Phone, Search, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSession } from '@/hooks/use-session';
import MobileNav from './mobile-nav';

export default function Header() {
  const pathname = usePathname();
  const { session, clearSession, isLoading } = useSession();
  const router = useRouter();

  // This regex checks if the path is inside the (customer) route group
  const isCustomerDashboard = /^\/\(customer\)\//.test(pathname) || /^\/dashboard|\/my-shipments|\/booking|\/address-book|\/payments|\/track/.test(pathname);

  // More specific check for admin and employee pages
  const isAdminOrEmployeePage = pathname.startsWith('/admin') || (pathname.startsWith('/employee') && pathname !== '/employee-login');

  if (isAdminOrEmployeePage || isCustomerDashboard) {
    return null;
  }

  const handleLogout = () => {
    clearSession();
    router.push('/');
  }

  const getDashboardHref = () => {
    if (!session) return '/login';
    if (session.isAdmin) return '/admin/dashboard';
    if (session.isEmployee) return '/employee/dashboard';
    return '/dashboard';
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/contact-us', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      {/* Top bar */}
      <div className="gradient-primary text-white">
        <div className="container flex h-10 items-center justify-between text-xs">
          <div className="flex gap-4">
             <a href="mailto:contact@standardbredcouriers.com" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
                <Mail className="h-3.5 w-3.5" />
                contact@standardbredcouriers.com
             </a>
             <a href="tel:18005551234" className="hidden sm:flex items-center gap-1.5 hover:text-white/80 transition-colors">
                <Phone className="h-3.5 w-3.5" />
                +1-800-555-1234
             </a>
          </div>
           <div className="hidden md:flex items-center gap-2">
              {!isLoading && (
                session ? (
                  <>
                    <Button asChild size="sm" variant="ghost" className="text-xs h-8">
                        <Link href={getDashboardHref()}><UserCircle className='mr-2 h-4 w-4' />Dashboard</Link>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-8" onClick={handleLogout}>
                        <LogOut className='mr-2 h-4 w-4' />Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="sm" variant="ghost" className="text-xs h-8">
                        <Link href="/login">Customer Login</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="text-xs h-8">
                        <Link href="/employee-login">Employee Login</Link>
                    </Button>
                  </>
                )
              )}
            </div>
        </div>
      </div>

      <div className="container flex h-20 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <Image src="/images/logo/logo.png" alt="Standardbred Couriers Logo" width={50} height={50} className="h-12 w-auto" />
            <span className="font-bold font-headline text-2xl sm:inline-block gradient-text">
              STANDARDBRED COURIERS
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2 mr-4">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              className={cn(
                "font-semibold text-base tracking-wide",
                pathname === link.href ? "text-primary hover:text-primary" : "text-foreground/80",
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
            <Button asChild size="lg">
                <Link href="/track">
                  <Search className="mr-2 h-5 w-5"/>
                  Track Order
                </Link>
            </Button>
        </div>
        <MobileNav navLinks={navLinks} />
      </div>
    </header>
  );
}
