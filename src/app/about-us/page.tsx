import { Building2, Target, Lightbulb, ShieldCheck, ThumbsUp, Users, TrendingUp, Award } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Integrity",
    desc: "Every shipment handled with the utmost care and transparency",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    desc: "Leveraging cutting-edge technology for seamless logistics",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: ThumbsUp,
    title: "Customer Excellence",
    desc: "Delivering beyond expectations, every single time",
    color: "from-green-500 to-emerald-500"
  },
];

const milestones = [
  { year: "2019", title: "Founded", desc: "Started with a vision to revolutionize logistics" },
  { year: "2020", title: "10K Deliveries", desc: "Reached our first major milestone" },
  { year: "2022", title: "Global Expansion", desc: "Expanded operations to 45+ countries" },
  { year: "2024", title: "#1 Rated", desc: "Became the top-rated courier service" },
];

export default function AboutUsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Building2 className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-medium">About Standardbred</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Redefining Logistics
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                One Delivery at a Time
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're not just a courier service—we're your logistics partner committed to making every delivery exceptional.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section - Split Layout */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 mb-6">
                <Target className="w-4 h-4" />
                <span className="text-sm font-semibold">Our Mission</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Building the Future
                <span className="block text-purple-600">of Logistics</span>
              </h2>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Standardbred Couriers, we believe that logistics should be seamless, reliable, and stress-free. Our mission is to connect businesses and individuals through innovative delivery solutions that prioritize speed, security, and customer satisfaction.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed">
                From local deliveries to international shipments, we're here to ensure your packages arrive safely and on time, every time.
              </p>

              <div className="mt-8 flex gap-4">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link href="/contact-us">Get in Touch</Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link href="/services">Our Services</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about_us.jpg"
                  alt="Standardbred Team"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl border-2 border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-purple-600">98%</p>
                    <p className="text-sm text-gray-600">Customer Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Card Grid */}
      <section className="py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-purple-600">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that drive everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-white border-2 border-gray-100 hover:border-purple-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-purple-600">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Milestones that shaped who we are today
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  {/* Timeline line */}
                  {index < milestones.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gradient-to-r from-purple-200 to-pink-200"></div>
                  )}

                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-xl mb-4 shadow-lg">
                      {milestone.year.slice(2)}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience Excellence?
            </h2>
            <p className="text-xl mb-10 text-purple-100">
              Join thousands of satisfied customers who trust Standardbred for their logistics needs.
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-10 py-7">
              <Link href="/login">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
