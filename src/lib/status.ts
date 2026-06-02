export type PaymentStatus = 'Active' | 'Due' | 'Overdue';

export function getPaymentStatus(dueDate: Date | string): {
  status: PaymentStatus;
  colorClass: string;
  bgClass: string;
} {
  const due = new Date(dueDate);
  const now = new Date();
  
  // Set times to midnight to do calendar day comparisons
  const dueMidnight = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = dueMidnight.getTime() - todayMidnight.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'Overdue',
      colorClass: 'text-destructive',
      bgClass: 'bg-destructive/10 border-destructive/20'
    };
  } else if (diffDays <= 3) {
    return {
      status: 'Due',
      colorClass: 'text-accent-foreground',
      bgClass: 'bg-accent/15 border-accent/30'
    };
  } else {
    return {
      status: 'Active',
      colorClass: 'text-[#7d9a8b]',
      bgClass: 'bg-[#7d9a8b]/10 border-[#7d9a8b]/20'
    };
  }
}
