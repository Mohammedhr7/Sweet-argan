'use client';

import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-brand-primary text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:opacity-95 transition-all cursor-pointer"
    >
      <Printer size={17} />
      <span>طباعة الفاتورة / Imprimer (A4)</span>
    </button>
  );
}
