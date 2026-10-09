export type AdminLocale = 'ar' | 'fr' | 'en';

export interface AdminDictionary {
  locale: AdminLocale;
  dir: 'rtl' | 'ltr';
  brand: {
    name: string;
    sub: string;
    cooperative: string;
    role: string;
  };
  nav: {
    dashboard: string;
    orders: string;
    products: string;
    categories: string;
    customers: string;
    content: string;
    view_store: string;
    logout: string;
  };
  dashboard: {
    eyebrow: string;
    greeting: string;
    subtitle: string;
    orders_today: string;
    orders_confirmed: string;
    orders_pending: string;
    orders_review: string;
    view_orders: string;
    attention_eyebrow: string;
    attention_title: string;
    attention_desc: string;
    attention_btn: string;
    revenue_today: string;
    revenue_month: string;
    revenue_hint: string;
    in_processing: string;
    delivered: string;
    total_customers: string;
    recent_orders: string;
    recent_subtitle: string;
    view_all: string;
  };
  orders: {
    eyebrow: string;
    title: string;
    count_subtitle: string;
    search_placeholder: string;
    all_confirmations: string;
    all_fulfillments: string;
    sort_recent: string;
    sort_total: string;
    filter_btn: string;
    tabs: {
      all: string;
      today: string;
      to_confirm: string;
      review: string;
      processing: string;
      shipped: string;
      delivered: string;
      returned: string;
    };
    table: {
      code: string;
      customer: string;
      city: string;
      date: string;
      items: string;
      total: string;
      confirmation: string;
      fulfillment: string;
      actions: string;
      view: string;
      print_bill: string;
      delete: string;
    };
    backup: {
      title: string;
      desc: string;
      download_btn: string;
      cleanup_btn: string;
      cleanup_confirm: string;
      cleanup_success: string;
    };
  };
  order_detail: {
    back: string;
    products_title: string;
    confirmation_title: string;
    history_title: string;
    customer_title: string;
    actions_title: string;
    print_invoice: string;
    delete_order: string;
    delete_confirm: string;
    delete_warning: string;
    delete_success: string;
    subtotal: string;
    shipping: string;
    discount: string;
    total: string;
    payment_mode: string;
    notes_placeholder: string;
    save_note: string;
    internal_notes: string;
    status_updated: string;
    quick_status: {
      confirm: string;
      processing: string;
      ready: string;
      shipped: string;
      delivered: string;
      returned: string;
      cancelled: string;
    };
  };
  invoice: {
    cooperative_name: string;
    cooperative_sub: string;
    cooperative_address: string;
    cooperative_contact: string;
    doc_title: string;
    order_code: string;
    date: string;
    customer_name: string;
    customer_phone: string;
    shipping_city: string;
    shipping_address: string;
    shipping_notes: string;
    payment_method: string;
    cod_text: string;
    col_product: string;
    col_qty: string;
    col_price: string;
    col_total: string;
    subtotal: string;
    shipping_fee: string;
    free_shipping: string;
    total_net: string;
    signatures: {
      customer: string;
      courier: string;
      cooperative: string;
    };
    print_btn: string;
    back_btn: string;
    footer_text: string;
  };
  statuses: {
    pending: string;
    confirmed: string;
    needs_review: string;
    rejected: string;
    expired: string;
    new: string;
    processing: string;
    ready: string;
    shipped: string;
    delivered: string;
    cancelled: string;
    returned: string;
  };
}

