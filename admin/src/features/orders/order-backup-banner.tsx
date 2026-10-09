'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Trash2, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { purgeOldOrders } from './actions';
import { useAdminLanguage } from '@/features/i18n/language-context';

export function OrderBackupBanner() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [daysSinceBackup, setDaysSinceBackup] = useState<number | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const { locale } = useAdminLanguage();
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sweetargan_last_backup_date');
      if (saved) {
        setLastBackup(saved);
        const diffDays = Math.floor((Date.now() - new Date(saved).getTime()) / (1000 * 60 * 60 * 24));
        setDaysSinceBackup(diffDays);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDownload = (format: 'json' | 'csv') => {
    const nowIso = new Date().toISOString();
    try {
      localStorage.setItem('sweetargan_last_backup_date', nowIso);
      setLastBackup(nowIso);
      setDaysSinceBackup(0);
    } catch {
      // ignore
    }
    window.location.href = `/api/orders/export?format=${format}`;
  };

  const handlePurge = async () => {
    setBusy(true);
    setMessage('');
    try {
      const res = await purgeOldOrders(10);
      if (res.error) {
        setMessage(res.error);
      } else {
        setMessage(res.message || 'تم تنظيف الطلبات القديمة بنجاح.');
        router.refresh();
      }
    } catch {
      setMessage('تعذر تنظيف الطلبات. يرجى المحاولة لاحقاً.');
    } finally {
      setBusy(false);
      setShowPurgeConfirm(false);
    }
  };

  const needsBackupAlert = daysSinceBackup !== null && daysSinceBackup >= 9;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-200/70 text-amber-900 rounded-lg">
              <ShieldCheck size={18} />
            </span>
            <h3 className="font-bold text-sm sm:text-base text-neutral-900 m-0">
              {locale === 'ar'
                ? 'النسخ الاحتياطي المنتظم (كل 9 أيام) & تنظيف القاعدة (10 أيام)'
                : locale === 'fr'
                ? 'Sauvegarde périodique (tous les 9j) & Purge automatique (10j)'
                : 'Periodic Backup (Every 9 Days) & DB Cleanup (10 Days)'}
            </h3>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
            {locale === 'ar'
              ? 'لحماية بياناتكم وإبقاء قاعدة البيانات خفيفة وسريعة: نوصي بتحميل نسخة احتياطية لسجلات الطلبات كل 9 أيام، مع إمكانية حذف وأرشفة الطلبات التي تجاوزت 10 أيام تلقائياً دون أي ضياع للمعلومات.'
              : 'Pour préserver vos données et garder la base fluide : téléchargez l’archive des logs toutes les 9 journées. Les commandes de plus de 10 jours peuvent être archivées et purgées en toute sécurité.'}
          </p>
          {lastBackup && (
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-0.5">
              <Clock size={12} />
              <span>
                {locale === 'ar'
                  ? `آخر تحميل للنسخة الاحتياطية : ${new Date(lastBackup).toLocaleDateString('fr-MA')} (${daysSinceBackup} يوم مضت)`
                  : `Dernier export téléchargé le : ${new Date(lastBackup).toLocaleDateString('fr-MA')} (${daysSinceBackup} j)`}
              </span>
            </div>
          )}
          {needsBackupAlert && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded w-fit mt-1">
              <AlertCircle size={12} />
              <span>
                {locale === 'ar'
                  ? 'تنبيه: لقد مر أكثر من 9 أيام منذ آخر تحميل للنسخة الاحتياطية!'
                  : 'Rappel : plus de 9 jours depuis la dernière sauvegarde !'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => handleDownload('json')}
            className="inline-flex items-center gap-1.5 bg-neutral-900 text-white font-semibold text-xs px-3.5 py-2 rounded-lg hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
          >
            <Download size={14} />
            <span>{locale === 'ar' ? 'تحميل سجل الطلبات (JSON)' : 'Télécharger logs (JSON)'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownload('csv')}
            className="inline-flex items-center gap-1.5 bg-white text-neutral-800 border border-neutral-300 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer shadow-xs"
          >
            <Download size={14} />
            <span>{locale === 'ar' ? 'تصدير كجدول (CSV)' : 'Exporter (CSV)'}</span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => setShowPurgeConfirm(true)}
            className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-rose-100 transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            <span>{locale === 'ar' ? 'تنظيف ما فوق 10 أيام' : 'Purger > 10 jours'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="mt-3 p-2.5 rounded-lg text-xs bg-white border border-amber-300 text-neutral-800">
          {message}
        </div>
      )}

      {/* Confirmation Modal for 10-day Purge */}
      {showPurgeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-base text-neutral-900 m-0">
              {locale === 'ar' ? 'تأكيد تنظيف الطلبات القديمة' : 'Confirmer la purge des commandes'}
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {locale === 'ar'
                ? 'سيتم حذف كل الطلبات التي مر على تسجيلها أكثر من 10 أيام لتسريع قاعدة البيانات. سيتم حفظ جميع بياناتها في الأرشيف أولاً. هل قمت بتحميل النسخة الاحتياطية وتريد المتابعة؟'
                : 'Les commandes de plus de 10 jours seront retirées de la liste active pour alléger la base. Une copie sécurisée est archivée. Avez-vous téléchargé votre sauvegarde ?'}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPurgeConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                disabled={busy}
              >
                {locale === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handlePurge}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-rose-700 text-white hover:bg-rose-800 disabled:opacity-50"
                disabled={busy}
              >
                {busy
                  ? locale === 'ar'
                    ? 'جاري التنظيف والأرشفة...'
                    : 'Nettoyage...'
                  : locale === 'ar'
                  ? 'نعم، تنظيف الآن'
                  : 'Confirmer la purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
