import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Globe, PackageCheck, ShieldCheck, Truck, Ship, Plane } from "lucide-react";
import Image from "next/image";

const services = [
  {
    title: "Domestic Express",
    description: "Swift, time-definite delivery for your documents and small parcels across the country. Ideal for urgent shipments.",
    icon: Truck
  },
  {
    title: "International Shipping",
    description: "Seamless and reliable international courier services to connect your business to the world with full tracking.",
    icon: Globe
  },
  {
    title: "E-commerce Logistics",
    description: "Comprehensive logistics solutions for online businesses, including warehousing, order fulfillment, and last-mile delivery.",
    icon: PackageCheck
  },
  {
    title: "Corporate Solutions",
    description: "Customized courier and logistics services tailored to meet the specific needs of corporate clients.",
    icon: Briefcase
  },
  {
    title: "Secure & Insured",
    description: "High-security transport for valuable items with full insurance coverage for your peace of mind.",
    icon: ShieldCheck
  },
  {
    title: "Freight Services",
    description: "Specialized freight services for heavy or oversized shipments by air, sea, or land.",
    icon: Ship,
  }
];

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-slate-50 to-orange-100 py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-orange-300 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-300 rounded-full filter blur-3xl opacity-15"></div>
      <div className="container relative z-10">
        <div className="bg-white p-12 rounded-3xl shadow-2xl shadow-orange-500/10 border-2 border-orange-200">
            <div className="text-center pb-12">
              <h1 className="text-4xl sm:text-5xl font-headline font-bold text-slate-900">
                Our Services
              </h1>
              <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">Comprehensive logistics solutions tailored for you.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex gap-6 items-start p-8 rounded-2xl bg-gradient-to-br from-white to-orange-50 border-2 border-slate-200 hover:border-orange-400 shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30">
                        <service.icon className="w-10 h-10" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-bold mb-3 text-slate-900">{service.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