export const adminTranslations: Record<AdminLocale, AdminDictionary> = {
  ar: {
    locale: 'ar',
    dir: 'rtl',
    brand: {
      name: 'سويت أركان',
      sub: 'فضاء إدارة التعاونية',
      cooperative: 'تعاونية سويت أركان الفلاحية',
      role: 'مشرف النظام'
    },
    nav: {
      dashboard: 'لوحة القيادة',
      orders: 'الطلبات والمبيعات',
      products: 'المستحضرات والكتالوج',
      categories: 'العوالم والتصنيفات',
      customers: 'قاعدة الزبائن',
      content: 'محتوى وإعدادات المتجر',
      view_store: 'زيارة المتجر',
      logout: 'تسجيل الخروج'
    },
    dashboard: {
      eyebrow: 'متابعة نشاط التعاونية في الوقت الفعلي',
      greeting: 'مرحباً بكِ',
      subtitle: 'يوم مبارك لمتابعة طلبات وخدمة عميلات سويت أركان.',
      orders_today: 'طلبات اليوم',
      orders_confirmed: 'طلبات مؤكدة',
      orders_pending: 'في انتظار التأكيد',
      orders_review: 'تحتاج للمراجعة',
      view_orders: 'عرض الطلبات',
      attention_eyebrow: 'طلبات تتطلب تدخلكِ',
      attention_title: 'طلبية تحتاج إلى تأكيد أو مراجعة',
      attention_desc: 'راجعي طلبات التعديل والتأكيدات العالقة للتجهيز والشحن السريع.',
      attention_btn: 'فتح الطلبات العالقة',
      revenue_today: 'المداخيل المحصلة اليوم (مؤكدة ومسلّمة)',
      revenue_month: 'المداخيل المحصلة هذا الشهر (مؤكدة ومسلّمة)',
      revenue_hint: 'يتم احتساب المداخيل حصراً عند تأكيد الطلب وتسليمه للزبون (Paiement à la livraison).',
      in_processing: 'قيد التجهيز',
      delivered: 'تم تسليمها بنجاح',
      total_customers: 'إجمالي الزبائن',
      recent_orders: 'أحدث الطلبات الواردة',
      recent_subtitle: 'آخر الطلبات المسجلة من مختلف مدن المملكة.',
      view_all: 'عرض كافة الطلبات ←'
    },
    orders: {
      eyebrow: 'إدارة الطلبات وشحن الطرود',
      title: 'سجل الطلبات',
      count_subtitle: 'طلبية في هذا العرض.',
      search_placeholder: 'ابحث برقم الطلب، اسم الزبون، أو رقم الهاتف…',
      all_confirmations: 'كافة حالات التأكيد',
      all_fulfillments: 'كافة حالات الشحن والتوصيل',
      sort_recent: 'الأحدث تاريخاً',
      sort_total: 'الأعلى قيمة',
      filter_btn: 'تطبيق الفلترة',
      tabs: {
        all: 'الكل',
        today: 'اليوم',
        to_confirm: 'في انتظار التأكيد',
        review: 'قيد المراجعة',
        processing: 'قيد التجهيز',
        shipped: 'تم الشحن',
        delivered: 'تم التسليم',
        returned: 'مسترجعة'
      },
      table: {
        code: 'رقم الطلب',
        customer: 'الزبون والهاتف',
        city: 'المدينة',
        date: 'التاريخ',
        items: 'المنتجات',
        total: 'المجموع',
        confirmation: 'التأكيد',
        fulfillment: 'التوصيل',
        actions: 'إجراءات',
        view: 'التفاصيل',
        print_bill: 'طباعة الفاتورة',
        delete: 'حذف'
      },
      backup: {
        title: 'النسخ الاحتياطي والأرشفة التلقائية',
        desc: 'يُنصح بتحميل سجل الطلبات كل 9 أيام لضمان حفظ البيانات بشكل دائم قبل تصفية الطلبات القديمة (أكثر من 10 أيام).',
        download_btn: 'تحميل أرشيف الطلبات الكامل (JSON / CSV)',
        cleanup_btn: 'تنظيف وأرشفة الطلبات الأقدم من 10 أيام',
        cleanup_confirm: 'هل ترغب في أرشفة وتنظيف الطلبات التي مر عليها أكثر من 10 أيام في قاعدة البيانات؟',
        cleanup_success: 'تمت أرشفة وتنظيف الطلبات بنجاح.'
      }
    },
    order_detail: {
      back: '← العودة إلى قائمة الطلبات',
      products_title: 'المستحضرات المطلوبة',
      confirmation_title: 'سجل وتفاصيل التأكيد',
      history_title: 'الخط الزمني والملاحظات',
      customer_title: 'بيانات الزبون وعنوان الشحن',
      actions_title: 'تحديث حالة الطلب السريع',
      print_invoice: 'طباعة فاتورة الطلب (Bon de livraison)',
      delete_order: 'حذف الطلب نهائياً من قاعدة البيانات',
      delete_confirm: 'تحذير: هل أنت متأكد من حذف هذا الطلب نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.',
      delete_warning: 'سيتم حذف الطلب ومساراته وربطه نهائياً وتحرير أي مخزون محجوز.',
      delete_success: 'تم حذف الطلب بنجاح.',
      subtotal: 'المجموع الجزئي',
      shipping: 'مصاريف الشحن والتوصيل',
      discount: 'الخصم',
      total: 'المجموع الإجمالي المطلوب نقداً',
      payment_mode: 'طريقة الدفع: الدفع نقداً عند الاستلام (COD)',
      notes_placeholder: 'أضف ملاحظة داخلية خاصة بفريق العمل…',
      save_note: 'حفظ الملاحظة',
      internal_notes: 'ملاحظات داخلية',
      status_updated: 'تم تحديث حالة الطلب بنجاح.',
      quick_status: {
        confirm: '✓ تأكيد الطلب',
        processing: '📦 قيد التجهيز',
        ready: '🏷️ جاهز للشحن',
        shipped: '🚚 تم الشحن مع الموزع',
        delivered: '✅ تم التسليم واستلام المبلغ',
        returned: '↩️ إرجاع الطلب (Retour)',
        cancelled: '✕ إلغاء الطلب'
      }
    },
    invoice: {
      cooperative_name: 'تعاونية سويت أركان الفلاحية النسوية',
      cooperative_sub: 'إنتاج وتثمين زيت الأركان البيولوجي ومستحضرات التجميل الطبيعية',
      cooperative_address: 'المقر: أكادير، جهة سوس ماسة، المملكة المغربية',
      cooperative_contact: 'الهاتف: 0661983329 · الموقع: sweetargan.ma',
      doc_title: 'فاتورة ووصل تسليم الطلب (Bon de Livraison)',
      order_code: 'رقم الطلب',
      date: 'تاريخ الطلب',
      customer_name: 'اسم الزبون',
      customer_phone: 'رقم الهاتف',
      shipping_city: 'مدينة التوصيل',
      shipping_address: 'العنوان الكامل',
      shipping_notes: 'تعليمات وإرشادات التوصيل',
      payment_method: 'طريقة الأداء',
      cod_text: 'الدفع نقداً عند استلام الطرد (Paiement à la livraison)',
      col_product: 'المنتج / المستحضر',
      col_qty: 'الكمية',
      col_price: 'سعر الوحدة',
      col_total: 'المجموع',
      subtotal: 'المجموع الجزئي',
      shipping_fee: 'مصاريف التوصيل',
      free_shipping: 'توصيل مجاني (طلب فوق 300 درهم)',
      total_net: 'المجموع الصافي الواجب أداؤه نقداً للموزع',
      signatures: {
        customer: 'توقيع أو تأكيد الزبون بالاستلام',
        courier: 'توقيع موظف التوصيل',
        cooperative: 'ختم وتوقيع إدارة التعاونية'
      },
      print_btn: 'طباعة هذه الفاتورة الآن',
      back_btn: 'العودة لتفاصيل الطلب',
      footer_text: 'شكراً لثقتكم بمنتجات تعاونية سويت أركان الطبيعية 100% · ذهب المغرب الخالص من قلب سوس'
    },
    statuses: {
      pending: 'في انتظار التأكيد',
      confirmed: 'مؤكدة',
      needs_review: 'قيد المراجعة',
      rejected: 'ملغاة من الزبون',
      expired: 'منتهية الصلاحية',
      new: 'جديدة',
      processing: 'قيد التجهيز',
      ready: 'جاهزة للتوزيع',
      shipped: 'مع شركة التوصيل',
      delivered: 'تم التسليم بنجاح',
      cancelled: 'ملغاة',
      returned: 'مسترجعة'
    }
  },
  fr: {
    locale: 'fr',
    dir: 'ltr',
    brand: {
      name: 'Sweet Argan',
      sub: 'ESPACE ÉQUIPE',
      cooperative: 'Coopérative Sweet Argan',
      role: 'Administrateur'
    },
    nav: {
      dashboard: 'Vue d’ensemble',
      orders: 'Commandes',
      products: 'Produits',
      categories: 'Catégories',
      customers: 'Clients',
      content: 'Contenu & réglages',
      view_store: 'Voir la boutique',
      logout: 'Se déconnecter'
    },
    dashboard: {
      eyebrow: 'VOTRE ACTIVITÉ, EN UN COUP D’ŒIL',
      greeting: 'Bonjour',
      subtitle: 'Une belle journée pour prendre soin de vos clients.',
      orders_today: 'Commandes aujourd’hui',
      orders_confirmed: 'Commandes confirmées',
      orders_pending: 'À confirmer',
      orders_review: 'Demandent votre attention',
      view_orders: 'Voir les commandes',
      attention_eyebrow: 'LES PROCHAINES ATTENTIONS',
      attention_title: 'commande(s) à accompagner',
      attention_desc: 'Vérifiez les demandes de modification et les confirmations en attente.',
      attention_btn: 'Ouvrir les demandes',
      revenue_today: 'CA encaissé aujourd’hui (confirmé & livré)',
      revenue_month: 'CA encaissé ce mois (confirmé & livré)',
      revenue_hint: 'Le revenu est comptabilisé uniquement lorsque la commande est confirmée et livrée (paiement à la livraison).',
      in_processing: 'En préparation',
      delivered: 'Livrées',
      total_customers: 'Clients',
      recent_orders: 'Dernières commandes',
      recent_subtitle: 'Les dernières attentions confiées à Sweet Argan.',
      view_all: 'Tout voir →'
    },
    orders: {
      eyebrow: 'AU CŒUR DE VOTRE ACTIVITÉ',
      title: 'Commandes',
      count_subtitle: 'commande(s) dans cette sélection.',
      search_placeholder: 'Numéro, client, téléphone…',
      all_confirmations: 'Toutes les confirmations',
      all_fulfillments: 'Toutes les livraisons',
      sort_recent: 'Date récente',
      sort_total: 'Montant décroissant',
      filter_btn: 'Filtrer',
      tabs: {
        all: 'Toutes',
        today: 'Aujourd’hui',
        to_confirm: 'À confirmer',
        review: 'À vérifier',
        processing: 'En préparation',
        shipped: 'Expédiées',
        delivered: 'Livrées',
        returned: 'Retournées'
      },
      table: {
        code: 'N° Commande',
        customer: 'Client & Téléphone',
        city: 'Ville',
        date: 'Date',
        items: 'Articles',
        total: 'Total',
        confirmation: 'Confirmation',
        fulfillment: 'Livraison',
        actions: 'Actions',
        view: 'Détails',
        print_bill: 'Facture',
        delete: 'Supprimer'
      },
      backup: {
        title: 'Sauvegarde & Archivage automatique',
        desc: 'Téléchargez les journaux de commandes tous les 9 jours pour conserver un historique permanent avant nettoyage des commandes de plus de 10 jours.',
        download_btn: 'Télécharger l’archive des commandes (JSON / CSV)',
        cleanup_btn: 'Nettoyer et archiver les commandes > 10 jours',
        cleanup_confirm: 'Archiver et supprimer les commandes actives vieilles de plus de 10 jours ?',
        cleanup_success: 'Nettoyage et archivage terminés avec succès.'
      }
    },
    order_detail: {
      back: '← Toutes les commandes',
      products_title: 'Les produits',
      confirmation_title: 'Confirmation',
      history_title: 'Historique & notes',
      customer_title: 'Client & livraison',
      actions_title: 'Mise à jour du statut',
      print_invoice: 'Imprimer la facture (Bon de livraison)',
      delete_order: 'Supprimer définitivement la commande',
      delete_confirm: 'Attention : voulez-vous vraiment supprimer cette commande de la base de données ?',
      delete_warning: 'Cette opération est irréversible et libérera les stocks réservés.',
      delete_success: 'Commande supprimée avec succès.',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      discount: 'Remise',
      total: 'Total à régler en espèces',
      payment_mode: 'Mode : Paiement en espèces à la livraison (COD)',
      notes_placeholder: 'Information utile pour l’équipe…',
      save_note: 'Enregistrer la note',
      internal_notes: 'Notes internes',
      status_updated: 'Statut mis à jour avec succès.',
      quick_status: {
        confirm: '✓ Confirmer la commande',
        processing: '📦 En préparation',
        ready: '🏷️ Prête pour livraison',
        shipped: '🚚 Remise au transporteur',
        delivered: '✅ Livrée et encaissée',
        returned: '↩️ Colis retourné',
        cancelled: '✕ Annuler la commande'
      }
    },
    invoice: {
      cooperative_name: 'Coopérative Féminine Sweet Argan',
      cooperative_sub: 'Huile d’argan pure bio et cosmétique naturelle marocaine',
      cooperative_address: 'Siège : Agadir, Région Souss-Massa, Maroc',
      cooperative_contact: 'Tél : +212 661-983329 · Web : sweetargan.ma',
      doc_title: 'Bon de Livraison & Facture',
      order_code: 'N° de Commande',
      date: 'Date de commande',
      customer_name: 'Nom du client',
      customer_phone: 'Téléphone',
      shipping_city: 'Ville de livraison',
      shipping_address: 'Adresse de livraison',
      shipping_notes: 'Remarques de livraison',
      payment_method: 'Mode de règlement',
      cod_text: 'Espèces à la livraison (Cash on Delivery)',
      col_product: 'Désignation produit',
      col_qty: 'Quantité',
      col_price: 'Prix unitaire',
      col_total: 'Total',
      subtotal: 'Sous-total HT/TTC',
      shipping_fee: 'Frais d’expédition',
      free_shipping: 'Livraison offerte (> 300 MAD)',
      total_net: 'TOTAL NET À PAYER EN ESPÈCES',
      signatures: {
        customer: 'Signature du destinataire',
        courier: 'Signature du livreur',
        cooperative: 'Cachet de la coopérative'
      },
      print_btn: 'Imprimer cette facture',
      back_btn: 'Retour aux détails',
      footer_text: 'Merci de votre confiance en la coopérative Sweet Argan · 100% Naturel & Artisanal'
    },
    statuses: {
      pending: 'En attente',
      confirmed: 'Confirmée',
      needs_review: 'À vérifier',
      rejected: 'Refusée',
      expired: 'Expirée',
      new: 'Nouvelle',
      processing: 'En préparation',
      ready: 'Prête',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      returned: 'Retournée'
    }
  },
  en: {
    locale: 'en',
    dir: 'ltr',
    brand: {
      name: 'Sweet Argan',
      sub: 'TEAM WORKSPACE',
      cooperative: 'Sweet Argan Cooperative',
      role: 'Administrator'
    },
    nav: {
      dashboard: 'Dashboard',
      orders: 'Orders',
      products: 'Products',
      categories: 'Categories',
      customers: 'Customers',
      content: 'Store Settings & Content',
      view_store: 'View Storefront',
      logout: 'Sign Out'
    },
    dashboard: {
      eyebrow: 'REAL-TIME ACTIVITY OVERVIEW',
      greeting: 'Welcome back',
      subtitle: 'A wonderful day to care for Sweet Argan customers.',
      orders_today: 'Orders Today',
      orders_confirmed: 'Confirmed Orders',
      orders_pending: 'Pending Confirmation',
      orders_review: 'Need Your Attention',
      view_orders: 'View Orders',
      attention_eyebrow: 'PRIORITY ATTENTION',
      attention_title: 'order(s) waiting for your action',
      attention_desc: 'Review customer modification requests and pending confirmations.',
      attention_btn: 'Review Pending Orders',
      revenue_today: 'Revenue Collected Today (Confirmed & Delivered)',
      revenue_month: 'Revenue Collected This Month (Confirmed & Delivered)',
      revenue_hint: 'Revenue is counted strictly when an order is both confirmed and delivered (cash on delivery).',
      in_processing: 'In Processing',
      delivered: 'Delivered',
      total_customers: 'Total Customers',
      recent_orders: 'Recent Incoming Orders',
      recent_subtitle: 'Latest orders placed across Morocco.',
      view_all: 'View All Orders →'
    },
    orders: {
      eyebrow: 'ORDER FULFILLMENT & DISPATCH',
      title: 'Order Management',
      count_subtitle: 'order(s) matching this view.',
      search_placeholder: 'Order number, client name, phone…',
      all_confirmations: 'All Confirmation Statuses',
      all_fulfillments: 'All Delivery Statuses',
      sort_recent: 'Most Recent',
      sort_total: 'Highest Amount',
      filter_btn: 'Apply Filters',
      tabs: {
        all: 'All',
        today: 'Today',
        to_confirm: 'To Confirm',
        review: 'Review Needed',
        processing: 'In Preparation',
        shipped: 'Shipped',
        delivered: 'Delivered',
        returned: 'Returned'
      },
      table: {
        code: 'Order Code',
        customer: 'Customer & Phone',
        city: 'City',
        date: 'Date',
        items: 'Items',
        total: 'Total',
        confirmation: 'Confirmation',
        fulfillment: 'Delivery',
        actions: 'Actions',
        view: 'Details',
        print_bill: 'Invoice',
        delete: 'Delete'
      },
      backup: {
        title: 'Order Logs Backup & Auto Cleanup',
        desc: 'Recommended: Download order logs every 9 days to keep permanent historical archives before purging orders older than 10 days.',
        download_btn: 'Download Full Order Archive (JSON / CSV)',
        cleanup_btn: 'Archive & Purge Orders Older Than 10 Days',
        cleanup_confirm: 'Archive and delete active orders older than 10 days from database?',
        cleanup_success: 'Orders archived and cleaned successfully.'
      }
    },
    order_detail: {
      back: '← Back to All Orders',
      products_title: 'Ordered Products',
      confirmation_title: 'Confirmation Status & Events',
      history_title: 'Status Timeline & Internal Notes',
      customer_title: 'Customer & Shipping Address',
      actions_title: 'Quick Status Transition',
      print_invoice: 'Print Order Invoice (Delivery Bill)',
      delete_order: 'Permanently Delete Order from Database',
      delete_confirm: 'Warning: Are you sure you want to permanently delete this order from the database?',
      delete_warning: 'This action is irreversible and releases any reserved inventory.',
      delete_success: 'Order deleted successfully.',
      subtotal: 'Subtotal',
      shipping: 'Shipping Fee',
      discount: 'Discount',
      total: 'Total Due (Cash on Delivery)',
      payment_mode: 'Method: Cash on Delivery (COD)',
      notes_placeholder: 'Internal team note…',
      save_note: 'Save Note',
      internal_notes: 'Internal Notes',
      status_updated: 'Order status updated successfully.',
      quick_status: {
        confirm: '✓ Confirm Order',
        processing: '📦 In Preparation',
        ready: '🏷️ Ready for Dispatch',
        shipped: '🚚 Handed to Courier',
        delivered: '✅ Delivered & Collected',
        returned: '↩️ Returned Package',
        cancelled: '✕ Cancel Order'
      }
    },
    invoice: {
      cooperative_name: 'Sweet Argan Women’s Cooperative',
      cooperative_sub: 'Organic Moroccan Argan Oil and Natural Botanical Cosmetics',
      cooperative_address: 'Headquarters: Agadir, Souss-Massa Region, Morocco',
      cooperative_contact: 'Tel: +212 661-983329 · Web: sweetargan.ma',
      doc_title: 'Delivery Bill & Invoice',
      order_code: 'Order Reference',
      date: 'Order Date',
      customer_name: 'Customer Name',
      customer_phone: 'Phone Number',
      shipping_city: 'Delivery City',
      shipping_address: 'Shipping Address',
      shipping_notes: 'Delivery Instructions',
      payment_method: 'Payment Method',
      cod_text: 'Cash on Delivery (COD)',
      col_product: 'Product Description',
      col_qty: 'Quantity',
      col_price: 'Unit Price',
      col_total: 'Total',
      subtotal: 'Subtotal',
      shipping_fee: 'Shipping Fee',
      free_shipping: 'Free Shipping (> 300 MAD)',
      total_net: 'TOTAL NET DUE IN CASH',
      signatures: {
        customer: 'Customer Signature',
        courier: 'Courier Signature',
        cooperative: 'Cooperative Stamp & Signature'
      },
      print_btn: 'Print Invoice Now',
      back_btn: 'Back to Order Details',
      footer_text: 'Thank you for choosing Sweet Argan Cooperative · Pure Moroccan Botanical Gold'
    },
    statuses: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      needs_review: 'Under Review',
      rejected: 'Rejected',
      expired: 'Expired',
      new: 'New',
      processing: 'Processing',
      ready: 'Ready',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned'
    }
  }
};
