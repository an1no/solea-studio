'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { getPaymentStatus } from '@/lib/status';
import { useLanguage } from '@/hooks/useLanguage';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  branch: string;
  registrationDate: Date | string;
  nextPaymentDueDate: Date | string;
}

export default function UsersTable({ users }: { users: User[] }) {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Calculate lists and metrics
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const statusObj = getPaymentStatus(user.nextPaymentDueDate);
      
      const matchesSearch =
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBranch = !branchFilter || user.branch === branchFilter;
      const matchesStatus = !statusFilter || statusObj.status === statusFilter;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [users, searchTerm, branchFilter, statusFilter]);

  return (
    <div className="space-y-6">
      
      {/* FILTER BAR PANEL */}
      <div className="bg-white border border-border p-5 rounded-3xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-input bg-white pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex w-full md:w-auto gap-3 items-center">
          
          {/* Branch Select */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full md:w-48 rounded-2xl border border-input bg-white px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-medium"
            >
              <option value="">{t('allBranches')}</option>
              <option value="Borjomi">{lang === 'en' ? 'Borjomi' : 'ბორჯომი'}</option>
              <option value="Khashuri">{lang === 'en' ? 'Khashuri' : 'ხაშური'}</option>
              <option value="Akhaltsikhe">{lang === 'en' ? 'Akhaltsikhe' : 'ახალციხე'}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Status Select */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 rounded-2xl border border-input bg-white px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-medium"
            >
              <option value="">{t('allStatuses')}</option>
              <option value="Active">{lang === 'en' ? 'Active' : 'აქტიური'}</option>
              <option value="Due">{lang === 'en' ? 'Due' : 'გადასახდელი'}</option>
              <option value="Overdue">{lang === 'en' ? 'Overdue' : 'ვადაგადაცილებული'}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

        </div>

      </div>

      {/* MEMBERS DATA TABLE */}
      <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20 space-y-4 animate-fade-in">
            <div className="text-muted-foreground text-sm font-light">
              {t('noMatches')}
            </div>
            {(searchTerm || branchFilter || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setBranchFilter('');
                  setStatusFilter('');
                }}
                className="text-xs font-semibold text-primary underline underline-offset-4"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60 bg-[#fafaf7] px-6">
                  <th className="py-4 px-6 font-semibold">{t('fullName')}</th>
                  <th className="py-4 px-6 font-semibold">{t('phoneNumber')}</th>
                  <th className="py-4 px-6 font-semibold">{t('emailAddr')}</th>
                  <th className="py-4 px-6 font-semibold">{t('studioBranch')}</th>
                  <th className="py-4 px-6 font-semibold">{t('nextDue')}</th>
                  <th className="py-4 px-6 font-semibold">{t('status')}</th>
                  <th className="py-4 px-6 text-right font-semibold">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 animate-fade-in">
                {filteredUsers.map((user) => {
                  const statusObj = getPaymentStatus(user.nextPaymentDueDate);
                  const formattedDueDate = new Date(user.nextPaymentDueDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ka-GE', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr key={user.id} className="hover:bg-[#fafaf7]/40 transition-colors group">
                      {/* Name */}
                      <td className="py-4.5 px-6 font-medium text-primary">
                        <Link href={`/admin/users/${user.id}`} className="hover:text-accent transition-colors">
                          {user.firstName} {user.lastName}
                        </Link>
                      </td>
                      
                      {/* Phone */}
                      <td className="py-4.5 px-6 text-muted-foreground font-mono text-xs">{user.phone}</td>
                      
                      {/* Email */}
                      <td className="py-4.5 px-6 text-muted-foreground text-xs font-light">
                        {user.email || <em className="text-muted-foreground/40 font-light">{t('noneProvided')}</em>}
                      </td>
                      
                      {/* Branch */}
                      <td className="py-4.5 px-6">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary/80">
                          <MapPin className="h-3 w-3 text-accent" />
                          {user.branch === 'Borjomi' && (lang === 'en' ? 'Borjomi' : 'ბორჯომი')}
                          {user.branch === 'Khashuri' && (lang === 'en' ? 'Khashuri' : 'ხაშური')}
                          {user.branch === 'Akhaltsikhe' && (lang === 'en' ? 'Akhaltsikhe' : 'ახალციხე')}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-4.5 px-6 font-medium text-xs text-primary">{formattedDueDate}</td>

                      {/* Status */}
                      <td className="py-4.5 px-6">
                        <span className={`inline-flex items-center text-[10px] font-bold px-3 py-1 rounded-full border ${statusObj.bgClass} ${statusObj.colorClass}`}>
                          {lang === 'en' 
                            ? statusObj.status 
                            : (statusObj.status === 'Active' ? 'აქტიური' : statusObj.status === 'Due' ? 'გადასახდელი' : 'ვადაგადაცილებული')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 px-6 text-right">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-xs bg-secondary hover:bg-primary hover:text-primary-foreground text-primary font-semibold px-4 py-2 rounded-xl transition-all duration-300"
                        >
                          {t('viewDetails')}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
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
  );
}
