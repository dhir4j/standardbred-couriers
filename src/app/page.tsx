"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Globe, Shield, Clock, Award, Users, TrendingUp, Package, CheckCircle2, Star, Zap, MapPin, Truck, BarChart3, HeadphonesIcon, Leaf, ChevronDown, Box, Smartphone, Lock, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const stats = [
  { value: "50K+", label: "Deliveries", icon: Package },
  { value: "98%", label: "On-Time Rate", icon: Clock },
  { value: "1200+", label: "Happy Clients", icon: Users },
  { value: "45+", label: "Countries", icon: Globe },
];

const services = [
  {
    title: "Express Delivery",
    desc: "Same-day and next-day delivery options for urgent shipments",
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    link: "/services"
  },
  {
    title: "International Shipping",
    desc: "Worldwide delivery network with customs support",
    icon: Globe,
    color: "from-slate-700 to-slate-900",
    link: "/services"
  },
  {
    title: "Secure Handling",
    desc: "Insured and tracked shipments with care",
    icon: Shield,
    color: "from-orange-600 to-orange-700",
    link: "/services"
  },
  {
    title: "Real-Time Tracking",
    desc: "Live updates at every step of the journey",
    icon: MapPin,
    color: "from-slate-800 to-slate-900",
    link: "/track"
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Book Your Shipment",
    desc: "Create an account and schedule your pickup online or via our app",
    icon: Box,
  },
  {
    step: "02",
    title: "We Pick Up",
    desc: "Our team collects your package from your location",
    icon: Truck,
  },
  {
    step: "03",
    title: "Track Progress",
    desc: "Monitor your shipment in real-time with live updates",
    icon: Smartphone,
  },
  {
    step: "04",
    title: "Safe Delivery",
    desc: "Your package arrives safely at its destination",
    icon: CheckCircle2,
  },
];

const features = [
  {
    title: "Insurance Coverage",
    desc: "All shipments are insured for your peace of mind",
    icon: Shield,
  },
  {
    title: "24/7 Support",
    desc: "Our customer service team is always here to help",
    icon: HeadphonesIcon,
  },
  {
    title: "Eco-Friendly",
    desc: "Committed to sustainable and carbon-neutral delivery",
    icon: Leaf,
  },
  {
    title: "Verified Tracking",
    desc: "Proof of delivery with signature confirmation",
    icon: FileCheck,
  },
  {
    title: "Secure Packaging",
    desc: "Professional packaging services available",
    icon: Lock,
  },
  {
    title: "Multiple Locations",
    desc: "Drop-off points across major cities",
    icon: MapPin,
  },
];

