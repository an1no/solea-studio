'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, LayoutDashboard, Users, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen flex bg-[#f7f8f6]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-primary text-primary-foreground border-r border-primary/20 flex flex-col justify-between hidden md:flex">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white/10 p-2 rounded-full">
              <Leaf className="h-5 w-5 text-accent" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-wide font-semibold text-white">
                SOLEA
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] block text-accent/80 font-medium">
                {lang === 'en' ? 'Admin Portal' : 'ადმინისტრაცია'}
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="space-y-1.5">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-sm font-medium transition-all"
            >
              <LayoutDashboard className="h-4 w-4 text-accent" />
              {lang === 'en' ? 'Dashboard Home' : 'მთავარი პანელი'}
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-sm font-medium transition-all"
            >
              <Users className="h-4 w-4 text-accent" />
              {lang === 'en' ? 'Manage Members' : 'წევრების მართვა'}
            </Link>
          </nav>
        </div>

        {/* Bottom portion */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-xs bg-white/5 p-3 rounded-xl">
            <ShieldAlert className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="text-primary-foreground/75 leading-tight">
              {lang === 'en' ? 'Secure Admin Session' : 'უსაფრთხო სესია'}
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-primary-foreground/70 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('backToHome')}
          </Link>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-border px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <Link href="/admin" className="flex items-center gap-1.5 font-serif font-bold text-primary">
              <Leaf className="h-4 w-4 text-accent" />
              {lang === 'en' ? 'Solea Admin' : 'სოლეა ადმინ'}
            </Link>
          </div>
          
          <div className="flex gap-4 md:hidden text-xs">
            <Link href="/admin" className="font-semibold text-primary">{lang === 'en' ? 'Dashboard' : 'პანელი'}</Link>
            <Link href="/admin/users" className="font-semibold text-primary">{lang === 'en' ? 'Members' : 'წევრები'}</Link>
            <Link href="/" className="text-muted-foreground">{t('exit')}</Link>
          </div>

          <div className="hidden md:block text-xs text-muted-foreground font-medium">
            {lang === 'en' ? 'Studio Branches: ' : 'სტუდიის ფილიალები: '}
            <strong className="text-primary">{lang === 'en' ? 'Khashuri' : 'ხაშური'}</strong> |{' '}
            <strong className="text-primary">{lang === 'en' ? 'Borjomi' : 'ბორჯომი'}</strong> |{' '}
            <strong className="text-primary">{lang === 'en' ? 'Akhaltsikhe' : 'ახალციხე'}</strong>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent-foreground font-serif font-bold text-xs flex items-center justify-center">
              AD
            </div>
            <div className="hidden sm:block text-left text-xs">
              <div className="font-semibold text-primary">{lang === 'en' ? 'Solea Admin' : 'სოლეა ადმინი'}</div>
              <div className="text-muted-foreground text-[10px]">{lang === 'en' ? 'Super Administrator' : 'ადმინისტრატორი'}</div>
            </div>
          </div>
        </header>

        {/* VIEW BODY */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
