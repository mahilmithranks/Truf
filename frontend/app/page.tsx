'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, CreditCard, CheckCircle, Clock, Shield, Zap, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Clock,
      title: 'Instant Booking',
      description: 'Book your slot in seconds with real-time availability',
      gradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Safe and secure online payments with instant confirmation',
      gradient: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: CheckCircle,
      title: 'Email Confirmation',
      description: 'Get instant email confirmation for all your bookings',
      gradient: 'from-pink-50 to-pink-100',
      iconColor: 'text-pink-600',
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Choose from available slots that fit your schedule',
      gradient: 'from-green-50 to-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Shield,
      title: 'Trusted Platform',
      description: 'Reliable and secure booking platform you can trust',
      gradient: 'from-orange-50 to-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: Zap,
      title: 'Quick Support',
      description: 'Fast customer support for all your queries',
      gradient: 'from-indigo-50 to-indigo-100',
      iconColor: 'text-indigo-600',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up in seconds with your email',
    },
    {
      number: '02',
      title: 'Choose Slot',
      description: 'Select your preferred date and time',
    },
    {
      number: '03',
      title: 'Confirm Booking',
      description: 'Complete payment and start playing',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/hero-bg.jpg)',
          }}
        />
        {/* Matte Overlay for text visibility */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6 animate-fade-in">
              <Star className="w-4 h-4 fill-white text-white" />
              <span>Trusted by 1000+ players</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight drop-shadow-lg">
              Book Your Perfect
              <br />
              <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                Turf Slot
              </span>
            </h1>

            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto animate-slide-up drop-shadow-md" style={{ animationDelay: '100ms' }}>
              Easy online booking with instant confirmation and secure payments. Your game is just a click away!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link href="/turfs">
                <Button size="lg" className="group px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-500 bg-white text-black hover:bg-gray-100 font-semibold">
                  Browse Turfs
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 font-semibold">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">1000+</div>
              <div className="text-gray-200 text-sm drop-shadow-md">Happy Players</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">5000+</div>
              <div className="text-gray-200 text-sm drop-shadow-md">Bookings Made</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">24/7</div>
              <div className="text-gray-200 text-sm drop-shadow-md">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose TurfBook?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the easiest way to book your favorite turf with our premium features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-zinc-800 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.iconColor}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700"></div>

            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-white text-black text-2xl font-bold flex items-center justify-center mb-6 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 relative overflow-hidden" >
        {/* Premium background effect */}
        < div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_100%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass p-12 rounded-3xl animate-scale-in">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Ready to Book Your Slot?
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Join thousands of players who trust TurfBook for their turf booking needs
            </p>
            <Link href="/turfs">
              <Button
                size="lg"
                className="group px-10 py-7 text-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-500 animate-float bg-white text-black hover:bg-gray-100 font-semibold"
              >
                Browse Available Turfs
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      < Footer />
    </div >
  );
}

