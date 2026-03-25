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
    <div className="bg-bg min-h-screen relative isolate">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none overflow-hidden">
        <Image 
          src="/images/ghana-pattern.png"
          alt=""
          fill
          className="object-cover repeat"
        />
      </div>

      {/* Hero Section - Redesigned for Editorial Impact */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-10 relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm">
                <div className="w-2 h-2 bg-accent animate-pulse" />
                <span className="font-body text-[10px] uppercase font-bold tracking-[0.2em] text-accent">
                  The Essential Guide
                </span>
              </div>
              
              <h1 className="font-display text-6xl md:text-[7rem] text-text leading-[0.9] tracking-tight">
                Practical <br/>
                <span className="italic font-light text-accent-2 block mt-2">Wisdom</span>
              </h1>
              
              <div className="flex items-center gap-8 pt-4">
                <div className="h-[1px] w-24 bg-accent/30" />
                <p className="font-body text-muted text-lg md:text-xl max-w-md leading-relaxed">
                  Everything you need for an unforgettable journey through the center of the world. Prepared by those who know it best.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-bg overflow-hidden bg-border">
                    <Image src={`/images/contributor_${i === 1 ? 'ama' : i === 2 ? 'kofi' : 'naa'}.png`} alt="Contributor" width={48} height={48} className="object-cover" />
                  </div>
                ))}
              </div>
              <p className="font-body text-[11px] uppercase tracking-widest text-muted font-semibold">
                Curated by our <span className="text-text">Local Experts</span>
              </p>
            </div>
          </div>

          {/* Hero Visuals */}
          <div className="lg:col-span-5 relative h-[500px] md:h-[650px]">
            <div className="absolute inset-0 bg-accent-3/5 transform rotate-3 scale-105" />
            <div className="relative h-full w-full overflow-hidden shadow-2xl group">
              <Image 
                src="/images/tips-hero.png"
                alt="Ghana landscape"
                fill
                className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              
              {/* Floating Glass Card */}
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent flex items-center justify-center shrink-0">
                    <Sun size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-display text-xl mb-1 italic">Morning in Accra</h4>
                    <p className="font-body text-xs text-white/70 leading-relaxed">
                      "Ghana is not just a place to visit, it's a place to feel. Let the rhythm guide you."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent-2/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20 pb-40">
        {/* Featured Tips - Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-40">
          {featuredTips.map((tip, i) => (
            <div key={i} className={cn(
              "group relative bg-white border border-border/50 p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2",
              i === 1 ? "md:mt-12" : i === 2 ? "md:mt-24" : ""
            )}>
              <div className="relative aspect-[16/10] overflow-hidden mb-8">
                <Image
                  src={tip.image}
                  alt={tip.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-text text-[9px] uppercase font-bold tracking-[0.2em] px-3 py-1.5 shadow-sm">
                  {tip.category}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase">0{i + 1}</div>
                <h3 className="font-display text-2xl md:text-3xl text-text leading-[1.1] group-hover:text-accent transition-colors">
                  {tip.title}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed line-clamp-3">
                  {tip.content}
                </p>
                <Link href="#" className="inline-flex items-center gap-3 pt-4 group/btn">
                  <span className="font-body text-[10px] uppercase font-bold tracking-widest text-accent">
                    Read Guide
                  </span>
                  <div className="w-8 h-8 border border-accent/20 flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:text-white transition-all duration-300">
                    <ArrowRight size={14} />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Essential Knowledge Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start pt-20">
          <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-32">
            <div className="space-y-6">
              <div className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase">Local Insights</div>
              <h2 className="font-display text-5xl md:text-6xl text-text leading-[1] tracking-tight">
                Essential <br/>
                <span className="italic font-light text-accent">Knowledge</span>
              </h2>
              <div className="h-[2px] w-12 bg-accent/30" />
              <p className="font-body text-muted leading-relaxed text-lg max-w-sm">
                The nuances that make a journey seamless. Respect, readiness, and the rhythm of daily life in the center of the world.
              </p>
            </div>
            
            <div className="bg-white p-10 border border-border/60 shadow-xl shadow-accent/5 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-4 relative">
                <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent">
                  <Info size={24} />
                </div>
                <h4 className="font-display text-2xl text-text italic tracking-tight uppercase">Quick Facts</h4>
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

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {standardTips.map((tip, i) => (
              <div key={i} className="group relative">
                <div className="flex flex-col space-y-8">
                  <div className="w-20 h-20 bg-white border border-border/80 flex items-center justify-center text-accent shadow-sm transition-all duration-500 group-hover:bg-accent group-hover:text-white group-hover:border-accent group-hover:rotate-12 group-hover:scale-110">
                    {tip.icon}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-display text-3xl text-text transition-colors duration-500 group-hover:text-accent italic">
                      {tip.title}
                    </h3>
                    <p className="font-body text-muted leading-relaxed group-hover:text-text transition-colors duration-500">
                      {tip.content}
                    </p>
                    <div className="w-12 h-[2px] bg-accent/20 group-hover:w-24 group-hover:bg-accent transition-all duration-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action - Redesigned for Premium Impact */}
        <div className="mt-60 relative overflow-hidden bg-text p-12 lg:p-32 text-center shadow-2xl">
            <div className="absolute inset-0 opacity-40">
              <Image 
                src="/images/tips-transport.png"
                alt=""
                fill
                className="object-cover scale-110 blur-[2px]"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-text via-text/90 to-accent-3/80 mix-blend-multiply" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] w-8 bg-accent/50" />
                  <span className="font-body text-[11px] uppercase font-bold tracking-[0.5em] text-accent">Join the Journey</span>
                  <div className="h-[1px] w-8 bg-accent/50" />
                </div>
                <h2 className="font-display text-6xl md:text-9xl text-white tracking-tighter">
                  Akwaaba
                </h2>
              </div>
              
              <p className="font-body text-white/80 text-lg md:text-2xl italic max-w-2xl mx-auto leading-relaxed">
                "It means welcome. And we mean it from the moment you began your journey. Let us guide you through the heart of West Africa."
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6">
                <Link 
                  href="/itineraries" 
                  className="w-full sm:w-auto px-12 py-6 bg-accent text-white font-body text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-text transition-all duration-500 shadow-lg hover:shadow-accent/40"
                >
                  Explore Itineraries
                </Link>
                <Link 
                  href="/explore" 
                  className="w-full sm:w-auto px-12 py-6 border border-white/30 text-white font-body text-xs font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all duration-500 backdrop-blur-sm"
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
