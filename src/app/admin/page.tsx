'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { getPaymentStatus } from '@/lib/status';
import { Users, AlertCircle, CalendarClock, UserPlus, Sparkles, MapPin, Layers, Database, Loader2 } from 'lucide-react';
import SeedButton from '@/components/SeedButton';

export default function AdminDashboard() {
  const { lang, t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetchData();
    // Re-fetch on custom refresh events (e.g. after seeding)
    window.addEventListener('languagechange', () => {});
    return () => {};
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/members');
      const json = await res.json();
      if (json.success) {
        setData(json);
        setDbError(false);
      } else {
        setDbError(true);
      }
    } catch (err) {
      setDbError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#7d9a8b]" />
        <p className="text-sm text-muted-foreground font-light">
          {lang === 'en' ? 'Synchronizing dashboard metrics...' : 'მონაცემები სინქრონიზდება...'}
        </p>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalCount = data?.stats?.totalCount || 0;
  const activeCount = data?.stats?.activeCount || 0;
  const dueCount = data?.stats?.dueCount || 0;
  const overdueCount = data?.stats?.overdueCount || 0;

  // Filter 5 most recent registrations
  const recentUsers = data?.users 
    ? [...data.users]
        .sort((a: any, b: any) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
        .slice(0, 5)
    : [];

  const borjomiCount = data?.branches?.Borjomi || 0;
  const khashuriCount = data?.branches?.Khashuri || 0;
  const akhaltsikheCount = data?.branches?.Akhaltsikhe || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">{t('dashboardOverview')}</h1>
          <p className="text-muted-foreground text-sm font-light">
            {t('insightsDesc')}
          </p>
        </div>

        {!dbError && totalCount === 0 && (
          <div className="glass-panel border-accent/30 p-4 rounded-2xl flex items-center gap-4 gold-glow">
            <div className="text-xs">
              <span className="font-semibold text-primary block">{t('databaseEmpty')}</span>
              <span className="text-muted-foreground">{t('populateMock')}</span>
            </div>
            <SeedButton />
          </div>
        )}
      </div>

      {/* Connection error banner */}
      {dbError && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 md:p-8 space-y-5 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 text-amber-800 p-3 rounded-2xl">
              <Database className="h-6 w-6" />
            </div>
            <div className="space-y-1.5 flex-grow">
              <h3 className="font-serif text-lg font-bold text-amber-900">
                {lang === 'en' ? 'Database Connection Required' : 'საჭიროა მონაცემთა ბაზა'}
              </h3>
              <p className="text-xs text-amber-800/80 leading-relaxed max-w-2xl font-light">
                {lang === 'en'
                  ? "The Solea Portal is offline because Next.js could not connect to the PostgreSQL database."
                  : "სოლეას ადმინისტრაციული პანელი ოფლაინ რეჟიმშია, რადგან სისტემა ვერ უკავშირდება PostgreSQL მონაცემთა ბაზას."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Members */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('totalMembers')}</span>
            <h3 className="text-3xl font-serif font-bold text-primary">{dbError ? '—' : totalCount}</h3>
            <span className="text-[10px] text-muted-foreground block">{t('registeredStudents')}</span>
          </div>
          <div className="bg-primary/5 p-4 rounded-full text-primary">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('activeMembers')}</span>
            <h3 className="text-3xl font-serif font-bold text-[#7d9a8b]">{dbError ? '—' : activeCount}</h3>
            <span className="text-[10px] text-muted-foreground block">{t('currentInStatus')}</span>
          </div>
          <div className="bg-[#7d9a8b]/10 p-4 rounded-full text-[#7d9a8b]">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Due Payments */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('dueMembers')}</span>
            <h3 className="text-3xl font-serif font-bold text-accent-foreground">{dbError ? '—' : dueCount}</h3>
            <span className="text-[10px] text-muted-foreground block">{t('remindersScheduled')}</span>
          </div>
          <div className="bg-accent/15 p-4 rounded-full text-accent-foreground">
            <CalendarClock className="h-6 w-6" />
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('overdueMembers')}</span>
            <h3 className="text-3xl font-serif font-bold text-destructive">{dbError ? '—' : overdueCount}</h3>
            <span className="text-[10px] text-muted-foreground block">{t('manualReview')}</span>
          </div>
          <div className="bg-destructive/10 p-4 rounded-full text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* DETAILED STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Members */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-border/60">
            <h4 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-accent" />
              {t('recentlyJoined')}
            </h4>
            {!dbError && (
              <Link
                href="/admin/users"
                className="text-xs text-primary hover:text-accent font-semibold flex items-center gap-1 transition-colors"
              >
                {t('manageAll')}
              </Link>
            )}
          </div>

          {dbError ? (
            <div className="text-center py-16 text-muted-foreground text-sm font-light space-y-2">
              <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
              <p>{lang === 'en' ? 'Database connection pending.' : 'მონაცემთა ბაზასთან კავშირი მოსალოდნელია.'}</p>
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm font-light">
              {t('noMembersFound')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
                    <th className="py-3 font-semibold">{t('member')}</th>
                    <th className="py-3 font-semibold">{t('studioBranch')}</th>
                    <th className="py-3 font-semibold">{t('registered')}</th>
                    <th className="py-3 font-semibold">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {recentUsers.map((user: any) => {
                    const statusObj = getPaymentStatus(user.nextPaymentDueDate);
                    const formattedRegDate = new Date(user.registrationDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ka-GE', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <tr key={user.id} className="hover:bg-[#fafaf7]/50 transition-colors group">
                        <td className="py-3.5 pr-2">
                          <Link href={`/admin/users/${user.id}`} className="font-medium text-primary hover:text-accent transition-colors block">
                            {user.firstName} {user.lastName}
                          </Link>
                          <span className="text-[10px] text-muted-foreground block font-mono">{user.phone}</span>
                        </td>
                        <td className="py-3.5 text-muted-foreground font-medium">
                          {user.branch === 'Borjomi' && (lang === 'en' ? 'Borjomi' : 'ბორჯომი')}
                          {user.branch === 'Khashuri' && (lang === 'en' ? 'Khashuri' : 'ხაშური')}
                          {user.branch === 'Akhaltsikhe' && (lang === 'en' ? 'Akhaltsikhe' : 'ახალციხე')}
                        </td>
                        <td className="py-3.5 text-xs text-muted-foreground">
                          {formattedRegDate}
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${statusObj.bgClass} ${statusObj.colorClass}`}>
                            {lang === 'en' 
                              ? statusObj.status 
                              : (statusObj.status === 'Active' ? 'აქტიური' : statusObj.status === 'Due' ? 'გადასახდელი' : 'ვადაგადაცილებული')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Branch breakdown */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-border/60">
            <h4 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
              <Layers className="h-5 w-5 text-accent" />
              {t('branchBreakdown')}
            </h4>
          </div>

          <div className="space-y-4">
            
            {/* Borjomi */}
            <div className="flex items-center justify-between p-4 bg-[#fafaf7] border border-border rounded-2xl">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-accent" />
                <span className="text-sm font-semibold text-primary">{lang === 'en' ? 'Borjomi Studio' : 'ბორჯომის სტუდია'}</span>
              </div>
              <span className="font-serif text-xl font-bold text-primary">{dbError ? '—' : borjomiCount}</span>
            </div>

            {/* Khashuri */}
            <div className="flex items-center justify-between p-4 bg-[#fafaf7] border border-border rounded-2xl">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-accent" />
                <span className="text-sm font-semibold text-primary">{lang === 'en' ? 'Khashuri Studio' : 'ხაშურის სტუდია'}</span>
              </div>
              <span className="font-serif text-xl font-bold text-primary">{dbError ? '—' : khashuriCount}</span>
            </div>

            {/* Akhaltsikhe */}
            <div className="flex items-center justify-between p-4 bg-[#fafaf7] border border-border rounded-2xl">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-accent" />
                <span className="text-sm font-semibold text-primary">{lang === 'en' ? 'Akhaltsikhe Studio' : 'ახალციხის სტუდია'}</span>
              </div>
              <span className="font-serif text-xl font-bold text-primary">{dbError ? '—' : akhaltsikheCount}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
