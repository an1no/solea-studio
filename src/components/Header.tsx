'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Leaf, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 glass-panel shadow-sm border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-full transition-transform group-hover:rotate-12 duration-300">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-2xl tracking-wide font-semibold text-primary transition-colors group-hover:text-accent duration-300">
                SOLEA
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] block text-muted-foreground font-medium -mt-1">
                {lang === 'en' ? 'Studio' : 'სტუდია'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#about" className="text-sm font-medium text-foreground/80 hover:text-primary hover:translate-y-[-1px] transition-all">
              {t('about')}
            </Link>
            <Link href="/#schedule" className="text-sm font-medium text-foreground/80 hover:text-primary hover:translate-y-[-1px] transition-all">
              {t('schedule')}
            </Link>
            <Link href="/#branches" className="text-sm font-medium text-foreground/80 hover:text-primary hover:translate-y-[-1px] transition-all">
              {t('branches')}
            </Link>
            <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary hover:translate-y-[-1px] transition-all flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {t('adminPortal')}
            </Link>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-semibold bg-secondary hover:bg-primary/5 border border-primary/10 text-primary px-3.5 py-1.5 rounded-full transition-all"
            >
              <Globe className="h-3.5 w-3.5 text-accent" />
              {lang === 'en' ? 'ქარ' : 'EN'}
            </button>

            <Link
              href="/register"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              {t('joinUs')}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-xs font-semibold bg-secondary text-primary px-3 py-1.5 rounded-full"
            >
              <Globe className="h-3.5 w-3.5 text-accent" />
              {lang === 'en' ? 'ქარ' : 'EN'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-accent hover:bg-secondary/60 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in bg-background/95 border-b border-border px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/#about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:bg-secondary/60 hover:text-primary transition-all"
          >
            {t('about')}
          </Link>
          <Link
            href="/#schedule"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:bg-secondary/60 hover:text-primary transition-all"
          >
            {t('schedule')}
          </Link>
          <Link
            href="/#branches"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:bg-secondary/60 hover:text-primary transition-all"
          >
            {t('branches')}
          </Link>
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-secondary/60 hover:text-primary transition-all"
          >
            {t('adminPortal')}
          </Link>
          <div className="pt-2">
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-full transition-all"
            >
              {t('joinUs')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
