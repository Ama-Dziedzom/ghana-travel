import Link from "next/link";
import { Instagram, Twitter, Pin as Pinterest } from "lucide-react";

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
            <a href="#" className="text-muted hover:text-accent transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-muted hover:text-accent transition-colors">
              <Twitter size={20} />
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
