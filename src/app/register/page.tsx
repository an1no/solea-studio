'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { UserCheck, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Register() {
  const { lang, t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    branch: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dueDate, setDueDate] = useState<string | null>(null);

  const validatePhone = (phone: string) =>
    /^\+?[0-9\s\-]{7,15}$/.test(phone);

  const validateEmail = (email: string) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim()) {
      setError(lang === 'en' ? 'First Name is required.' : 'სახელი სავალდებულოა.');
      return;
    }
    if (!formData.lastName.trim()) {
      setError(lang === 'en' ? 'Last Name is required.' : 'გვარი სავალდებულოა.');
      return;
    }
    if (!formData.phone.trim()) {
      setError(lang === 'en' ? 'Phone Number is required.' : 'ტელეფონის ნომერი სავალდებულოა.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError(
        lang === 'en'
          ? 'Please enter a valid Phone Number (e.g. +995 555 12 34 56).'
          : 'გთხოვთ შეიყვანოთ სწორი ნომერი (მაგ. +995 555 12 34 56).'
      );
      return;
    }
    if (formData.email && !validateEmail(formData.email)) {
      setError(
        lang === 'en'
          ? 'Please enter a valid Email Address.'
          : 'გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა.'
      );
      return;
    }
    if (!formData.branch) {
      setError(
        lang === 'en' ? 'Please select a branch.' : 'გთხოვთ აირჩიოთ ფილიალი.'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (lang === 'en' ? 'Something went wrong.' : 'რეგისტრაცია ვერ მოხერხდა.')
        );
      }

      setSuccess(true);
      if (data.user?.nextPaymentDueDate) {
        const locale = lang === 'en' ? 'en-US' : 'ka-GE';
        setDueDate(
          new Date(data.user.nextPaymentDueDate).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        );
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : lang === 'en'
          ? 'Server connection failed.'
          : 'სერვერთან კავშირი ვერ მოხერხდა.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-b from-background via-[#fafaf7] to-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-xl relative z-10">
          <div className="glass-panel rounded-3xl shadow-xl overflow-hidden border border-border/80">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-8 text-center space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
              <div className="inline-flex bg-white/10 p-2.5 rounded-full text-accent mb-2">
                <UserCheck className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-serif font-bold tracking-tight">
                {t('becomeMember')}
              </h1>
              <p className="text-primary-foreground/80 text-sm font-light">
                {t('joinSanctuary')}
              </p>
            </div>

            {/* Body */}
            <div className="p-8 bg-white/40">
              {success ? (
                <div className="text-center py-8 space-y-6 animate-fade-in">
                  <div className="inline-flex bg-[#7d9a8b]/15 text-primary p-4 rounded-full">
                    <CheckCircle2 className="h-12 w-12 text-[#7d9a8b]" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-primary">
                      {t('regComplete')}
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      {t('welcomeMsg', { name: formData.firstName })}
                    </p>
                  </div>

                  {dueDate && (
                    <div className="bg-[#fafaf7] border border-border rounded-2xl p-5 max-w-md mx-auto space-y-1">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        {t('firstPaymentDue')}
                      </div>
                      <div className="text-lg font-serif font-bold text-primary">
                        {dueDate}
                      </div>
                      <div className="text-[10px] text-muted-foreground pt-1.5">
                        {t('smsReminderNotice', { phone: formData.phone })}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild size="lg" className="rounded-full">
                      <Link href="/">{t('returnHome')}</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full"
                      onClick={() => {
                        setSuccess(false);
                        setFormData({
                          firstName: '',
                          lastName: '',
                          phone: '',
                          email: '',
                          branch: '',
                        });
                        setError(null);
                      }}
                    >
                      {t('registerAnother')}
                    </Button>
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
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName">
                        {t('firstName')} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="e.g. Elena"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="lastName">
                        {t('lastName')} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="e.g. Kipiani"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">
                      {t('phoneNumber')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g. +995 555 12 34 56"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">{t('emailOptional')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. elena@gmail.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="branch">
                      {t('studioBranch')} <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.branch || undefined}
                      onValueChange={(v) =>
                        setFormData({ ...formData, branch: v })
                      }
                    >
                      <SelectTrigger id="branch" className="rounded-xl h-[46px]">
                        <SelectValue placeholder={t('selectBranch')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Khashuri">
                          {lang === 'en' ? 'Khashuri Studio' : 'ხაშურის სტუდია'}
                        </SelectItem>
                        <SelectItem value="Borjomi">
                          {lang === 'en' ? 'Borjomi Studio' : 'ბორჯომის სტუდია'}
                        </SelectItem>
                        <SelectItem value="Akhaltsikhe">
                          {lang === 'en'
                            ? 'Akhaltsikhe Studio'
                            : 'ახალციხის სტუდია'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full rounded-xl"
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
                  </Button>
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
