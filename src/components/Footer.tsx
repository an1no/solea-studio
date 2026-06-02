'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand block */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary-foreground text-primary p-1.5 rounded-full">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="font-serif text-xl tracking-wide font-semibold">SOLEA STUDIO</span>
            </Link>
            <p className="text-primary-foreground/70 max-w-sm text-sm leading-relaxed font-light">
              {lang === 'en' 
                ? "Elevating minds and restoring bodies in harmony with nature. Experience state-of-the-art holistic wellness in Georgia's most beautiful regions."
                : "გონების ამაღლება და სხეულის აღდგენა ბუნებასთან ჰარმონიაში. გამოსცადე თანამედროვე ჰოლისტიკური ველნესი საქართველოს ულამაზეს რეგიონებში."}
            </p>
            <div className="pt-2 text-xs text-accent/80 font-medium tracking-wide">
              © {new Date().getFullYear()} Solea Studio.
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-medium text-accent">{lang === 'en' ? 'Studio Sections' : 'განყოფილებები'}</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/75 font-light">
              <li>
                <Link href="/#about" className="hover:text-white hover:underline underline-offset-4 transition-colors">{t('about')}</Link>
              </li>
              <li>
                <Link href="/#schedule" className="hover:text-white hover:underline underline-offset-4 transition-colors">{t('schedule')}</Link>
              </li>
              <li>
                <Link href="/#branches" className="hover:text-white hover:underline underline-offset-4 transition-colors">{t('branches')}</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white hover:underline underline-offset-4 transition-colors font-medium text-accent/90">{t('joinUs')}</Link>
              </li>
            </ul>
          </div>

          {/* Branch coordinates */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-medium text-accent">{lang === 'en' ? 'Contact & Locations' : 'კონტაქტი და მისამართები'}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/75 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'en' ? 'Khashuri' : 'ხაშური'}</strong>: {lang === 'en' ? '14 Rustaveli St.' : 'რუსთაველის ქ. 14'}<br />
                  <strong>{lang === 'en' ? 'Borjomi' : 'ბორჯომი'}</strong>: {lang === 'en' ? '8 Rustaveli St.' : 'რუსთაველის ქ. 8'}<br />
                  <strong>{lang === 'en' ? 'Akhaltsikhe' : 'ახალციხე'}</strong>: {lang === 'en' ? '22 Tamar Mepe St.' : 'თამარ მეფის ქ. 22'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent" />
                <a href="tel:+995555123456" className="hover:text-white transition-colors">+995 555 12 34 56</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:hello@soleastudio.ge" className="hover:text-white transition-colors font-mono">hello@soleastudio.ge</a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
