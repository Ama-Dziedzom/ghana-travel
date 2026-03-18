"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Explore", href: "/explore" },
    { name: "Itineraries", href: "/itineraries" },
    { name: "Taste", href: "/taste" },
    { name: "Travel Tips", href: "/travel-tips" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12",
        isScrolled ? "bg-bg/95 backdrop-blur-sm py-4 border-b border-border shadow-sm" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-2">
          <span className="font-display text-2xl font-bold tracking-tight text-text group-hover:text-accent transition-colors">
            Ghana<span className="text-accent group-hover:text-text italic">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-body text-sm font-medium tracking-wide transition-all relative py-1",
                pathname.startsWith(link.href)
                  ? "text-accent after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent"
                  : "text-muted hover:text-text"
              )}
            >
              {link.name}
            </Link>
          ))}
          <button className="text-muted hover:text-text transition-colors p-1">
            <Search size={20} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button className="text-muted p-1">
            <Search size={20} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-text p-1 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-bg z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-500 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "font-display text-3xl font-medium tracking-tight",
              pathname.startsWith(link.href) ? "text-accent" : "text-text"
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Nav;
