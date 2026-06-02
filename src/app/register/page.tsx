'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UserCheck, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

export default function Register() {
  const { lang, t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    branch: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dueDate, setDueDate] = useState<string | null>(null);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side Validations using bilingual prompts
    if (!formData.firstName.trim()) {
      setError(lang === 'en' ? "First Name is required." : "სახელი სავალდებულოა.");
      return;
    }
    if (!formData.lastName.trim()) {
      setError(lang === 'en' ? "Last Name is required." : "გვარი სავალდებულოა.");
      return;
    }
    if (!formData.phone.trim()) {
      setError(lang === 'en' ? "Phone Number is required." : "ტელეფონის ნომერი სავალდებულოა.");
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError(lang === 'en' ? "Please enter a valid Phone Number (e.g. +995 555 12 34 56)." : "გთხოვთ შეიყვანოთ სწორი ნომერი (მაგ. +995 555 12 34 56).");
      return;
    }
    if (formData.email && !validateEmail(formData.email)) {
      setError(lang === 'en' ? "Please enter a valid Email Address." : "გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა.");
      return;
    }
    if (!formData.branch) {
      setError(lang === 'en' ? "Please select a branch." : "გთხოვთ აირჩიოთ ფილიალი.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (lang === 'en' ? 'Something went wrong.' : 'რეგისტრაცია ვერ მოხერხდა.'));
      }

      setSuccess(true);
      if (data.user?.nextPaymentDueDate) {
        const locale = lang === 'en' ? 'en-US' : 'ka-GE';
        const formattedDate = new Date(data.user.nextPaymentDueDate).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        setDueDate(formattedDate);
      }
    } catch (err: any) {
      setError(err.message || (lang === 'en' ? 'Server connection failed.' : 'სერვერთან კავშირი ვერ მოხერხდა.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-b from-background via-[#fafaf7] to-background relative overflow-hidden">
        {/* Ambient Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-xl relative z-10">
          <div className="glass-panel rounded-3xl shadow-xl overflow-hidden border border-border/80">
            
            {/* Header portion */}
            <div className="bg-primary text-primary-foreground p-8 text-center space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
              <div className="inline-flex bg-white/10 p-2.5 rounded-full text-accent mb-2">
                <UserCheck className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-serif font-bold tracking-tight">{t('becomeMember')}</h1>
              <p className="text-primary-foreground/80 text-sm font-light">
                {t('joinSanctuary')}
              </p>
            </div>

            {/* Body portion */}
            <div className="p-8 bg-white/40">
              {success ? (
                <div className="text-center py-8 space-y-6 animate-fade-in">
                  <div className="inline-flex bg-[#7d9a8b]/15 text-primary p-4 rounded-full">
                    <CheckCircle2 className="h-12 w-12 text-[#7d9a8b]" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-primary">{t('regComplete')}</h2>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      {t('welcomeMsg', { name: formData.firstName })}
                    </p>
                  </div>
                  
                  {dueDate && (
                    <div className="bg-[#fafaf7] border border-border rounded-2xl p-5 max-w-md mx-auto space-y-1">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        {t('firstPaymentDue')}
                      </div>
                      <div className="text-lg font-serif font-bold text-primary">{dueDate}</div>
                      <div className="text-[10px] text-muted-foreground pt-1.5">
                        {t('smsReminderNotice', { phone: formData.phone })}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/"
                      className="bg-primary hover:bg-primary/95 text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm transition-all"
                    >
                      {t('returnHome')}
                    </Link>
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setFormData({ firstName: '', lastName: '', phone: '', email: '', branch: '' });
                        setError(null);
                      }}
                      className="border border-primary/20 hover:bg-white/95 px-6 py-3 rounded-full font-semibold text-sm text-primary transition-all"
                    >
                      {t('registerAnother')}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('firstName')} <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        placeholder="e.g. Elena"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full rounded-xl border border-input bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all animate-fade-in"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('lastName')} <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        placeholder="e.g. Kipiani"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full rounded-xl border border-input bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('phoneNumber')} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="e.g. +995 555 12 34 56"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-input bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('emailOptional')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="e.g. elena@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-input bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Branch Select */}
                  <div className="space-y-1.5">
                    <label htmlFor="branch" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('studioBranch')} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="branch"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full rounded-xl border border-input bg-white px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        required
                      >
                        <option value="" disabled>{t('selectBranch')}</option>
                        <option value="Khashuri">{lang === 'en' ? 'Khashuri Studio' : 'ხაშურის სტუდია'}</option>
                        <option value="Borjomi">{lang === 'en' ? 'Borjomi Studio' : 'ბორჯომის სტუდია'}</option>
                        <option value="Akhaltsikhe">{lang === 'en' ? 'Akhaltsikhe Studio' : 'ახალციხის სტუდია'}</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Submission Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t('submitting')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-accent" />
                        {t('submitReg')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
