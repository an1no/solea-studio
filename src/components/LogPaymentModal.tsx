'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
      setError(
        lang === 'en'
          ? 'Please enter a valid positive payment amount.'
          : 'გთხოვთ შეიყვანოთ სწორი დადებითი რიცხვი.'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: parsedAmount, notes: notes.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Payment logging failed.');

      setIsOpen(false);
      setAmount('75');
      setNotes('Monthly membership fee');
      router.refresh();
      window.dispatchEvent(new Event('languagechange'));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit payment record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="rounded-xl shadow-md"
      >
        <PlusCircle className="h-4 w-4" />
        {t('logNewPayment')}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('logStudentPayment')}</DialogTitle>
            <DialogDescription>
              {t('recordFor', { name: userName })}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="px-6 pt-5 pb-4 space-y-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl p-3 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="modal-amount">
                {t('paymentAmountGEL')} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  GEL
                </span>
                <Input
                  id="modal-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 75"
                  className="pl-12 font-mono font-bold"
                  required
                  min="1"
                  step="any"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-notes">
                {lang === 'en' ? 'Transaction Notes' : 'შენიშვნა'}
              </Label>
              <Textarea
                id="modal-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'e.g. Standard monthly subscription'
                    : 'მაგ. ყოველთვიური აბონემენტი'
                }
                rows={3}
              />
            </div>

            <div className="bg-[#fafaf7] p-3 rounded-2xl border border-border text-[10px] text-muted-foreground leading-relaxed">
              📢 {t('actionEffect')}
            </div>
          </form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
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
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
