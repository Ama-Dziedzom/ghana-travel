"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setIsSuccess(true);
      toast.success("Message sent successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section with sophisticated background */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 bg-[#F2EDE4]">
        <div className="max-w-7xl mx-auto text-center animate-slide-up">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.4em] text-accent-2 block mb-6">
            Say Hello
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-text leading-[1.1] text-balance mb-8">
            Let's Start a <br className="hidden md:block" /> Conversation.
          </h1>
          <p className="font-body text-muted text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Whether you're planning your first trip to Ghana or looking for collaboration opportunities, our doors are always open.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12 bg-bg relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-16 animate-slide-up delay-100">
              <div className="space-y-8">
                <h2 className="font-display text-4xl text-text">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      <Mail size={18} className="text-accent group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase font-bold tracking-widest text-muted mb-1">Email Us</p>
                      <a href="mailto:hello@ghanatravelblog.com" className="font-body text-lg text-text hover:text-accent transition-colors">
                        hello@ghanatravelblog.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      <Phone size={18} className="text-accent group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase font-bold tracking-widest text-muted mb-1">Call Us</p>
                      <a href="tel:+233201484669" className="font-body text-lg text-text hover:text-accent transition-colors">
                        +233 20 148 4669
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      <MapPin size={18} className="text-accent group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase font-bold tracking-widest text-muted mb-1">Our Base</p>
                      <p className="font-body text-lg text-text">
                        Accra, Ghana
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="font-display text-4xl text-text">Social Presence</h2>
                <div className="flex space-x-6">
                  <a href="https://www.instagram.com/theghanagirl00?igsh=MW9wcms2aGpzdHh5NA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white border border-border hover:border-accent hover:text-accent transition-all hover:-translate-y-1 shadow-sm">
                    <Instagram size={20} />
                  </a>
                  <a href="https://www.tiktok.com/@ghanagirl001?_r=1&_t=ZS-95ixyQyABsa" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white border border-border hover:border-accent hover:text-accent transition-all hover:-translate-y-1 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-8 md:p-12 shadow-2xl rounded-sm border border-border/50 relative overflow-hidden animate-slide-up delay-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-16 -mt-16" />
              
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-3xl text-text mb-2">Message Received!</h3>
                    <p className="font-body text-muted max-w-sm mx-auto">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="font-body text-[10px] uppercase font-bold tracking-widest text-accent hover:text-accent-2 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="name" className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Efua Mensah"
                        className="w-full pb-3 bg-transparent border-b border-border focus:border-accent outline-none font-body text-text placeholder:text-muted/40 transition-all focus:pl-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        id="email"
                        name="email"
                        placeholder="efua@example.com"
                        className="w-full pb-3 bg-transparent border-b border-border focus:border-accent outline-none font-body text-text placeholder:text-muted/40 transition-all focus:pl-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full pb-3 bg-transparent border-b border-border focus:border-accent outline-none font-body text-text transition-all focus:pl-1 cursor-pointer appearance-none"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Travel Planning">Travel Planning</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">
                      Your Message
                    </label>
                    <textarea
                      required
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us what's on your mind..."
                      className="w-full pb-3 bg-transparent border-b border-border focus:border-accent outline-none font-body text-text placeholder:text-muted/40 transition-all focus:pl-1 resize-none"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full md:w-auto px-10 py-4 bg-accent text-white font-body text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-2 transition-all duration-500 transform hover:-translate-y-1 shadow-lg flex items-center justify-center space-x-3 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <span>Sending...</span>
                        <Loader2 size={14} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Refined CTA Section */}
      <section className="py-32 px-6 lg:px-12 bg-[#F2EDE4] relative border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-10 flex justify-center">
            <div className="w-12 h-[1px] bg-accent" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-text mb-8 leading-tight">
            Looking for a more <br className="hidden md:block" /> direct route? 
          </h2>
          <p className="font-body text-muted text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Quick travel questions? Join our community forums or message us directly on WhatsApp for real-time advice from our local experts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link 
              href="/itineraries" 
              className="w-full sm:w-auto px-10 py-4 bg-text text-white font-body text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-accent transition-all duration-500 shadow-xl"
            >
              Browse Itineraries
            </Link>
            <a 
              href="https://wa.me/233201484669" 
              className="w-full sm:w-auto px-10 py-4 border border-border text-text font-body text-[10px] uppercase font-bold tracking-[0.2em] hover:border-accent hover:text-accent transition-all duration-500"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
