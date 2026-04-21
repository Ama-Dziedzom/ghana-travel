"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if the current page typically has a dark hero section at the top
  const isHeroPage =
    pathname === "/" ||
    pathname.startsWith("/explore/") ||
    pathname.startsWith("/itineraries/") ||
    pathname.startsWith("/taste/") ||
    pathname.startsWith("/travel-tips");

  // Use light text only if we're on a hero page AND we haven't scrolled down yet
  const useLightNav = isHeroPage && !isScrolled && !isOpen;

  const navLinks = [
    { name: "Explore", href: "/explore" },
    { name: "Itineraries", href: "/itineraries" },
    { name: "Taste", href: "/taste" },
    { name: "Travel Tips", href: "/travel-tips" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 transition-[padding,background-color,border-color,shadow] duration-500",
        isScrolled
          ? "bg-bg/90 backdrop-blur-md py-4 border-b border-border/50 shadow-sm"
          : "bg-transparent py-6"
      )}
    >
      {/* Subtle top gradient mask for readability when transparent over image */}
      {!isScrolled && isHeroPage && !isOpen && (
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none -z-10" />
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center h-10 overflow-hidden z-50">
          <div className="relative w-32 h-10">
            <Image
              src={useLightNav ? "/logo-white.svg" : "/logo.svg"}
              alt="Ghana. Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-body text-[10px] uppercase font-bold tracking-[0.25em] transition-all duration-300 relative py-1",
                pathname.startsWith(link.href)
                  ? "text-accent after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent"
                  : useLightNav
                    ? "text-white/80 hover:text-white"
                    : "text-muted hover:text-text"
              )}
            >
              {link.name}
            </Link>
          ))}
          <button
            className={cn(
              "transition-colors duration-300 p-1",
              useLightNav ? "text-white/80 hover:text-white" : "text-muted hover:text-text"
            )}
          >
            <Search size={18} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4 z-50">
          <button
            className={cn(
              "p-1",
              useLightNav ? "text-white/80" : "text-muted"
            )}
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "p-1 focus:outline-none transition-colors duration-300",
              isOpen ? "text-text" : useLightNav ? "text-white" : "text-text"
            )}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-[#FAF7F2] z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-500 md:hidden",
          isOpen 
            ? "opacity-100 pointer-events-auto translate-y-0" 
            : "opacity-0 pointer-events-none translate-y-8"
        )}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "font-display text-4xl font-medium tracking-tight hover:text-accent transition-all duration-300",
              pathname.startsWith(link.href) ? "text-accent" : "text-text",
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Nav;
