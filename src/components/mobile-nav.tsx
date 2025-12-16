
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogIn, UserPlus, UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import { useSession } from '@/hooks/use-session';

interface NavLink {
    href: string;
    label: string;
}

interface MobileNavProps {
    navLinks: NavLink[];
}

export default function MobileNav({ navLinks }: MobileNavProps) {
    const pathname = usePathname();
    const { session, clearSession, isLoading } = useSession();
    const router = useRouter();

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

    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] p-0">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle>
                            <SheetClose asChild>
                                <Link href="/" className="flex items-center space-x-2">
                                    <Image src="/images/logo/logo.png" alt="HK SPEED COURIERS Logo" width={40} height={40} />
                                    <span className="font-bold text-lg font-headline">HK SPEED COURIERS</span>
                                </Link>
                            </SheetClose>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col h-full">
                        <div className="flex-1 flex flex-col space-y-1 p-4">
                            {navLinks.map((link) => (
                                <SheetClose key={link.href} asChild>
                                    <Button asChild variant={pathname === link.href ? "secondary" : "ghost"} className="justify-start text-base font-semibold">
                                        <Link href={link.href}>{link.label}</Link>
                                    </Button>
                                </SheetClose>
                            ))}
                            <SheetClose asChild>
                                <Button asChild variant={pathname.startsWith("/track") ? "secondary" : "ghost"} className="justify-start text-base font-semibold"><Link href="/track">Track Order</Link></Button>
                            </SheetClose>
                        </div>
                        <div className="border-t p-4 mt-auto">
                            {isLoading ? null : (
                                session ? (
                                    <div className="flex flex-col space-y-2">
                                        <SheetClose asChild>
                                            <Button asChild variant="default" className="w-full"><Link href={getDashboardHref()}><UserCircle className='mr-2' /> Dashboard</Link></Button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Button variant="outline" className="w-full" onClick={handleLogout}><LogOut className='mr-2' /> Logout</Button>
                                        </SheetClose>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <SheetClose asChild>
                                            <Button asChild variant="default" className="w-full"><Link href="/login"><LogIn className='mr-2' /> Login</Link></Button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Button asChild variant="outline" className="w-full"><Link href="/signup"><UserPlus className='mr-2' /> Sign Up</Link></Button>
                                        </SheetClose>
                                         <SheetClose asChild>
                                            <Button asChild variant="secondary" className="w-full"><Link href="/employee-login">Staff Login</Link></Button>
                                        </SheetClose>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
