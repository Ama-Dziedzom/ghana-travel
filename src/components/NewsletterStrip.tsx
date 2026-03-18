"use client";

import { ArrowRight } from "lucide-react";

const NewsletterStrip = () => {
  return (
    <section className="bg-border/30 border-y border-border py-16 px-6 lg:px-12 text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="font-display text-3xl md:text-4xl text-text">
          Get Ghana travel guides in your inbox.
        </h2>
        <form 
          className="flex flex-col sm:flex-row items-stretch justify-center gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow max-w-sm px-6 py-4 bg-bg border border-border focus:border-accent focus:outline-none font-body text-sm transition-colors"
            required
          />
          <button 
            type="submit"
            className="group px-8 py-4 bg-text text-bg hover:bg-accent transition-colors flex items-center justify-center space-x-2 font-body text-sm font-bold uppercase tracking-widest"
          >
            <span>Subscribe</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>
        <p className="font-body text-[10px] text-muted uppercase tracking-[0.2em]">
          NO SPAM. JUST GHANA. AT ANY TIME.
        </p>
      </div>
    </section>
  );
};

export default NewsletterStrip;
