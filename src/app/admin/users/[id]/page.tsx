'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { getPaymentStatus } from '@/lib/status';
import LogPaymentModal from '@/components/LogPaymentModal';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Receipt, Loader2, AlertCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function UserDetailsPage({ params }: PageProps) {
  const { lang, t } = useLanguage();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Unify parameter resolution across Next.js 14 and 15
  useEffect(() => {
    Promise.resolve(params).then((resolved) => {
      setUserId(resolved.id);
    });
  }, [params]);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/members?id=${userId}`);
      const json = await res.json();
      if (json.success && json.user) {
        setUser(json.user);
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#7d9a8b]" />
        <p className="text-sm text-muted-foreground font-light">
          {lang === 'en' ? 'Fetching student parameters...' : 'მიმდინარეობს წევრის მონაცემების ჩატვირთვა...'}
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h3 className="font-serif text-xl font-bold text-primary">
          {lang === 'en' ? 'Member Not Found' : 'წევრი ვერ მოიძებნა'}
        </h3>
        <p className="text-sm text-muted-foreground font-light max-w-xs mx-auto">
          {lang === 'en' ? 'The requested student ID is missing or database disconnected.' : 'მოთხოვნილი წევრი არ არსებობს ან ბაზა გათიშულია.'}
        </p>
        <Link
          href="/admin/users"
          className="text-xs bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl inline-block transition-all"
        >
          {t('backToUsers')}
        </Link>
      </div>
    );
  }

  const statusObj = getPaymentStatus(user.nextPaymentDueDate);
  
  const formattedRegDate = new Date(user.registrationDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ka-GE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedDueDate = new Date(user.nextPaymentDueDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ka-GE', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Back Link Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/users"
          className="text-xs text-muted-foreground hover:text-primary font-semibold flex items-center gap-1 bg-white border border-border px-3.5 py-2 rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('backToUsers')}
        </Link>
      </div>

      {/* CORE PROFILE HERO CARD */}
      <div className="bg-white border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar Icon */}
          <div className="bg-primary/5 text-primary p-5 rounded-2xl border border-primary/10">
            <User className="h-10 w-10 text-accent" />
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-serif font-bold text-primary animate-fade-in">
                {user.firstName} {user.lastName}
              </h1>
              <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${statusObj.bgClass} ${statusObj.colorClass}`}>
                {lang === 'en' 
                  ? statusObj.status 
                  : (statusObj.status === 'Active' ? 'აქტიური' : statusObj.status === 'Due' ? 'გადასახდელი' : 'ვადაგადაცილებული')}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {user.branch === 'Borjomi' && (lang === 'en' ? 'Borjomi' : 'ბორჯომი')}
                {user.branch === 'Khashuri' && (lang === 'en' ? 'Khashuri' : 'ხაშური')}
                {user.branch === 'Akhaltsikhe' && (lang === 'en' ? 'Akhaltsikhe' : 'ახალციხე')} {lang === 'en' ? 'Branch' : 'ფილიალი'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {lang === 'en' ? 'Joined' : 'გაწევრიანდა'} {formattedRegDate}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Payment logging trigger */}
        <LogPaymentModal userId={user.id} userName={`${user.firstName} ${user.lastName}`} />
      </div>

      {/* DETAILED INFORMATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact and Account Summary */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm space-y-6 h-fit animate-fade-in">
          <h3 className="font-serif text-lg font-bold text-primary pb-3 border-b border-border/60">
            {t('profileParameters')}
          </h3>

          <div className="space-y-4">
            
            {/* Phone */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">{t('phoneNumber')}</span>
              <span className="text-sm font-semibold text-primary flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                {user.phone}
              </span>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">{t('emailAddr')}</span>
              <span className="text-sm font-semibold text-primary flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                {user.email || <em className="text-muted-foreground/40 font-light">{t('noneProvided')}</em>}
              </span>
            </div>

            {/* Next Due date info */}
            <div className="bg-[#fafaf7] p-4 rounded-2xl border border-border space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">{t('nextDue')}</span>
              <span className="text-md font-serif font-bold text-primary flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-accent" />
                {formattedDueDate}
              </span>
              <p className="text-[10px] text-muted-foreground font-light pt-1">
                {t('nextPaymentNotice')}
              </p>
            </div>

          </div>
        </div>

        {/* PAYMENT HISTORY LOG */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-border/60">
            <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
              <Receipt className="h-5 w-5 text-accent" />
              {t('paymentHistoryLog')}
            </h3>
            <span className="text-xs bg-secondary text-primary px-3 py-1 rounded-full font-semibold">
              {user.payments?.length || 0} {t('recordsCount')}
            </span>
          </div>

          {!user.payments || user.payments.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground text-sm font-light leading-relaxed">
              {t('noPaymentsLogged')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
                    <th className="py-2.5 font-semibold">{t('transactionDate')}</th>
                    <th className="py-2.5 font-semibold">{t('amountPaid')}</th>
                    <th className="py-2.5 font-semibold">{t('notesDetails')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {user.payments.map((payment: any) => {
                    const formattedPaymentDate = new Date(payment.paymentDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ka-GE', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <tr key={payment.id} className="hover:bg-[#fafaf7]/50 transition-colors">
                        <td className="py-3.5 text-xs text-muted-foreground">
                          {formattedPaymentDate}
                        </td>
                        <td className="py-3.5 font-semibold text-primary font-mono text-sm">
                          {payment.amount.toFixed(2)} GEL
                        </td>
                        <td className="py-3.5 text-muted-foreground text-xs leading-relaxed max-w-xs truncate">
                          {payment.notes || <em className="text-muted-foreground/30">—</em>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
