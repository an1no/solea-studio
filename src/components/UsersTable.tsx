'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { getPaymentStatus } from '@/lib/status';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

function statusBadgeVariant(
  status: string
): BadgeProps['variant'] {
  if (status === 'Active') return 'active';
  if (status === 'Due') return 'due';
  return 'overdue';
}

export default function UsersTable({ users }: { users: User[] }) {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const statusObj = getPaymentStatus(user.nextPaymentDueDate);

      const matchesSearch =
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBranch =
        branchFilter === 'all' || user.branch === branchFilter;
      const matchesStatus =
        statusFilter === 'all' || statusObj.status === statusFilter;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [users, searchTerm, branchFilter, statusFilter]);

  const branchLabel = (branch: string) => {
    if (branch === 'Borjomi') return lang === 'en' ? 'Borjomi' : 'ბორჯომი';
    if (branch === 'Khashuri') return lang === 'en' ? 'Khashuri' : 'ხაშური';
    return lang === 'en' ? 'Akhaltsikhe' : 'ახალციხე';
  };

  const statusLabel = (status: string) => {
    if (lang === 'en') return status;
    if (status === 'Active') return 'აქტიური';
    if (status === 'Due') return 'გადასახდელი';
    return 'ვადაგადაცილებული';
  };

  return (
    <div className="space-y-6">
      {/* FILTER BAR */}
      <div className="bg-white border border-border p-5 rounded-3xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-2xl"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3 items-center">
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-full md:w-44 rounded-2xl">
              <SelectValue placeholder={t('allBranches')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allBranches')}</SelectItem>
              <SelectItem value="Borjomi">
                {lang === 'en' ? 'Borjomi' : 'ბორჯომი'}
              </SelectItem>
              <SelectItem value="Khashuri">
                {lang === 'en' ? 'Khashuri' : 'ხაშური'}
              </SelectItem>
              <SelectItem value="Akhaltsikhe">
                {lang === 'en' ? 'Akhaltsikhe' : 'ახალციხე'}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-44 rounded-2xl">
              <SelectValue placeholder={t('allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatuses')}</SelectItem>
              <SelectItem value="Active">
                {lang === 'en' ? 'Active' : 'აქტიური'}
              </SelectItem>
              <SelectItem value="Due">
                {lang === 'en' ? 'Due' : 'გადასახდელი'}
              </SelectItem>
              <SelectItem value="Overdue">
                {lang === 'en' ? 'Overdue' : 'ვადაგადაცილებული'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20 space-y-4 animate-fade-in">
            <p className="text-muted-foreground text-sm font-light">
              {t('noMatches')}
            </p>
            {(searchTerm || branchFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setBranchFilter('all');
                  setStatusFilter('all');
                }}
                className="text-xs font-semibold text-primary underline underline-offset-4"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('fullName')}</TableHead>
                <TableHead>{t('phoneNumber')}</TableHead>
                <TableHead>{t('emailAddr')}</TableHead>
                <TableHead>{t('studioBranch')}</TableHead>
                <TableHead>{t('nextDue')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const statusObj = getPaymentStatus(user.nextPaymentDueDate);
                const formattedDueDate = new Date(
                  user.nextPaymentDueDate
                ).toLocaleDateString(lang === 'en' ? 'en-US' : 'ka-GE', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-primary">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="hover:text-accent transition-colors"
                      >
                        {user.firstName} {user.lastName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {user.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-light">
                      {user.email || (
                        <em className="text-muted-foreground/40">
                          {t('noneProvided')}
                        </em>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary/80">
                        <MapPin className="h-3 w-3 text-accent" />
                        {branchLabel(user.branch)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-xs text-primary">
                      {formattedDueDate}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(statusObj.status)}>
                        {statusLabel(statusObj.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/admin/users/${user.id}`}>
                          {t('viewDetails')}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
