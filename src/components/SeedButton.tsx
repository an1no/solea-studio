'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';

export default function SeedButton() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', {
        method: 'POST'
      });
      if (res.ok) {
        // Trigger a silent router data refresh
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
    <button
      onClick={handleSeed}
      disabled={seeding}
      className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
    >
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
    </button>
  );
}
