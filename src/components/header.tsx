
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Mail, Phone, Search, LogOut, UserCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSession } from '@/hooks/use-session';
import MobileNav from './mobile-nav';
import { motion } from 'framer-motion';

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
    <motion.header
      className="sticky top-0 z-50 w-full bg-white shadow-md no-print"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Top bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden border-b-4 border-orange-500">
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 6,
            ease: "easeInOut"
          }}
        />
        <div className="container flex h-11 items-center justify-between text-xs sm:text-sm relative z-10">
          <div className="flex gap-3 sm:gap-6">
             <motion.a
               href="mailto:contact@standardbredcouriers.com"
               className="flex items-center gap-1 sm:gap-2 hover:text-orange-400 transition-colors"
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
             >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">contact@standardbredcouriers.com</span>
             </motion.a>
             <motion.a
               href="tel:18005551234"
               className="hidden sm:flex items-center gap-2 hover:text-orange-400 transition-colors"
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
             >
                <Phone className="h-4 w-4" />
                +1-800-555-1234
             </motion.a>
          </div>
           <div className="hidden md:flex items-center gap-3">
              {!isLoading && (
                session ? (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild size="sm" variant="ghost" className="text-sm h-8 text-white hover:bg-orange-500/20 hover:text-orange-400">
                          <Link href={getDashboardHref()}><UserCircle className='mr-2 h-4 w-4' />Dashboard</Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" variant="ghost" className="text-sm h-8 text-white hover:bg-orange-500/20 hover:text-orange-400" onClick={handleLogout}>
                          <LogOut className='mr-2 h-4 w-4' />Logout
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild size="sm" variant="ghost" className="text-sm h-8 text-white hover:bg-orange-500/20 hover:text-orange-400">
                          <Link href="/login">Customer Login</Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild size="sm" variant="ghost" className="text-sm h-8 text-white hover:bg-orange-500/20 hover:text-orange-400">
                          <Link href="/employee-login">Employee Login</Link>
                      </Button>
                    </motion.div>
                  </>
                )
              )}
            </div>
        </div>
      </div>

      <div className="container flex h-20 lg:h-24 items-center">
        <motion.div
          className="mr-auto flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/" className="mr-8 flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/images/logo/Standardbred_Transparent.png"
                alt="Standardbred Couriers Logo"
                width={420}
                height={120}
                className="h-16 lg:h-24 w-auto"
                priority
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 mr-6">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "font-semibold text-base tracking-wide relative group px-5 py-2 rounded-lg transition-all duration-300",
                  pathname === link.href
                    ? "text-orange-600 bg-orange-50"
                    : "text-slate-700 hover:text-orange-600 hover:bg-orange-50/70",
                )}
              >
                <Link href={link.href}>
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-full"
                      layoutId="activeNav"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </Button>
            </motion.div>
          ))}
        </nav>

        <motion.div
          className="hidden lg:flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6">
                  <Link href="/track">
                    <Search className="mr-2 h-5 w-5"/>
                    Track Order
                  </Link>
              </Button>
            </motion.div>
        </motion.div>
        <MobileNav navLinks={navLinks} />
      </div>
    </motion.header>
  );
}
