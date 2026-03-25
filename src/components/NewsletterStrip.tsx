"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

const NewsletterStrip = () => {
  const contributors = [
    "/images/contributor_ama.png",
    "/images/contributor_kofi.png",
    "/images/contributor_naa.png",
    "https://i.pravatar.cc/150?u=traveler1"
  ];

  return (
    <section className="py-24 px-6 lg:px-12 bg-bg relative overflow-hidden flex items-center justify-center">
      {/* Decorative background gradients for texture */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-2/5 rounded-full blur-[140px] -mr-64 -mt-64 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-3/5 rounded-full blur-[140px] -ml-64 -mb-64 animate-pulse pointer-events-none delay-1000" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-text shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden scale-100 transition-all duration-1000">
          {/* Visual Column */}
          <div className="relative min-h-[500px] lg:min-h-full overflow-hidden group">
            <Image
              src="/images/newsletter_ghana.png"
              alt="The Soul of Ghana"
              fill
              className="object-cover transition-transform duration-[60s] group-hover:scale-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-text via-text/20 to-transparent opacity-80" />
            
            {/* Overlay Content */}
            <div className="absolute inset-0 p-12 lg:p-16 flex flex-col justify-end text-white space-y-6">
              <div className="flex items-center space-x-2 text-accent">
                <span className="font-body text-[10px] uppercase font-black tracking-[0.5em]">
                  Insider Access
                </span>
              </div>
              <h3 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-balance">
                "Ghana is not just a destination; <span className="text-white/40 italic">it's a transformation.</span>"
              </h3>
              
              <div className="flex items-center space-x-4 pt-8">
                <div className="flex -space-x-3">
                  {contributors.map((src, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-text bg-border/20 overflow-hidden ring-1 ring-white/10 transition-transform hover:scale-110 hover:z-10 cursor-pointer">
                      <Image 
                        src={src} 
                        alt={`Contributor ${i + 1}`} 
                        width={48} 
                        height={48} 
                        className="object-cover h-full"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-body text-xs text-white uppercase font-bold tracking-widest">
                    4,280+ Members
                  </p>
                  <p className="font-body text-[10px] text-white/50 tracking-tight">
                    Exploring the unseen side of West Africa
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="p-12 md:p-16 lg:p-24 bg-[#141414] border-l border-white/5 flex flex-col justify-center space-y-12">
            <div className="space-y-6">
              <h2 className="font-display text-5xl md:text-7xl text-white leading-tight tracking-tight">
                Travel <br /> <span className="text-accent">Deeper.</span>
              </h2>
              <p className="font-body text-white/40 text-lg md:text-xl max-w-sm leading-relaxed font-light tracking-wide">
                Join our private editorial for curated guides, hidden culinary gems, and the stories that define modern Ghana.
              </p>
            </div>

            <form 
              className="space-y-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-0 py-6 bg-transparent border-b border-white/10 focus:border-accent focus:outline-none font-body text-lg text-white transition-all duration-700 placeholder:text-white/20"
                    required
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-1000 group-focus-within:w-full" />
                </div>
              </div>
              
              <button 
                type="submit"
                className="group w-full py-8 bg-accent text-white flex items-center justify-center space-x-4 font-body text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 hover:bg-white hover:text-text relative overflow-hidden"
              >
                <span className="relative z-10">Request Invitation</span>
                <ArrowRight size={14} className="relative z-10 transition-transform group-hover:translate-x-3 duration-500" />
                <div className="absolute inset-x-0 bottom-0 h-0 bg-white group-hover:h-full transition-all duration-700 -z-0" />
              </button>
            </form>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <span className="w-12 h-[1px] bg-accent/20" />
                <p className="font-body text-[9px] text-white/20 uppercase font-bold tracking-[0.5em]">
                  Privacy First. No Spam.
                </p>
              </div>
              <p className="font-body text-[8px] text-white/10 leading-loose max-w-xs">
                By subscribing, you agree to our terms of service and privacy policy. We protect your data as if it were our own.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Styles for slow rotation */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default NewsletterStrip;



