
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const isDashboardPage = pathname.startsWith('/admin') || 
                          pathname.startsWith('/employee') || 
                          pathname.startsWith('/dashboard') ||
                          pathname.startsWith('/my-shipments') ||
                          pathname.startsWith('/booking') ||
                          pathname.startsWith('/address-book') ||
                          pathname.startsWith('/payments');

  if (isDashboardPage) {
    return null;
  }
  
  const infoLinks = [
    { href: '/about-us', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact-us', label: 'Contact Us' },
    { href: '/customer-care', label: 'Customer Care' },
  ];

  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/shipping-delivery', label: 'Shipping & Delivery' },
    { href: '/refund-cancellation', label: 'Refund & Cancellation' },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-t-4 border-orange-500 no-print">
      <div className="container py-12 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center">
              <Image src="/images/logo/Standardbred_Transparent.png" alt="Standardbred Couriers Logo" width={240} height={60} className="h-14 w-auto" />
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your trusted partner for professional and efficient delivery solutions across India.
            </p>
            <div className="pt-2">
              <p className="text-xs text-slate-400 font-semibold">GST No:</p>
              <p className="text-sm text-orange-400 font-mono">03GDYPS5828D2ZY</p>
            </div>
          </div>
          
          {/* Information Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-headline text-base font-semibold uppercase tracking-wider text-orange-400">Information</h3>
            <ul className="space-y-2">
              {infoLinks.map(link => (
                  <li key={link.href}>
                      <Link href={link.href} className="text-sm text-slate-300 hover:text-orange-400 transition-colors">
                          {link.label}
                      </Link>
                  </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-headline text-base font-semibold uppercase tracking-wider text-orange-400">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                  <li key={link.href}>
                      <Link href={link.href} className="text-sm text-slate-300 hover:text-orange-400 transition-colors">
                          {link.label}
                      </Link>
                  </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-headline text-base font-semibold uppercase tracking-wider text-orange-400">Head Office</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
                SCO 47, Ground Floor<br />
                Metro Plaza City Market<br />
                Lohgarh Road, Zirakpur<br />
                Mohali, SAS Nagar<br />
                Punjab - 140603
            </p>
            <p className="text-sm text-slate-300">
              <a href="tel:18005551234" className="hover:text-orange-400 transition-colors">+1-800-555-1234</a>
            </p>
            <p className="text-sm text-slate-300">
              <a href="mailto:contact@standardbredcouriers.com" className="hover:text-orange-400 transition-colors break-all">
                contact@standardbredcouriers.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Standardbred Couriers. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
