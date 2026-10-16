'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Referral Levels', href: '/#levels' },
    { name: 'Surveys', href: '/surveys', badge: 'NEW', isHighlighted: true },
    { name: 'Chat & Earn', href: '/chat', badge: 'HOT', isHighlighted: true },
    { name: 'Calculator', href: '/#calculator' },
    { name: 'FAQs', href: '/#faqs' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0B1326]/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Earn<span className="text-emerald-400">Easy</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    active ? 'text-emerald-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full animate-pulse ${
                      link.badge === 'HOT'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-all">
              Login
            </Link>
            <Link href="/register" className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-[0.98] transition-all">
              Get Started / Register
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2" aria-label="Toggle menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0B1326] border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between py-2 text-base font-medium text-slate-200 hover:text-emerald-400"
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  link.badge === 'HOT'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link href="/login" className="w-full text-center py-2.5 rounded-lg border border-white/10 text-white font-medium">
              Login
            </Link>
            <Link href="/register" className="w-full text-center py-2.5 rounded-lg bg-emerald-500 text-white font-semibold">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}