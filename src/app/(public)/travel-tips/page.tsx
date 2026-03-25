"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Sun, 
  MapPin, 
  Wallet, 
  Heart, 
  Wifi, 
  Backpack, 
  Plane,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const TravelTipsPage = () => {
  const featuredTips = [
    {
      image: "/images/tips-planning.png",
      category: "Planning",
      title: "The Best Time to Experience Ghana",
      content: "Timing is everything. From the vibrant 'Dirty December' festivities to the tranquil dry season, understand when to visit for your ideal weather and culture.",
    },
    {
      image: "/images/tips-transport.png",
      category: "Movement",
      title: "Mastering the Art of the 'Trotro'",
      content: "Navigating Ghana's local transport is an adventure in itself. Learn to spot your destination, understand signs, and ride like a local.",
    },
    {
      image: "/images/tips-momo.png",
      category: "Finance",
      title: "Cashless: Mobile Money (MoMo)",
      content: "Ghana's economy runs on digital wallets. Set up your SIM, register for MoMo, and pay for everything from snacks to luxury hotels.",
    }
  ];

  const standardTips = [
    {
      icon: <Heart size={24} strokeWidth={1.5} />,
      title: "Health & Safety",
      content: "Ghana is welcoming and safe. Keep certificates handy, use malaria prophylaxis, and opt for bottled water for a smooth journey."
    },
    {
      icon: <Wifi size={24} strokeWidth={1.5} />,
      title: "Staying Connected",
      content: "Grab an MTN or Vodafone SIM at Kotoka Airport. Data is affordable and reliable, keeping you connected coast to coast."
    },
    {
      icon: <Backpack size={24} strokeWidth={1.5} />,
      title: "What to Pack",
      content: "Think breathable linen, sturdy shoes, and a Type G adapter. Don't forget high-SPF sunscreen and a spirit for adventure."
    },
    {
      icon: <Plane size={24} strokeWidth={1.5} />,
      title: "Visa Essentials",
      content: "Check requirements early—most visitors need a visa. ECOWAS citizens enjoy visa-free entry, and the E-Visa process is simpler."
    }
  ];

  return (
    <div className="bg-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/tips-hero.png"
          alt="Ghana landscape"
          fill
          className="object-cover transition-transform duration-[2000ms] scale-110 hover:scale-100"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-black/20" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.5em] text-accent bg-white/10 backdrop-blur-md px-6 py-2 rounded-full inline-block border border-white/10">
            Expert Guidance
          </span>
          <h1 className="font-display text-5xl md:text-8xl text-white leading-[1.1] drop-shadow-2xl">
            Practical <span className="italic font-light text-accent">Wisdom</span>
          </h1>
          <p className="font-body text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need for an unforgettable journey through the center of the world. Prepared by those who know it best.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-32 relative z-20 pb-40">
        {/* Featured Tips Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          {featuredTips.map((tip, i) => (
            <div key={i} className="group block bg-bg h-full">
              <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-border rounded-sm">
                <Image
                  src={tip.image}
                  alt={tip.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="absolute top-4 left-4 bg-accent text-white text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 rounded-sm shadow-lg">
                  {tip.category}
                </span>
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-2xl text-text group-hover:text-accent transition-colors leading-tight">
                  {tip.title}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed line-clamp-3">
                  {tip.content}
                </p>
                <div className="pt-2">
                  <span className="font-body text-[10px] uppercase font-bold tracking-widest text-accent flex items-center group-hover:translate-x-1 transition-transform">
                    Explore Guide <ArrowRight size={12} className="ml-2" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Essential Knowledge Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Local Context</span>
              <h2 className="font-display text-4xl md:text-5xl text-text leading-tight uppercase tracking-tight">
                Essential <br/>Local Knowledge
              </h2>
              <div className="h-[1px] w-20 bg-accent" />
              <p className="font-body text-muted leading-relaxed text-lg max-w-sm">
                The nuances that make a journey seamless. Respect, readiness, and the rhythm of daily life.
              </p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm p-10 rounded-sm border border-border/80 space-y-8 relative overflow-hidden group">
              <div className="flex items-center gap-4 relative">
                <div className="w-10 h-10 bg-accent-3/10 rounded-full flex items-center justify-center text-accent-3">
                  <Info size={20} />
                </div>
                <h4 className="font-display text-2xl text-text tracking-tight">Ghana At A Glance</h4>
              </div>

              <ul className="space-y-6 relative">
                {[
                  { label: "Official Language", value: "English" },
                  { label: "Currency", value: "Ghanaian Cedi (GHS)" },
                  { label: "Time Zone", value: "GMT +0" },
                  { label: "Driving", value: "Right side" },
                ].map((fact, idx) => (
                  <li key={idx} className="flex items-center justify-between border-b border-border/40 pb-5 last:border-0 last:pb-0">
                    <span className="font-body text-[10px] text-muted uppercase tracking-[0.2em] font-bold">{fact.label}</span>
                    <span className="font-display text-xl text-text">{fact.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {standardTips.map((tip, i) => (
              <div key={i} className="group relative">
                <div className="flex flex-col space-y-6">
                  <div className="w-16 h-16 bg-white border border-border/80 rounded-full flex items-center justify-center text-accent shadow-sm transition-all duration-500 group-hover:bg-accent group-hover:text-white group-hover:border-accent">
                    {tip.icon}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-display text-2xl text-text transition-colors duration-500 group-hover:text-accent">
                      {tip.title}
                    </h3>
                    <p className="font-body text-sm text-muted leading-relaxed">
                      {tip.content}
                    </p>
                    <div className="w-8 h-[1px] bg-border group-hover:w-16 group-hover:bg-accent transition-all duration-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-40 relative overflow-hidden bg-text p-12 lg:p-24 text-center rounded-sm">
            <div className="absolute inset-0 opacity-20">
              <Image 
                src="/images/tips-transport.png"
                alt="Ghana texture"
                fill
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-text/80 mix-blend-multiply" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <span className="font-body text-[10px] uppercase font-bold tracking-[0.4em] text-accent">Your Journey Starts Here</span>
              <h2 className="font-display text-4xl md:text-7xl text-white">Akwaaba</h2>
              <p className="font-body text-white/70 text-lg md:text-xl italic max-w-2xl mx-auto">
                "It means welcome. And we mean it from the moment you began your journey. Let us guide you through the heart of West Africa."
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                <Link 
                  href="/itineraries" 
                  className="w-full sm:w-auto px-10 py-5 bg-accent text-white font-body text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-white hover:text-text transition-all duration-500 rounded-sm"
                >
                  Explore Itineraries
                </Link>
                <Link 
                  href="/explore" 
                  className="w-full sm:w-auto px-10 py-5 border border-white/20 text-white font-body text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-white/10 transition-all duration-500 rounded-sm"
                >
                  Read Stories
                </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TravelTipsPage;