const deliveryServices = [
  {
    title: "B2B Delivery",
    image: "/images/services/b2b-Delivery.jpg",
    desc: "Business-to-business logistics solutions"
  },
  {
    title: "Consumer Delivery",
    image: "/images/services/Consumer-Delivery.jpg",
    desc: "Direct-to-consumer shipping services"
  },
  {
    title: "Legal Documents",
    image: "/images/services/Legal-Documents.jpg",
    desc: "Secure delivery of legal papers"
  },
  {
    title: "Medical Equipment",
    image: "/images/services/Medical-Equipment.jpg",
    desc: "Specialized medical supply transport"
  },
  {
    title: "Machine & Auto Parts",
    image: "/images/services/Machine-auto-parts.jpg",
    desc: "Heavy equipment and parts delivery"
  },
  {
    title: "Medical STAT",
    image: "/images/services/Medical-STAT-1024x683.jpg",
    desc: "Emergency medical deliveries"
  },
  {
    title: "Office Supplies",
    image: "/images/services/Office-Supplies.jpg",
    desc: "Regular office supply deliveries"
  },
  {
    title: "Payroll",
    image: "/images/services/Payroll.jpg",
    desc: "Secure payroll document delivery"
  },
  {
    title: "Pharmaceuticals",
    image: "/images/services/Pharmaceuticals.jpg",
    desc: "Temperature-controlled medicine transport"
  },
  {
    title: "Postal Mail",
    image: "/images/services/Postal-Mail.jpg",
    desc: "Comprehensive mail services"
  },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Operations Manager",
    company: "TechVista Solutions, Chandigarh",
    quote: "Standardbred has transformed our logistics operations. Their real-time tracking and timely deliveries have made them our go-to courier partner.",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "E-commerce Head",
    company: "ShopKart India, Mohali",
    quote: "Excellent service! The team is professional and delivery times are consistently reliable. Our customers love the seamless shipping experience.",
    rating: 5
  },
  {
    name: "Amit Patel",
    role: "Supply Chain Director",
    company: "IndiaLogistics Pvt Ltd",
    quote: "We've been using Standardbred for our B2B deliveries across Punjab. Their service quality and customer support are outstanding.",
    rating: 5
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleTrack = () => {
    if (trackingId) {
      router.push(`/track/${trackingId}`);
    } else {
      router.push('/track');
    }
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-orange-400 rounded-full filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-10 w-96 h-96 bg-slate-800 rounded-full filter blur-3xl opacity-10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute -bottom-8 left-1/2 w-96 h-96 bg-orange-300 rounded-full filter blur-3xl opacity-15"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.12, 0.2, 0.12],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        {/* Decorative grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.h1
                className="text-5xl md:text-7xl font-bold leading-tight text-slate-900"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Ship Smarter,
                <span className="block bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  Deliver Faster
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-slate-600 max-w-2xl leading-relaxed"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Experience reliable logistics with real-time tracking, transparent pricing, and dedicated support for all your shipping needs.
              </motion.p>

              {/* Inline Tracking */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-2xl max-w-2xl border-2 border-orange-200"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Input
                  type="text"
                  placeholder="Enter tracking number (e.g., RS123456)"
                  className="flex-1 border-0 focus-visible:ring-2 focus-visible:ring-orange-500 text-lg h-14 bg-transparent text-slate-900 placeholder:text-slate-400"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                />
                <Button
                  onClick={handleTrack}
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-semibold"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Track
                </Button>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button size="lg" asChild className="bg-slate-900 text-white hover:bg-slate-800 group font-semibold px-8 shadow-lg">
                  <Link href="/login">
                    Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold px-8">
                  <Link href="/contact-us">Contact Sales</Link>
                </Button>
              </motion.div>
            </div>

            {/* Right Content - Animated Feature Cards */}
            <motion.div
              className="relative hidden lg:block"
              initial="hidden"
              animate="visible"
              variants={fadeInRight}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="space-y-4">
                {[
                  { icon: Clock, title: "Fast Delivery", desc: "Express shipping available", color: "from-orange-500 to-orange-600" },
                  { icon: Shield, title: "Secure & Insured", desc: "Full protection coverage", color: "from-slate-700 to-slate-900" },
                  { icon: MapPin, title: "Live Tracking", desc: "Real-time updates", color: "from-orange-600 to-orange-700" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all cursor-pointer"
                    whileHover={{ scale: 1.05, x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-slate-900">
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="container relative z-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group cursor-pointer"
                variants={scaleIn}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300 shadow-md">
                  <stat.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </h3>
                <p className="text-slate-700 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Our Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive logistics solutions designed for your business needs
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {services.map((service, index) => (
              <Link key={index} href={service.link}>
                <motion.div
                  className="group relative p-8 rounded-3xl bg-white hover:bg-orange-50 border-2 border-slate-200 hover:border-orange-400 transition-all duration-500 cursor-pointer h-full"
                  variants={fadeInUp}
                  whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.2)" }}
                >
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <service.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-orange-600 transition-colors">{service.title}</h3>
                  <p className="text-slate-600">{service.desc}</p>
                  <div className="mt-6 flex items-center text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Learn more <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple, transparent process from booking to delivery
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                className="relative text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-400 to-transparent"></div>
                )}

                <motion.div
                  className="relative z-10 mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white text-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {step.step}
                </motion.div>

                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-100 shadow-sm">
                  <step.icon className="w-7 h-7 text-orange-600" />
                </div>

                <h3 className="text-xl font-bold mb-3 text-slate-900">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Deliver Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden border-t-4 border-orange-500">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Can We Deliver For You?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Specialized delivery solutions for every industry
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {deliveryServices.map((service, index) => (
              <motion.div
                key={index}
                className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-orange-500 transition-all cursor-pointer shadow-lg"
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent group-hover:from-orange-900/80"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-orange-400 transition-colors">{service.title}</h3>
                    <p className="text-slate-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {service.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" asChild className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white group font-semibold shadow-xl px-8">
              <Link href="/services">
                View All Services <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Why Choose Standardbred
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Reliable courier services you can trust
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-orange-400 hover:shadow-xl transition-all cursor-pointer"
                variants={scaleIn}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <feature.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-4 border-orange-500">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Trusted by businesses across industries
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-orange-500 hover:bg-white/10 transition-all cursor-pointer shadow-lg"
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.2)" }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-white text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-slate-300 text-sm">{testimonial.role}</p>
                    <p className="text-slate-400 text-xs">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        {/* Orange accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>

        <div className="container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 text-slate-300">
              Join thousands of businesses using Standardbred for their shipping needs. Create your account today.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={staggerContainer}
            >
              <motion.div variants={scaleIn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" asChild className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-10 py-7 group font-semibold shadow-xl">
                  <Link href="/login">
                    Start Shipping Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={scaleIn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" asChild className="border-2 border-orange-500 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white text-lg px-10 py-7 font-semibold">
                  <Link href="/contact-us">Contact Sales</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
