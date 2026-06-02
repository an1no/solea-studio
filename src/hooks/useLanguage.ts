'use client';

import { useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

const LANG_KEY = 'solea_preferred_lang';

export function useLanguage() {
  const [lang, setLang] = useState<Language>('en');

  // Load language preference on mount
  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Language;
    if (saved === 'en' || saved === 'ka') {
      setLang(saved);
    } else {
      // Default to Georgian if browser is in Georgian, otherwise English
      const isGeo = navigator.language.startsWith('ka');
      setLang(isGeo ? 'ka' : 'en');
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'ka' : 'en';
    setLang(nextLang);
    localStorage.setItem(LANG_KEY, nextLang);
    // Dispatch a custom event to sync other components instantly
    window.dispatchEvent(new Event('languagechange'));
  };

  // Sync state if language preference is changed in another component
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem(LANG_KEY) as Language;
      if (saved === 'en' || saved === 'ka') {
        setLang(saved);
      }
    };
    window.addEventListener('languagechange', handleSync);
    return () => window.removeEventListener('languagechange', handleSync);
  }, []);

  const t = (key: keyof typeof translations['en'], variables?: Record<string, string>) => {
    let text = translations[lang][key] || translations['en'][key] || String(key);
    
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    
    return text;
  };

  return {
    lang,
    toggleLanguage,
    t,
  };
}
