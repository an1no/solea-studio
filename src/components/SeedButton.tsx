'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SeedButton() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Seeding failed. Please verify database availability.');
      }
    } catch (err) {
      console.error(err);
      alert('Network failure seeding database.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <Button size="sm" onClick={handleSeed} disabled={seeding} className="rounded-xl">
      {seeding ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Seeding...
        </>
      ) : (
        <>
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Seed Demo Data
        </>
      )}
    </Button>
  );
}
