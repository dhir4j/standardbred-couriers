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
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "International Shipping",
    desc: "Worldwide delivery network with customs support",
    icon: Globe,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Secure Handling",
    desc: "Insured and tracked shipments with care",
    icon: Shield,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Real-Time Tracking",
    desc: "Live updates at every step of the journey",
    icon: MapPin,
    color: "from-orange-500 to-red-500"
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

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Operations Director",
    company: "TechCorp Inc.",
    quote: "Standardbred has transformed our logistics. The platform is intuitive and delivery times are reliable.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Supply Chain Manager",
    company: "GlobalTrade Solutions",
    quote: "Great courier service. The real-time tracking gives us the visibility we need for our operations.",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "E-commerce Owner",
    company: "Boutique Online",
    quote: "Our customers appreciate the fast shipping. Standardbred's service has helped improve our customer satisfaction.",
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
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <motion.h1
                className="text-5xl md:text-7xl font-bold leading-tight"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
              >
                Ship Smarter,
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Deliver Faster
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-300 max-w-2xl"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Experience reliable logistics with real-time tracking, transparent pricing, and dedicated support for all your shipping needs.
              </motion.p>

              {/* Inline Tracking */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-2xl max-w-2xl"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Input
                  type="text"
                  placeholder="Enter tracking number (e.g., RS123456)"
                  className="flex-1 border-0 focus-visible:ring-0 text-lg h-14 bg-transparent"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                />
                <Button
                  onClick={handleTrack}
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button size="lg" asChild className="bg-white text-purple-900 hover:bg-gray-100 group">
                  <Link href="/login">
                    Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
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
                  { icon: Clock, title: "Fast Delivery", desc: "Express shipping available" },
                  { icon: Shield, title: "Secure & Insured", desc: "Full protection coverage" },
                  { icon: MapPin, title: "Live Tracking", desc: "Real-time updates" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                    whileHover={{ scale: 1.05, x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-white">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-gray-300">{item.desc}</p>
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
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:20px_20px]"></div>
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
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-b from-white to-purple-50">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Services
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
              <motion.div
                key={index}
                className="group relative p-8 rounded-3xl bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border-2 border-gray-100 hover:border-purple-200 transition-all duration-500 cursor-pointer"
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              >
                <motion.div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <service.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
                <div className="mt-6 flex items-center text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Learn more <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                  <div className="hidden lg:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-300 to-transparent"></div>
                )}

                <motion.div
                  className="relative z-10 mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-bold"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {step.step}
                </motion.div>

                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-100">
                  <step.icon className="w-7 h-7 text-purple-600" />
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Why Choose Standardbred
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
                variants={scaleIn}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-purple-900">
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
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
                className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    <p className="text-gray-500 text-xs">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

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
            <p className="text-xl mb-10 text-purple-100">
              Join thousands of businesses using Standardbred for their shipping needs. Create your account today.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={staggerContainer}
            >
              <motion.div variants={scaleIn}>
                <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-10 py-7 group">
                  <Link href="/login">
                    Start Shipping Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={scaleIn}>
                <Button size="lg" variant="outline" asChild className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-7">
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
