'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/hooks/useLanguage';
import { Sparkles, Compass, Heart, Wind, Calendar, MapPin, ArrowRight, UserCheck } from 'lucide-react';

export default function Home() {
  const { lang, t } = useLanguage();

  const classes = [
    { 
      name: lang === 'en' ? "Vinyasa Flow" : "ვინიასა ფლოუ", 
      duration: lang === 'en' ? "60 mins" : "60 წთ", 
      level: t('allLevels'), 
      description: lang === 'en' 
        ? "A dynamic practice connecting breath to movement, building heat, flexibility, and presence." 
        : "დინამიკური პრაქტიკა, რომელიც აერთიანებს სუნთქვასა და მოძრაობას, ავითარებს მოქნილობასა და კონცენტრაციას.", 
      time: "09:00 - 10:00" 
    },
    { 
      name: lang === 'en' ? "Hatha & Meditation" : "ჰათჰა და მედიტაცია", 
      duration: lang === 'en' ? "75 mins" : "75 წთ", 
      level: t('beginnerFriendly'), 
      description: lang === 'en' 
        ? "Gentle classical postures followed by guided mindfulness to ground your nervous system." 
        : "ნაზი კლასიკური პოზები და მართული მედიტაცია ნერვული სისტემის სრული აღდგენისა და დამშვიდებისთვის.", 
      time: "11:00 - 12:15" 
    },
    { 
      name: lang === 'en' ? "Yin Yoga" : "ინ იოგა", 
      duration: lang === 'en' ? "90 mins" : "90 წთ", 
      level: t('allLevels'), 
      description: lang === 'en' 
        ? "Deeply restorative floor postures held for longer durations to release deep fascial tension." 
        : "ღრმად აღმდგენი ვარჯიშები იატაკზე, რომელიც ხანგრძლივად სრულდება ღრმა დაჭიმულობისა და სტრესის მოსახსნელად.", 
      time: "18:00 - 19:30" 
    },
    { 
      name: lang === 'en' ? "Ashtanga Primary" : "აშტანგა იოგა", 
      duration: lang === 'en' ? "75 mins" : "75 წთ", 
      level: t('intermediate'), 
      description: lang === 'en' 
        ? "A structured, energetic sequence emphasizing focus, strength, and rhythmic breathing." 
        : "სტრუქტურირებული და ენერგიული სავარჯიშოების თანმიმდევრობა, რომელიც ხელს უწყობს ძალასა და რიტმულ სუნთქვას.", 
      time: "19:45 - 21:00" 
    }
  ];

  const branches = [
    { 
      name: lang === 'en' ? "Borjomi" : "ბორჯომი", 
      desc: t('borjomiDesc'), 
      phone: "+995 555 12 34 57", 
      address: lang === 'en' ? "8 Rustaveli St." : "რუსთაველის ქ. 8" 
    },
    { 
      name: lang === 'en' ? "Khashuri" : "ხაშური", 
      desc: t('khashuriDesc'), 
      phone: "+995 555 12 34 56", 
      address: lang === 'en' ? "14 Rustaveli St." : "რუსთაველის ქ. 14" 
    },
    { 
      name: lang === 'en' ? "Akhaltsikhe" : "ახალციხე", 
      desc: t('akhaltsikheDesc'), 
      phone: "+995 555 12 34 58", 
      address: lang === 'en' ? "22 Tamar Mepe St." : "თამარ მეფის ქ. 22" 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f6f2] via-background to-background py-20 lg:py-32">
          {/* Decorative Background Elements */}
          <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#7d9a8b]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-1/10 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-secondary/80 text-primary border border-primary/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase animate-fade-in">
                <Sparkles className="h-3.5 w-3.5 text-accent animate-spin-slow" />
                {t('experiencePremium')}
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-primary tracking-tight leading-tight animate-slide-up">
                {t('heroTitleLine1')} <br />
                <span className="text-accent italic font-normal">{t('heroTitleLine2')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                {t('heroDesc')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] text-center flex items-center justify-center gap-2"
                >
                  <UserCheck className="h-5 w-5" />
                  {t('becomeMemberToday')}
                </Link>
                <Link
                  href="/#about"
                  className="w-full sm:w-auto border border-primary/20 bg-white/40 hover:bg-white/90 text-primary font-semibold px-8 py-4 rounded-full transition-all duration-300 text-center flex items-center justify-center gap-2"
                >
                  {t('exploreStudio')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CORE VALUES / ABOUT */}
        <section id="about" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="space-y-6">
                <h2 className="text-sm font-semibold tracking-[0.2em] text-accent uppercase font-sans">
                  {t('philosophyTitle')}
                </h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">
                  {t('philosophyHeadline')}
                </h3>
                <p className="text-muted-foreground text-md leading-relaxed font-light">
                  {t('philosophyDesc1')}
                </p>
                <p className="text-muted-foreground text-md leading-relaxed font-light">
                  {t('philosophyDesc2')}
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="flex gap-3">
                    <div className="bg-[#7d9a8b]/15 p-3 rounded-xl h-fit">
                      <Compass className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary font-sans">{t('alignedMind')}</h4>
                      <p className="text-xs text-muted-foreground font-light">{t('alignedMindDesc')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-[#c4a470]/15 p-3 rounded-xl h-fit">
                      <Heart className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary font-sans">{t('holisticVigor')}</h4>
                      <p className="text-xs text-muted-foreground font-light">{t('holisticVigorDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Feature Box */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-3xl blur-2xl transform rotate-3" />
                <div className="relative bg-gradient-to-br from-primary to-[#1c2e26] rounded-3xl p-10 text-primary-foreground shadow-2xl space-y-8 flex flex-col justify-between min-h-[400px]">
                  <div className="flex justify-between items-start">
                    <Wind className="h-10 w-10 text-accent animate-pulse" />
                    <span className="text-xs bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest font-mono text-accent">
                      {t('activeAir')}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <blockquote className="text-xl sm:text-2xl font-serif italic text-accent-foreground/90 font-light leading-relaxed">
                      {t('quoteText')}
                    </blockquote>
                    <p className="text-xs font-semibold tracking-wider text-primary-foreground/60 uppercase">
                      {t('quoteAuthor')}
                    </p>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs text-primary-foreground/80 font-medium">
                    <span>{t('uniqueBranches')}</span>
                    <span>{t('eliteCoaches')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CLASS SCHEDULE */}
        <section id="schedule" className="py-24 bg-[#fafaf7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-sm font-semibold tracking-[0.2em] text-accent uppercase font-sans">
                {t('curatedSessions')}
              </h2>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-primary">
                {t('weeklyExperiences')}
              </h3>
              <p className="text-muted-foreground font-light">
                {t('scheduleDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {classes.map((cls, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-2xl font-bold text-primary">{cls.name}</h4>
                      <span className="text-xs bg-secondary text-primary px-3 py-1 rounded-full font-semibold">
                        {cls.level}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed">
                      {cls.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border/40 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Calendar className="h-4 w-4 text-accent" />
                      {cls.time}
                    </span>
                    <span className="font-semibold text-primary">{cls.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BRANCHES SECTION */}
        <section id="branches" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-sm font-semibold tracking-[0.2em] text-accent uppercase font-sans">
                {t('regionalPresence')}
              </h2>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-primary">
                {t('elegantBranches')}
              </h3>
              <p className="text-muted-foreground font-light">
                {t('branchesDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {branches.map((br, idx) => (
                <div key={idx} className="bg-gradient-to-b from-white to-[#fafaf7] rounded-3xl p-8 border border-border/88 shadow-sm flex flex-col justify-between min-h-[300px] hover:shadow-lg transition-all duration-300">
                  <div className="space-y-4">
                    <div className="bg-primary/5 text-primary p-3 rounded-full w-fit">
                      <MapPin className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-serif text-2xl font-semibold text-primary">
                      {br.name} {lang === 'en' ? 'Branch' : 'ფილიალი'}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">
                      {br.desc}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-border/60 space-y-1.5">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('address')}</div>
                    <div className="text-sm font-medium text-primary">{br.address}</div>
                    <div className="text-xs text-muted-foreground">{t('phone')}: {br.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
