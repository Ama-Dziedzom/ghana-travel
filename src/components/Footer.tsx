import Link from "next/link";
import { Instagram, Pin as Pinterest } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg border-t border-border pt-16 pb-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand & Tagline */}
        <div className="md:col-span-2">
          <Link href="/" className="inline-block mb-4">
            <span className="font-display text-2xl font-bold tracking-tight text-text">
              Ghana<span className="text-accent italic">.</span>
            </span>
          </Link>
          <p className="font-body text-muted max-w-sm text-sm leading-relaxed">
            A clean, minimal editorial travel website about Ghana covering culture, food, people, and travel itineraries. Celebrating the ordinary alongside the iconic.
          </p>
          <div className="flex items-center space-x-5 mt-8">
            <a href="https://www.instagram.com/theghanagirl00?igsh=MW9wcms2aGpzdHh5NA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://www.tiktok.com/@ghanagirl001?_r=1&_t=ZS-95ixyQyABsa" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
              </svg>
            </a>
            <a href="#" className="text-muted hover:text-accent transition-colors">
              <Pinterest size={20} />
            </a>
          </div>
        </div>

        {/* Links Group 1 */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-6">Explore</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/explore" className="font-body text-sm text-muted hover:text-text transition-colors">Articles</Link>
            </li>
            <li>
              <Link href="/taste" className="font-body text-sm text-muted hover:text-text transition-colors">Recipes</Link>
            </li>
            <li>
              <Link href="/itineraries" className="font-body text-sm text-muted hover:text-text transition-colors">Itineraries</Link>
            </li>
          </ul>
        </div>

        {/* Links Group 2 */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-6">Support</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/travel-tips" className="font-body text-sm text-muted hover:text-text transition-colors">Travel Tips</Link>
            </li>
            <li>
              <Link href="/about" className="font-body text-sm text-muted hover:text-text transition-colors">About Us</Link>
            </li>
            <li>
              <Link href="/contact" className="font-body text-sm text-muted hover:text-text transition-colors">Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="font-body text-xs text-muted tracking-wide">
          © {currentYear} GHANA TRAVEL BLOG. ALL RIGHTS RESERVED.
        </p>
        <p className="font-body text-xs text-muted italic tracking-wide">
          Ghana first.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
