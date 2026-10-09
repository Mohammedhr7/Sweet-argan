'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin layout/page error:', error);
  }, [error]);

  return (
    <main className="empty-state p-8 max-w-xl mx-auto text-center">
      <h1 className="text-xl font-bold text-neutral-900 mb-2">
        حدث خطأ أثناء تحميل الصفحة
      </h1>
      <p className="text-sm text-neutral-600 mb-4">
        يرجى التحقق من الاتصال بالإنترنت أو إعادة تسجيل الدخول لتحديث الجلسة.
      </p>
      {error?.message && (
        <p className="text-xs font-mono text-rose-700 bg-rose-50 p-2 rounded mb-4">
          {error.message}
        </p>
      )}
      <div className="flex justify-center gap-3">
        <button className="button" onClick={() => reset()}>
          إعادة المحاولة / Réessayer
        </button>
        <a href="/login" className="button secondary">
          تسجيل الدخول / Se reconnecter
        </a>
      </div>
    </main>
  );
}
