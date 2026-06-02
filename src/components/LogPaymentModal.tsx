'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Loader2, X, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface LogPaymentModalProps {
  userId: string;
  userName: string;
}

export default function LogPaymentModal({ userId, userName }: LogPaymentModalProps) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('75');
  const [notes, setNotes] = useState('Monthly membership fee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(lang === 'en' ? "Please enter a valid positive payment amount." : "გთხოვთ შეიყვანოთ სწორი დადებითი რიცხვი.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount: parsedAmount,
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment logging failed.');
      }

      setIsOpen(false);
      setAmount('75');
      setNotes('Monthly membership fee');
      
      // Refresh current page data
      router.refresh();
      // Dispatch storage update event to update the other views dynamically
      window.dispatchEvent(new Event('languagechange'));
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
      >
        <PlusCircle className="h-4 w-4" />
        {t('logNewPayment')}
      </button>

      {/* DIALOG MODAL BACKDROP */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in">
          
          {/* MODAL BODY */}
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-border/80 animate-slide-up relative">
            
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-bold">{t('logStudentPayment')}</h3>
                <p className="text-xs text-primary-foreground/75 font-light">
                  {t('recordFor', { name: userName })}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl p-3 flex items-start gap-2.5">
                  <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Amount input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('paymentAmountGEL')} <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">GEL</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 75"
                    className="w-full rounded-xl border border-input bg-white pl-12 pr-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-mono font-bold"
                    required
                    min="1"
                    step="any"
                  />
                </div>
              </div>

              {/* Notes input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {lang === 'en' ? 'Transaction Notes / Details' : 'შენიშვნა / დეტალები'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === 'en' ? "e.g. Standard monthly subscription" : "მაგ. ყოველთვიური აბონემენტი"}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-white px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="bg-[#fafaf7] p-3 rounded-2xl border border-border text-[10px] text-muted-foreground leading-relaxed">
                📢 {t('actionEffect')}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="border border-border hover:bg-secondary/40 text-muted-foreground font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('logging')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-accent" />
                      {t('recordTransaction')}
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
}
