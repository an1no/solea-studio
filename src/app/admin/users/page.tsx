'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UsersTable from '@/components/UsersTable';
import { PlusCircle, Database, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function AdminUsersPage() {
  const { lang, t } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/members');
      const json = await res.json();
      if (json.success) {
        setUsers(json.users || []);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#7d9a8b]" />
        <p className="text-sm text-muted-foreground font-light">
          {lang === 'en' ? 'Loading members roster...' : 'მიმდინარეობს წევრების სიის ჩატვირთვა...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">{t('yogaMembers')}</h1>
          <p className="text-muted-foreground text-sm font-light">
            {t('searchFilterDesc')}
          </p>
        </div>

        <Link
          href="/register"
          className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="h-4 w-4" />
          {t('addNewMember')}
        </Link>
      </div>

      {dbError ? (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-8 space-y-4 animate-slide-up">
          <div className="flex items-center gap-3 text-amber-800">
            <Database className="h-6 w-6 text-amber-700" />
            <h3 className="font-serif text-lg font-bold">
              {lang === 'en' ? 'Database Connection Pending' : 'მონაცემთა ბაზა მიუწვდომელია'}
            </h3>
          </div>
          <p className="text-xs text-amber-800/80 font-light leading-relaxed">
            {lang === 'en'
              ? "We are unable to fetch the members list. Please review your setup."
              : "წევრების სიის წაკითხვა ვერ მოხერხდა. გთხოვთ გადაამოწმოთ ბაზის ფაილი."}
          </p>
        </div>
      ) : (
        /* Interactive Table Client component */
        <UsersTable users={users} />
      )}

    </div>
  );
}
