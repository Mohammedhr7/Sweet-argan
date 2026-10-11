export type Locale = 'ar' | 'fr' | 'en';

export interface Dictionary {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  announcement: string;
  brand: {
    name: string;
    sub: string;
    tagline: string;
  };
  nav: {
    home: string;
    shop: string;
    categories: string;
    bestsellers: string;
    story: string;
    contact: string;
    search_placeholder: string;
    search_button: string;
    cart: string;
    tracking: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    whatsapp_cta: string;
    caption_title: string;
    caption_sub: string;
  };
  trust: {
    argan_title: string;
    argan_sub: string;
    cod_title: string;
    cod_sub: string;
    shipping_title: string;
    shipping_sub: string;
    support_title: string;
    support_sub: string;
  };
  categories_section: {
    eyebrow: string;
    title: string;
    view_all: string;
    discover: string;
  };
  bestsellers: {
    eyebrow: string;
    title: string;
    view_all: string;
    badge: string;
  };
  story: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
    p3: string;
    cta: string;
  };
  pillars: {
    eyebrow: string;
    title: string;
    p1_title: string;
    p1_desc: string;
    p2_title: string;
    p2_desc: string;
    p3_title: string;
    p3_desc: string;
    p4_title: string;
    p4_desc: string;
  };
  ingredients: {
    eyebrow: string;
    title: string;
    i1_badge: string;
    i1_title: string;
    i1_desc: string;
    i2_badge: string;
    i2_title: string;
    i2_desc: string;
    i3_badge: string;
    i3_title: string;
    i3_desc: string;
    i4_badge: string;
    i4_title: string;
    i4_desc: string;
  };
  skincare: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
    cta: string;
  };
  hammam: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
    cta: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    view_all: string;
  };
  gift_set: {
    eyebrow: string;
    title: string;
    desc: string;
    order_cta: string;
    quick_buy: string;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    list: { name: string; quote: string }[];
  };
  social: {
    eyebrow: string;
    title: string;
    follow: string;
  };
  order_steps: {
    eyebrow: string;
    title: string;
    s1_title: string;
    s1_desc: string;
    s2_title: string;
    s2_desc: string;
    s3_title: string;
    s3_desc: string;
    s4_title: string;
    s4_desc: string;
  };
  delivery_strip: {
    eyebrow: string;
    title: string;
    b1: string;
    b2: string;
    b3: string;
    b4: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
  };
  quote: {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    whatsapp_cta: string;
  };
  footer: {
    desc: string;
    links_title: string;
    legal_title: string;
    contact_title: string;
    rights: string;
  };
  cart: {
    title: string;
    empty: string;
    empty_sub: string;
    explore: string;
    subtotal: string;
    checkout: string;
    continue: string;
    free_shipping_notice: string;
    quick_add: string;
    added: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    name_label: string;
    phone_label: string;
    city_label: string;
    address_label: string;
    email_label: string;
    notes_label: string;
    terms_notice: string;
    submit: string;
    submitting: string;
    summary_title: string;
    subtotal: string;
    shipping: string;
    free: string;
    total: string;
    cod_reassurance: string;
  };
  order_copy: {
    title: string;
    instruction: string;
    copy_btn: string;
    copied: string;
    track_btn: string;
  };
  order_management: {
    eyebrow: string;
    prompt_title: string;
    prompt_desc: string;
    prompt_modified_notice: string;
    btn_confirm: string;
    btn_confirming: string;
    btn_modify: string;
    btn_cancel: string;
    status_confirmation_label: string;
    status_fulfillment_label: string;
    confirmation_statuses: Record<string, string>;
    fulfillment_statuses: Record<string, string>;
    confirmed_title: string;
    order_number_label: string;
    copy_number_btn: string;
    copied_btn: string;
    track_order_btn: string;
    confirmed_notice: string;
    countdown_text: string;
    order_locked_notice: string;
    contact_support: string;
    cancelled_title: string;
    cancelled_date_prefix: string;
    cancelled_reason_label: string;
    cancelled_stock_freed: string;
    back_to_shop: string;
    order_details_title: string;
    order_placed_on: string;
    quantity_label: string;
    subtotal: string;
    shipping: string;
    free_shipping: string;
    discount: string;
    total_with_tax: string;
    delivery_address_title: string;
    city_label: string;
    address_label: string;
    notes_label: string;
    timeline_title: string;
    in_progress: string;
    cancel_modal_title: string;
    cancel_modal_desc: string;
    cancel_modal_reason_label: string;
    cancel_reasons: string[];
    cancel_keep_btn: string;
    cancel_confirm_btn: string;
    cancel_cancelling: string;
  };
  order_editor: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items_title: string;
    add_product_btn: string;
    per_unit: string;
    remove_item: string;
    empty_items_error: string;
    delivery_title: string;
    city_label: string;
    address_label: string;
    notes_label: string;
    notes_placeholder: string;
    provisional_title: string;
    articles_count: string;
    provisional_notice: string;
    save_btn: string;
    saving_btn: string;
    back_to_order_btn: string;
    modal_title: string;
    modal_search_label: string;
    modal_search_placeholder: string;
    modal_search_btn: string;
    modal_loading: string;
    modal_no_products: string;
    modal_add_btn: string;
    modal_close_btn: string;
  };
  tracking_page: {
    eyebrow: string;
    title: string;
    subtitle: string;
    code_label: string;
    code_placeholder: string;
    phone_label: string;
    phone_placeholder: string;
    submit_btn: string;
    submitting_btn: string;
    error_fallback: string;
  };
}

export const translations: Record<Locale, Dictionary> = {
  ar: {
    locale: 'ar',
    dir: 'rtl',
    announcement: 'تعاونية سويت أركان · أكادير، المغرب · التوصيل لجميع المدن المغربية مع الدفع عند الاستلام',
    brand: {
      name: 'سويت أركان',
      sub: 'تعاونية نسوية فلاحية',
      tagline: 'ذهب المغرب الخالص'
    },
    nav: {
      home: 'الرئيسية',
      shop: 'المتجر',
      categories: 'عوالمنا',
      bestsellers: 'الأكثر طلباً',
      story: 'قصتنا',
      contact: 'تواصل معنا',
      search_placeholder: 'ابحث عن مستحضر، مكون طبيعي…',
      search_button: 'بحث',
      cart: 'السلة',
      tracking: 'تتبع طلبيتي'
    },
    hero: {
      eyebrow: 'الجمال الأصيل ينبض من قلب المغرب',
      title: 'ذهب المغرب الخالص، بين يديكِ بنقاء وأصالة.',
      subtitle: 'اكتشفي مستحضراتنا الطبيعية 100% بزيت الأركان الحيوي المعصور على البارد، طقوس الحمام التقليدي، وكنوز سوس الفاخرة.',
      cta: 'اكتشفي المجموعة',
      whatsapp_cta: 'الطلب عبر واتساب',
      caption_title: 'عالم سويت أركان',
      caption_sub: 'لمسات العناية اليومية تصنع جمالكِ الأصيل.'
    },
    trust: {
      argan_title: 'زيت أركان نقي وبيولوجي 100%',
      argan_sub: 'معصور على البارد بأيدي نساء التعاونية',
      cod_title: 'الدفع عند الاستلام',
      cod_sub: 'ادفعي نقداً عند معاينة واستلام طلبيتكِ',
      shipping_title: 'توصيل سريع خلال 24-48 ساعة',
      shipping_sub: 'توصيل مجاني للطلبات فوق 300 درهم',
      support_title: 'استشارة وتأكيد عبر واتساب',
      support_sub: 'فريقنا في خدمتكم مباشرة على 0661983329'
    },
    categories_section: {
      eyebrow: 'لكل لحظة عناية خاصة',
      title: 'استكشفي عوالمنا السبعة.',
      view_all: 'عرض كافة المنتجات',
      discover: 'اكتشفي'
    },
    bestsellers: {
      eyebrow: 'المنتجات الأكثر مبيعاً وإقبالاً',
      title: 'إبداعات التعاونية المفضلة لدى عميلاتنا.',
      view_all: 'المنتجات الأساسية',
      badge: 'الأكثر طلباً'
    },
    story: {
      eyebrow: 'حكاية أصالة وعطاء وتراث مغربي',
      title: 'في قلب منطقة سوس، تنبض شجرة الأركان بالحياة.',
      p1: 'تأسست تعاونية سويت أركان في منطقة سوس ماسة بمدينة أكادير للحفاظ على التقاليد المغربية المتوارثة في عصر الأركان البري يدوياً وبأعلى معايير الجودة.',
      p2: 'كل قطرة زيت وكل منتج عناية يحمل في طياته بركة أرضنا الكريمة وجهود الصانعات القرويات اللواتي يتقنّ فن انتقاء أجود حبات الأركان لضمان نقاء لا يضاهى.',
      p3: 'نقدم لكِ عناية طبيعية نقية خالية من المواد الكيميائية والبارابين، لتمنحكِ جمالاً حقيقياً ومستداماً.',
      cta: 'تعرفي على التعاونية'
    },
    pillars: {
      eyebrow: 'ميثاق الجودة والأصالة',
      title: 'لماذا تختارين منتجات سويت أركان؟',
      p1_title: 'طبيعي ونقي 100%',
      p1_desc: 'تركيبات نباتية صافية خالية تماماً من البارابين، السلفات والزيوت المعدنية الضارة بصحة بشرتك.',
      p2_title: 'عصر ميكانيكي على البارد',
      p2_desc: 'عصر بارد بدون حرارة أو مذيبات لحفظ كامل الفيتامين E، مضادات الأكسدة والأحماض الدهنية الأساسية.',
      p3_title: 'تعاونية نسوية تضامنية',
      p3_desc: 'كل عملية شراء تدعم بشكل مباشر التمكين الاقتصادي والاجتماعي لنساء وفتيات الأطلس وسوس.',
      p4_title: 'طراوة وإنتاج مستمر',
      p4_desc: 'ننتج كريماتنا وصوابيننا الطبيعية بدفعات صغيرة منتظمة لضمان أعلى درجات الطراوة والفعالية.'
    },
    ingredients: {
      eyebrow: 'في قلب مستحضراتنا',
      title: 'مكونات مغربية نباتية فاخرة.',
      i1_badge: 'إكسير الشباب',
      i1_title: 'زيت الأركان الحيوي الصافي',
      i1_desc: 'غني بأوميغا 6 و9 وفيتامين E لترطيب عميق وتجديد خلايا البشرة واستعادة مرونتها الطبيعية.',
      i2_badge: 'مقاوم الشيخوخة الثمين',
      i2_title: 'زيت بذور التين الشوكي',
      i2_desc: 'أغلى وأندر الزيوت الطبيعية في العالم، يشد البشرة ويخفف التجاعيد والهالات بدقة متناهية.',
      i3_badge: 'تنقية وإزالة السموم',
      i3_title: 'الفحم النباتي المنشط',
      i3_desc: 'يمتص الشوائب والدهون الزائدة من أعماق المسام ويمنحكِ بشرة نقية، صافية ومشرقة بدون جفاف.',
      i4_badge: 'غذاء وطاقة وحيوية',
      i4_title: 'اللوز البلدي والعسل الحر',
      i4_desc: 'في أملو التعاونية التقليدي مع زيت الأركان المحمص، لتذوق أصالة الطعم المغربي الصحي واللذيذ.'
    },
    skincare: {
      eyebrow: 'العناية بالوجه والبشرة',
      title: 'بشرة ناعمة، متغذية ومفعمة بالنضارة.',
      p1: 'اجمعي بين قوة زيت الأركان المرطبة وفخامة الروائح الشرقية الأصلية (العود الملكي، التين الشوكي).',
      p2: 'كريمات غنية صُممت خصيصاً لحماية البشرة من الجفاف ومنحكِ إشراقة طبيعية تدوم طوال اليوم.',
      cta: 'اكتشفي كريمات الوجه'
    },
    hammam: {
      eyebrow: 'طقوس الحمام المغربي التقليدي',
      title: 'تنقية، استرخاء وانتعاش لا مثيل له.',
      p1: 'استمتعي بأجواء الحمام المغربي العريق في بيتكِ مع الطين المغربي النقي (الأخضر والأحمر) والصوابين الطبيعية المعطرة.',
      p2: 'طقس عناية متكامل ينظف البشرة بعمق، يزيل الخلايا الميتة ويترك ملمساً حريرياً ناعماً معطراً بالمسك والورد.',
      cta: 'اكتشفي مستلزمات الحمام'
    },
    featured: {
      eyebrow: 'مختارات مميزة للموسم',
      title: 'اكتشفي أحدث إبداعاتنا الطبيعية.',
      view_all: 'كافة المنتجات'
    },
    gift_set: {
      eyebrow: 'العلبة الفاخرة للتعاونية',
      title: 'باك تيموموشين · التجربة الملكية المتكاملة',
      desc: 'الطقس المتكامل من سويت أركان: يجمع أفضل كريمات العناية، الصوابين الطبيعية، أملو البلدي وزيت الأركان الصافي في علبة راقية ومثالية للإهداء.',
      order_cta: 'اطلبي باك تيموموشين',
      quick_buy: 'شراء سريع'
    },
    testimonials: {
      eyebrow: 'آراء وشهادات عميلاتنا',
      title: 'ثقة عميلاتنا في مختلف ربوع المملكة.',
      list: [
        {
          name: 'فاطمة الزهراء، الدار البيضاء',
          quote: 'كريم الأركان وصابون الفحم غيرا بشرتي تماماً! أصبحت ناعمة ونضرة بدون أي شوائب، والمنتجات طبيعية 100% ورائحتها راقية.'
        },
        {
          name: 'ياسين، الرباط',
          quote: 'توصلت بباك تيموموشين في أقل من 24 ساعة مع الدفع عند الاستلام. الأملو وزيت الأركان رائعين جداً وجودة التغليف فاخرة.'
        },
        {
          name: 'خديجة، مراكش',
          quote: 'مزيل العرق بالمسك وزيت التسمير ممتازين جداً وطبيعيين. تعامل راقي وسريع من فريق التعاونية عبر الواتساب.'
        }
      ]
    },
    social: {
      eyebrow: 'انضمي لعائلة سويت أركان',
      title: 'يوميات التعاونية على إنستغرام.',
      follow: 'تابعونا على إنستغرام'
    },
    order_steps: {
      eyebrow: 'تسوقي بكل سهولة وأمان',
      title: 'كيف تطلبين من سويت أركان؟',
      s1_title: '01. اختاري مستحضراتكِ',
      s1_desc: 'تصفحي عوالمنا وأضيفي منتجاتكِ المفضلة إلى السلة بنقرة واحدة.',
      s2_title: '02. بدون بطاقة بنكية',
      s2_desc: 'أدخلي فقط اسمكِ، رقم هاتفكِ ومدينتكِ. لا نطلب أي دفع مسبق في الموقع.',
      s3_title: '03. تأكيد سريع لطلبكِ',
      s3_desc: 'أكدي طلبكِ مباشرة عبر الموقع أو تواصلي مع فريقنا عبر واتساب للتعديل.',
      s4_title: '04. الدفع عند الاستلام',
      s4_desc: 'يسلمكِ الموزع طردكِ خلال 24-48 ساعة، وتدفعين نقداً فقط عند استلام طلبيتكِ.'
    },
    delivery_strip: {
      eyebrow: 'توصيل لجميع أنحاء المغرب',
      title: 'الدار البيضاء، الرباط، مراكش، أكادير، طنجة، فاس وكافة مدن وقرى المملكة.',
      b1: '35 درهم سعر توصيل موحد',
      b2: 'التوصيل مجاني ابتداءً من 300 درهم',
      b3: 'شحن سريع خلال 24 إلى 48 ساعة',
      b4: 'تغليف آمن ومحكم الإغلاق'
    },
    faq: {
      eyebrow: 'الأسئلة الشائعة',
      title: 'كل ما ترغبين في معرفته.',
      q1: 'كيف يتم الدفع عند الاستلام في المغرب؟',
      a1: 'لا تدفعين أي مبلغ عبر الإنترنت. تقومين بالدفع نقداً (بالدرهم المغربي) لموظف التوصيل مباشرة عند تسليمكِ الطرد يداً بيد في عنوانكِ.',
      q2: 'ما هي مدة التوصيل؟',
      a2: 'يتم تجهيز كافة الطلبات في ورشتنا بأكادير وشحنها فوراً. يستغرق التوصيل عادة بين 24 و48 ساعة عمل للمدن الكبرى، وحوالي 72 ساعة للمناطق الأخرى.',
      q3: 'هل المنتجات طبيعية ومناسبة للبشرة الحساسة؟',
      a3: 'نعم بالتأكيد! كافة مستحضراتنا محضرة من زيوت نقية ومستخلصات نباتية لطيفة خالية من البارابين والسلفات، ومناسبة لجميع أنواع البشرة حتى الحساسة.',
      q4: 'هل يمكنني الطلب أو الاستفسار مباشرة عبر واتساب؟',
      a4: 'بكل سرور! فريق خدمة العملاء متاح 7/7 أيام عبر الرقم 0661983329 لمساعدتكِ في اختيار المنتجات وتتبع طلبيتكِ خطوة بخطوة.'
    },
    quote: {
      eyebrow: 'عناية طبيعية مغربية أصيلة',
      title: 'الجمال يُزرع باعتناء.\nخطوة بعد خطوة.',
      sub: 'اكتشفي المنتجات التي ستصبح جزءاً أساسياً من روتينكِ اليومي.',
      cta: 'اكتشفي روتينكِ الآن',
      whatsapp_cta: 'تواصلي معنا عبر واتساب'
    },
    footer: {
      desc: 'تعاونية فلاحية نسوية متخصصة في إنتاج زيت الأركان البيولوجي، مستحضرات التجميل الطبيعية ومنتجات التراث المغربي الأصيل. أكادير، المملكة المغربية.',
      links_title: 'المتجر والعوالم',
      legal_title: 'معلومات قانونية',
      contact_title: 'خدمة العملاء',
      rights: 'جميع الحقوق محفوظة © تعاونية سويت أركان 2026'
    },
    cart: {
      title: 'سلة مشترياتكِ',
      empty: 'سلتكِ فارغة حالياً.',
      empty_sub: 'اكتشفي مستحضرات سويت أركان وابدئي رحلة العناية الطبيعية.',
      explore: 'تصفحي المتجر',
      subtotal: 'المجموع الجزئي',
      checkout: 'إتمام الطلب الآن',
      continue: 'متابعة التسوق',
      free_shipping_notice: 'التوصيل مجاني للطلبات فوق 300 درهم!',
      quick_add: 'أضيفي للسلة',
      added: 'تمت الإضافة'
    },
    checkout: {
      title: 'تأكيد طلبيتكِ',
      subtitle: 'بدون بطاقة بنكية · الدفع نقداً عند استلام طلبيتكِ بالمغرب',
      name_label: 'الاسم الكامل *',
      phone_label: 'رقم الهاتف المحمول *',
      city_label: 'المدينة *',
      address_label: 'العنوان الكامل للتوصيل *',
      email_label: 'البريد الإلكتروني (اختياري)',
      notes_label: 'ملاحظات وتوجيهات للتوصيل (اختياري)',
      terms_notice: 'بإرسال الطلب، فإنكِ توافقين على شروط البيع وسياسة الخصوصية الخاصة بالتعاونية.',
      submit: 'تأكيد الطلب الآن',
      submitting: 'جاري تسجيل الطلب…',
      summary_title: 'ملخص مشترياتكِ',
      subtotal: 'المجموع الجزئي',
      shipping: 'مصاريف التوصيل',
      free: 'مجاناً',
      total: 'المجموع الإجمالي',
      cod_reassurance: 'الدفع عند الاستلام نقداً للموزع'
    },
    order_copy: {
      title: 'رقم طلبيتكِ الخاص',
      instruction: 'يرجى نسخ هذا الرقم والاحتفاظ به حتى تتمكني من تتبع مسار شحنتكِ ومعرفة موعد وصول الموزع بدقة.',
      copy_btn: 'نسخ رقم الطلب',
      copied: '✓ تم نسخ رقم الطلب بنجاح!',
      track_btn: 'تتبع طلبيتي الآن'
    },
    order_management: {
      eyebrow: 'سويت أركان · إدارة وتتبع الطلب',
      prompt_title: 'هل ترغب في تأكيد طلبك؟',
      prompt_desc: 'تحقق من المعلومات أسفله ثم قم بتأكيد طلبك. سيكون لديك 24 ساعة لتعديله أو إلغائه عبر الموقع ما دام تحضيره لم يبدأ بعد.',
      prompt_modified_notice: '⚠️ تم تعديل طلبك. يرجى تأكيد النسخة الجديدة لبدء تحضيرها وإرسالها.',
      btn_confirm: '✅ تأكيد الطلب',
      btn_confirming: 'جاري الحفظ…',
      btn_modify: '✏️ تعديل الطلب',
      btn_cancel: '❌ إلغاء الطلب',
      status_confirmation_label: 'التأكيد',
      status_fulfillment_label: 'التوصيل',
      confirmation_statuses: {
        pending: 'في انتظار التأكيد',
        confirmed: 'تم التأكيد',
        needs_review: 'قيد المراجعة',
        rejected: 'مرفوض',
        expired: 'منتهي الصلاحية'
      },
      fulfillment_statuses: {
        new: 'تم استلام الطلب',
        processing: 'قيد التحضير',
        ready: 'جاهز للشحن',
        shipped: 'تم الشحن',
        delivered: 'تم التوصيل',
        cancelled: 'ملغى',
        returned: 'مرتجع'
      },
      confirmed_title: 'تم تأكيد طلبك بنجاح 🎉',
      order_number_label: 'رقم الطلب :',
      copy_number_btn: 'نسخ رقم الطلب',
      copied_btn: '✓ تم نسخ الرقم !',
      track_order_btn: 'تتبع طلبي',
      confirmed_notice: 'احتفظ برقم الطلب لتتبع شحنتك. يمكنك تعديل أو إلغاء الطلب خلال 24 ساعة ما دام تحضيره لم يبدأ بعد.',
      countdown_text: 'يمكنك تعديل أو إلغاء هذا الطلب خلال {time} ما دام تحضيره لم يبدأ.',
      order_locked_notice: '🔒 لم يعد بالإمكان تعديل أو إلغاء هذا الطلب عبر الموقع (بدأ التحضير أو انتهت مهلة 24 ساعة).',
      contact_support: 'تواصل مع سويت أركان',
      cancelled_title: 'تم إلغاء الطلب',
      cancelled_date_prefix: 'تم إلغاء هذا الطلب بتاريخ ',
      cancelled_reason_label: 'سبب الإلغاء :',
      cancelled_stock_freed: 'تم تحرير المخزون المحجوز لمنتجاتك على الفور.',
      back_to_shop: 'العودة إلى المتجر',
      order_details_title: 'تفاصيل الطلب',
      order_placed_on: 'تم تقديم الطلب في',
      quantity_label: 'الكمية :',
      subtotal: 'المجموع الفرعي',
      shipping: 'التوصيل',
      free_shipping: 'مجاني',
      discount: 'الخصم',
      total_with_tax: 'المجموع الإجمالي',
      delivery_address_title: 'عنوان التوصيل',
      city_label: 'المدينة :',
      address_label: 'العنوان :',
      notes_label: 'ملاحظة التوصيل :',
      timeline_title: 'مراحل وتتبع طلبك',
      in_progress: 'قيد الإنجاز…',
      cancel_modal_title: 'هل ترغب في إلغاء هذا الطلب؟',
      cancel_modal_desc: 'هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ سيتم تحرير المخزون المحجوز لمنتجاتك فوراً.',
      cancel_modal_reason_label: 'سبب الإلغاء (اختياري)',
      cancel_reasons: ['لم أعد أرغب في الطلب', 'خطأ في المنتجات', 'تغيير رأي', 'أخرى'],
      cancel_keep_btn: 'الاحتفاظ بالطلب',
      cancel_confirm_btn: 'تأكيد الإلغاء',
      cancel_cancelling: 'جاري الإلغاء…'
    },
    order_editor: {
      eyebrow: 'سويت أركان · تعديل الطلب',
      title: 'تعديل طلبك',
      subtitle: 'أنت تعدل طلبك مباشرة. سيتم التحقق من الأسعار والمخزون ومصاريف التوصيل تلقائياً عند الحفظ.',
      items_title: 'منتجات الطلب',
      add_product_btn: '+ إضافة منتج',
      per_unit: 'للوحدة',
      remove_item: 'حذف',
      empty_items_error: 'يجب أن يحتوي طلبك على منتج واحد على الأقل.',
      delivery_title: 'عنوان التوصيل',
      city_label: 'مدينة التوصيل',
      address_label: 'العنوان الكامل',
      notes_label: 'تعليمات التوصيل (اختياري)',
      notes_placeholder: 'أي توجيهات للموزع...',
      provisional_title: 'الملخص التقديري',
      articles_count: 'المنتجات',
      provisional_notice: 'ℹ️ سيتم إعادة احتساب المجموع النهائي ومصاريف التوصيل تلقائياً من قبل الخادم. ستتمكن من تأكيد النسخة الجديدة في الصفحة الموالية.',
      save_btn: 'حفظ التعديلات',
      saving_btn: 'جاري الحفظ…',
      back_to_order_btn: 'العودة إلى الطلب',
      modal_title: 'إضافة منتج إلى طلبك',
      modal_search_label: 'بحث بالاسم',
      modal_search_placeholder: 'ابحث عن زيت أركان، صابون، كريم…',
      modal_search_btn: 'بحث',
      modal_loading: 'جاري تحميل المنتجات…',
      modal_no_products: 'لم يتم العثور على أي منتج.',
      modal_add_btn: 'إضافة',
      modal_close_btn: 'إغلاق'
    },
    tracking_page: {
      eyebrow: 'سويت أركان · فضاء الزبناء',
      title: 'تتبع طلبيتي',
      subtitle: 'تحققي من مراحل شحنتكِ، أكدي طلبكِ أو عدليه بإدخال رقم الطلب ورقم هاتفكِ المحمول.',
      code_label: 'رقم الطلب (مثال: SA-2026-00000001)',
      code_placeholder: 'SA-2026-00000001',
      phone_label: 'رقم الهاتف المسجل عند الطلب',
      phone_placeholder: '06 61 98 33 29',
      submit_btn: 'البحث عن طلبيتي',
      submitting_btn: 'جاري البحث…',
      error_fallback: 'الخدمة غير متوفرة مؤقتاً. يرجى إعادة المحاولة.'
    }
  },
  fr: {
    locale: 'fr',
    dir: 'ltr',
    announcement: "Sweet Argan · Coopérative marocaine d'Agadir · Livraison dans tout le Maroc avec paiement à la livraison",
    brand: {
      name: 'Sweet Argan',
      sub: 'COOPÉRATIVE MAROCAINE',
      tagline: "L'or du Maroc"
    },
    nav: {
      home: 'Accueil',
      shop: 'La boutique',
      categories: 'Nos univers',
      bestsellers: 'Les essentiels',
      story: 'Notre histoire',
      contact: 'Contact',
      search_placeholder: 'Rechercher un soin, un ingrédient…',
      search_button: 'Rechercher',
      cart: 'Panier',
      tracking: 'Suivi de commande'
    },
    hero: {
      eyebrow: 'LA BEAUTÉ PREND RACINE AU MAROC',
      title: "L'or du Maroc, sublimé au creux de votre main.",
      subtitle: "Découvrez nos soins purs à l'huile d'argan biologique, rituels de hammam traditionnels et délices authentiques du terroir du Souss.",
      cta: 'Découvrir la collection',
      whatsapp_cta: 'Commander sur WhatsApp',
      caption_title: 'L’UNIVERS SWEET ARGAN',
      caption_sub: 'Les petits gestes font les beaux rituels.'
    },
    trust: {
      argan_title: "Huile d'argan 100% pure & bio",
      argan_sub: 'Pressée à froid par la coopérative',
      cod_title: 'Paiement à la livraison',
      cod_sub: 'Réglez en espèces à la réception',
      shipping_title: 'Livraison 24/48h partout au Maroc',
      shipping_sub: 'Offerte dès 300 MAD d’achat',
      support_title: 'Conseil & confirmation WhatsApp',
      support_sub: 'Assistance directe au +212 661-983329'
    },
    categories_section: {
      eyebrow: 'À CHACUN SA DOUCEUR',
      title: 'Explorez nos univers.',
      view_all: 'Toute la collection',
      discover: 'Découvrir'
    },
    bestsellers: {
      eyebrow: 'LES INCONTOURNABLES DE LA COOPÉRATIVE',
      title: 'Nos créations les plus appréciées.',
      view_all: 'Les indispensables',
      badge: 'LES ESSENTIELS'
    },
    story: {
      eyebrow: 'UNE HISTOIRE DE NATURE & DE TRANSMISSION',
      title: "Au cœur du Souss, l'âme de l'arganier.",
      p1: "Implantée au cœur du Souss dans la région d'Agadir, la coopérative Sweet Argan valorise les trésors botaniques marocains selon des méthodes artisanales authentiques.",
      p2: "Nos huiles sont extraites mécaniquement à froid sans solvant pour préserver leur exceptionnelle richesse en vitamine E et oméga-6.",
      p3: "Nous défendons une beauté sincère et respectueuse, fruit de l'autonomie et du savoir-faire des femmes de notre région.",
      cta: 'Rencontrer la coopérative'
    },
    pillars: {
      eyebrow: 'NOTRE ENGAGEMENT QUALITÉ',
      title: 'Pourquoi choisir Sweet Argan ?',
      p1_title: '100% Naturel & Pur',
      p1_desc: 'Des formules saines et sans parabènes, sulfates ni dérivés pétrochimiques.',
      p2_title: 'Savoir-Faire Artisanal',
      p2_desc: 'Pressage mécanique à froid pour préserver la totalité des vitamines et antioxydants.',
      p3_title: 'Coopérative Solidaire',
      p3_desc: 'Soutien direct et valorisation du travail des femmes artisanes du sud marocain.',
      p4_title: 'Fraîcheur Garantie',
      p4_desc: 'Production artisanale en petites séries pour garantir une texture et une efficacité parfaites.'
    },
    ingredients: {
      eyebrow: 'AU CŒUR DE NOS SOINS',
      title: "Des ingrédients nobles d'origine marocaine.",
      i1_badge: 'Élixir Solaire',
      i1_title: "Huile d'Argan Pure Bio",
      i1_desc: 'Hydrate intensément, régénère la barrière cutanée et protège la peau de la déshydratation.',
      i2_badge: 'Anti-Âge Précieux',
      i2_title: 'Figue de Barbarie',
      i2_desc: 'Riche en stérols et vitamine K, elle redonne fermeté et éclat aux peaux matures.',
      i3_badge: 'Détox Profonde',
      i3_title: 'Charbon Végétal Actif',
      i3_desc: 'Désincruste les pores et absorbe le sébum sans jamais tirailler la peau.',
      i4_badge: 'Gourmandise & Force',
      i4_title: 'Amandes Beldi & Miel',
      i4_desc: 'Dans notre Amlou traditionnel avec l’huile d’argan torréfiée pour une énergie pure et saine.'
    },
    skincare: {
      eyebrow: 'SOINS DU VISAGE',
      title: 'Une peau nourrie, douce et rayonnante.',
      p1: "Découvrez l'alliance unique entre la nutrition protectrice de l'argan et le raffinement des senteurs orientales (Oud impérial, Figue de Barbarie).",
      p2: 'Des crèmes onctueuses testées pour apaiser et révéler un éclat naturel durable.',
      cta: 'Voir les soins visage'
    },
    hammam: {
      eyebrow: 'RITUEL DU HAMMAM & DU BAIN',
      title: 'Purification, bien-être et renaissance.',
      p1: 'Recréez chez vous l’atmosphère bienfaisante des bains marocains traditionnels avec nos argiles pures et nos savons doux.',
      p2: 'Un rituel complet qui nettoie en profondeur et laisse un voile soyeux délicatement parfumé.',
      cta: 'Découvrir le rituel hammam'
    },
    featured: {
      eyebrow: 'SÉLECTIONS SPÉCIALES',
      title: 'Les trouvailles bien-être de la saison.',
      view_all: 'Tout le catalogue'
    },
    gift_set: {
      eyebrow: 'LE COFFRET EMBLÉMATIQUE DE LA COOPÉRATIVE',
      title: 'Pack Timomouchin · L’expérience complète',
      desc: 'Le rituel prestige complet signé Sweet Argan : réunissant nos crèmes signatures, nos savons naturels, l’amlou artisanal et l’huile d’argan pure dans un coffret raffiné.',
      order_cta: 'Commander le Pack Timomouchin',
      quick_buy: 'Commander en 1 clic'
    },
    testimonials: {
      eyebrow: 'VOS MOTS, NOTRE FIERTÉ',
      title: 'Ce que disent nos clientes au Maroc.',
      list: [
        {
          name: 'Fatima-Zahra, Casablanca',
          quote: "La crème d'argan et le savon au charbon ont complètement transformé ma peau. Un vrai rituel de douceur et d'authenticité marocaine !"
        },
        {
          name: 'Yassine, Rabat',
          quote: "Pack Timomouchin reçu en 24h avec paiement à la livraison. L'amlou et l'huile sont exceptionnels, le packaging est magnifique."
        },
        {
          name: 'Khadija, Marrakech',
          quote: "Le déodorant naturel au musc et l'huile de bronzage sentent divinement bon. Produits 100% naturels et une équipe à l'écoute."
        }
      ]
    },
    social: {
      eyebrow: 'LA BEAUTÉ AU QUOTIDIEN',
      title: 'Les instants Sweet Argan sur Instagram.',
      follow: 'Suivez-nous sur Instagram'
    },
    order_steps: {
      eyebrow: 'EN TOUTE SÉRÉNITÉ',
      title: 'Comment commander chez Sweet Argan ?',
      s1_title: '01. Choisissez vos soins',
      s1_desc: 'Explorez nos univers et ajoutez vos soins favoris au panier en quelques clics.',
      s2_title: '02. Sans carte bancaire',
      s2_desc: 'Indiquez uniquement votre nom, téléphone et ville. Aucun paiement n’est demandé en ligne.',
      s3_title: '03. Confirmation rapide',
      s3_desc: 'Validez sur votre écran ou échangez avec notre équipe par WhatsApp pour ajuster votre commande.',
      s4_title: '04. Paiement à la livraison',
      s4_desc: 'Le livreur vous remet votre colis sous 24-48h. Vous réglez en espèces directement à la réception.'
    },
    delivery_strip: {
      eyebrow: 'LIVRAISON PARTOUT AU MAROC',
      title: 'À Casablanca, Rabat, Marrakech, Agadir, Tanger, Fès et dans toutes les villes du Royaume.',
      b1: '35 MAD Tarif Forfaitaire',
      b2: 'Livraison OFFERTE dès 300 MAD',
      b3: 'Expédition 24h / 48h ouvrables',
      b4: 'Emballage éco-responsable scellé'
    },
    faq: {
      eyebrow: 'QUESTIONS FRÉQUENTES',
      title: 'Tout ce que vous souhaitez savoir.',
      q1: 'Comment fonctionne le paiement à la livraison au Maroc ?',
      a1: 'Vous ne payez rien lors de la commande sur le site. Vous réglez le montant exact en espèces (Dirhams MAD) directement au livreur qui vous remet votre colis.',
      q2: 'Quels sont les délais d’expédition et de réception ?',
      a2: 'Toutes les commandes sont préparées à notre atelier d’Agadir et expédiées sous 24 heures. La livraison s’effectue en 24h à 48h ouvrables.',
      q3: 'Les produits sont-ils adaptés aux peaux sensibles ?',
      a3: 'Oui. Nos formules sont élaborées à partir d’huiles vierges pures et d’actifs botaniques doux, sans perturbateurs endocriniens ni parabènes.',
      q4: 'Puis-je commander directement sur WhatsApp ?',
      a4: 'Bien sûr ! Notre service client est disponible 7j/7 au +212 661-983329 pour vous conseiller et prendre votre commande.'
    },
    quote: {
      eyebrow: 'PRENDRE SOIN DE SOI AU NATUREL',
      title: 'La douceur se cultive.\nUn geste après l’autre.',
      sub: 'Découvrez les produits qui trouveront leur place dans votre rituel quotidien.',
      cta: 'Trouver mon rituel',
      whatsapp_cta: 'Nous écrire sur WhatsApp'
    },
    footer: {
      desc: "Coopérative Agricole Féminine Sweet Argan · Huile d'Argan cosmétique & alimentaire, soins naturels et délices du terroir marocain. Agadir, Maroc.",
      links_title: 'Boutique & Univers',
      legal_title: 'Informations légales',
      contact_title: 'Service client',
      rights: 'Tous droits réservés © Coopérative Sweet Argan 2026'
    },
    cart: {
      title: 'Votre panier',
      empty: 'Votre panier est vide.',
      empty_sub: 'Découvrez la collection Sweet Argan et composez votre rituel.',
      explore: 'Explorer la boutique',
      subtotal: 'Sous-total estimé',
      checkout: 'Passer la commande',
      continue: 'Continuer mes découvertes',
      free_shipping_notice: 'Livraison gratuite dès 300 MAD d’achat !',
      quick_add: 'Ajouter au panier',
      added: 'Ajouté'
    },
    checkout: {
      title: 'Votre commande',
      subtitle: 'Sans création de compte · Paiement en espèces à la livraison au Maroc',
      name_label: 'Nom complet *',
      phone_label: 'Téléphone mobile *',
      city_label: 'Ville *',
      address_label: 'Adresse complète de livraison *',
      email_label: 'E-mail (facultatif)',
      notes_label: 'Indications de livraison (facultatif)',
      terms_notice: 'En passant commande, vous acceptez les conditions de vente et la politique de confidentialité.',
      submit: 'Commander',
      submitting: 'Enregistrement…',
      summary_title: 'Votre sélection',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      free: 'Offerte',
      total: 'Total estimé',
      cod_reassurance: 'Paiement à la livraison en espèces'
    },
    order_copy: {
      title: 'Votre numéro de commande',
      instruction: 'Veuillez copier et conserver ce numéro pour suivre l’acheminement de votre colis à tout moment.',
      copy_btn: 'Copier le numéro de commande',
      copied: '✓ Numéro copié avec succès !',
      track_btn: 'Suivre ma commande'
    },
    order_management: {
      eyebrow: 'SWEET ARGAN · SUIVI DE COMMANDE',
      prompt_title: 'Souhaitez-vous confirmer votre commande ?',
      prompt_desc: 'Vérifiez les informations ci-dessous puis confirmez votre commande. Vous disposerez ensuite de 24 heures pour la modifier ou l’annuler en ligne tant que sa préparation n’a pas commencé.',
      prompt_modified_notice: '⚠️ Votre commande a été modifiée. Veuillez confirmer la nouvelle version pour lancer sa prise en charge.',
      btn_confirm: '✅ Confirmer la commande',
      btn_confirming: 'Enregistrement…',
      btn_modify: '✏️ Modifier la commande',
      btn_cancel: '❌ Annuler la commande',
      status_confirmation_label: 'Confirmation',
      status_fulfillment_label: 'Livraison',
      confirmation_statuses: {
        pending: 'À confirmer',
        confirmed: 'Confirmée',
        needs_review: 'À examiner',
        rejected: 'Refusée',
        expired: 'Expirée'
      },
      fulfillment_statuses: {
        new: 'Commande reçue',
        processing: 'En préparation',
        ready: 'Prête pour expédition',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée',
        returned: 'Retournée'
      },
      confirmed_title: 'Commande confirmée 🎉',
      order_number_label: 'Numéro de commande :',
      copy_number_btn: 'Copier le numéro',
      copied_btn: '✓ Numéro copié !',
      track_order_btn: 'Suivre ma commande',
      confirmed_notice: 'Conservez ce numéro pour suivre votre commande. Les modifications sont possibles pendant 24 heures après confirmation, tant que sa préparation n’a pas commencé.',
      countdown_text: 'Vous pouvez encore modifier ou annuler cette commande pendant {time}, tant que sa préparation n’a pas commencé.',
      order_locked_notice: '🔒 Cette commande ne peut plus être modifiée ou annulée en ligne (la préparation a commencé ou le délai de 24 h est écoulé).',
      contact_support: 'Contacter Sweet Argan',
      cancelled_title: 'Commande annulée',
      cancelled_date_prefix: 'Cette commande a été annulée le ',
      cancelled_reason_label: 'Motif :',
      cancelled_stock_freed: 'Le stock réservé pour vos articles a été immédiatement libéré.',
      back_to_shop: 'Retourner à la boutique',
      order_details_title: 'Détails de la commande',
      order_placed_on: 'Commande passée le',
      quantity_label: 'Quantité :',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      free_shipping: 'Gratuite',
      discount: 'Remise',
      total_with_tax: 'Total TTC',
      delivery_address_title: 'Adresse de livraison',
      city_label: 'Ville :',
      address_label: 'Adresse :',
      notes_label: 'Note de livraison :',
      timeline_title: 'Suivi et étapes de votre commande',
      in_progress: 'En cours…',
      cancel_modal_title: 'Annuler cette commande ?',
      cancel_modal_desc: 'Êtes-vous sûr de vouloir annuler cette commande ? Le stock réservé pour vos articles sera immédiatement libéré.',
      cancel_modal_reason_label: 'Motif (facultatif)',
      cancel_reasons: ['Je ne souhaite plus commander', 'Erreur dans la commande', 'Changement d’avis', 'Autre'],
      cancel_keep_btn: 'Conserver la commande',
      cancel_confirm_btn: 'Confirmer l’annulation',
      cancel_cancelling: 'Annulation…'
    },
    order_editor: {
      eyebrow: 'SWEET ARGAN · MODIFICATION',
      title: 'Modifier votre commande',
      subtitle: 'Vous modifiez directement votre commande existante. Les prix, la disponibilité du stock et les frais de livraison seront vérifiés par le serveur lors de l’enregistrement.',
      items_title: 'Articles de la commande',
      add_product_btn: '+ Ajouter un produit',
      per_unit: '/ unité',
      remove_item: 'Retirer',
      empty_items_error: 'Votre commande doit contenir au moins un produit. Ajoutez un produit ou retournez à la commande pour l’annuler.',
      delivery_title: 'Adresse de livraison',
      city_label: 'Ville de livraison',
      address_label: 'Adresse complète',
      notes_label: 'Précisions de livraison (facultatif)',
      notes_placeholder: 'Instructions pour le livreur...',
      provisional_title: 'Récapitulatif provisoire',
      articles_count: 'Articles',
      provisional_notice: 'ℹ️ Le total définitif et les frais de livraison seront recalculés automatiquement par le serveur. Vous pourrez confirmer la nouvelle version sur la page suivante.',
      save_btn: 'Enregistrer les modifications',
      saving_btn: 'Enregistrement…',
      back_to_order_btn: 'Retour à la commande',
      modal_title: 'Ajouter un produit',
      modal_search_label: 'Rechercher par nom',
      modal_search_placeholder: 'ex. Huile d’argan, Savon…',
      modal_search_btn: 'Rechercher',
      modal_loading: 'Chargement du catalogue…',
      modal_no_products: 'Aucun produit trouvé.',
      modal_add_btn: 'Ajouter',
      modal_close_btn: 'Fermer'
    },
    tracking_page: {
      eyebrow: 'SWEET ARGAN · ESPACE CLIENT',
      title: 'Suivre ma commande',
      subtitle: 'Consultez l’état d’avancement de votre commande, confirmez-la ou modifiez-la en saisissant votre numéro public de commande et votre numéro de téléphone.',
      code_label: 'Numéro de commande (ex: SA-2026-00000001)',
      code_placeholder: 'SA-2026-00000001',
      phone_label: 'Numéro de téléphone utilisé lors de la commande',
      phone_placeholder: '06 61 98 33 29',
      submit_btn: 'Retrouver ma commande',
      submitting_btn: 'Recherche en cours…',
      error_fallback: 'Service momentanément indisponible. Réessayez.'
    }
  },
  en: {
    locale: 'en',
    dir: 'ltr',
    announcement: 'Sweet Argan · Moroccan Cooperative from Agadir · Delivery all across Morocco with Cash on Delivery',
    brand: {
      name: 'Sweet Argan',
      sub: 'MOROCCAN COOPERATIVE',
      tagline: 'The Gold of Morocco'
    },
    nav: {
      home: 'Home',
      shop: 'Shop',
      categories: 'Collections',
      bestsellers: 'Best Sellers',
      story: 'Our Story',
      contact: 'Contact',
      search_placeholder: 'Search skincare, ingredients…',
      search_button: 'Search',
      cart: 'Cart',
      tracking: 'Track My Order'
    },
    hero: {
      eyebrow: 'BEAUTY ROOTED IN MOROCCO',
      title: 'The pure gold of Morocco, sublimed in your hands.',
      subtitle: 'Discover our 100% pure organic cold-pressed argan oil treatments, ancestral hammam rituals, and authentic Souss botanical treasures.',
      cta: 'Discover the Collection',
      whatsapp_cta: 'Order via WhatsApp',
      caption_title: 'SWEET ARGAN UNIVERSE',
      caption_sub: 'Small daily gestures create beautiful rituals.'
    },
    trust: {
      argan_title: '100% Pure & Organic Argan Oil',
      argan_sub: 'Cold-pressed by our women artisans',
      cod_title: 'Cash on Delivery',
      cod_sub: 'Pay in cash upon package delivery',
      shipping_title: '24/48h Nationwide Delivery',
      shipping_sub: 'Free shipping on orders over 300 MAD',
      support_title: 'WhatsApp Assistance & Care',
      support_sub: 'Direct support at +212 661-983329'
    },
    categories_section: {
      eyebrow: 'A TOUCH OF SOFTNESS FOR EVERYONE',
      title: 'Explore Our Seven Universes.',
      view_all: 'View Full Collection',
      discover: 'Discover'
    },
    bestsellers: {
      eyebrow: 'COOPERATIVE ESSENTIALS',
      title: 'Our Most Cherished Creations.',
      view_all: 'All Essentials',
      badge: 'BEST SELLER'
    },
    story: {
      eyebrow: 'A STORY OF NATURE & HERITAGE',
      title: 'At the Heart of Souss, the Soul of the Argan Tree.',
      p1: 'Rooted in the fertile Souss-Massa plains in Agadir, the Sweet Argan cooperative preserves the ancestral Moroccan traditions of wild argan cold pressing.',
      p2: 'Every drop of oil and jar of cream embodies the fertility of our soil and the dedication of our women artisans who master this timeless craft.',
      p3: 'We deliver clean, sustainable cosmetics free from parabens, sulfates, and synthetic fillers for genuine radiant skin.',
      cta: 'Meet the Cooperative'
    },
    pillars: {
      eyebrow: 'OUR QUALITY PLEDGE',
      title: 'Why Choose Sweet Argan?',
      p1_title: '100% Pure & Natural',
      p1_desc: 'Clean formulas formulated without parabens, sulfates, or artificial fragrances.',
      p2_title: 'Artisanal Cold-Pressed',
      p2_desc: 'Cold mechanical pressing preserving essential fatty acids and native vitamin E.',
      p3_title: 'Ethical Women’s Cooperative',
      p3_desc: 'Direct economic empowerment and fair living wages for rural Moroccan women.',
      p4_title: 'Small Batch Freshness',
      p4_desc: 'Handcrafted in small batches ensuring premium freshness, texture, and efficacy.'
    },
    ingredients: {
      eyebrow: 'AT THE CORE OF OUR FORMULAS',
      title: 'Precious Moroccan Botanical Treasures.',
      i1_badge: 'Liquid Gold',
      i1_title: 'Pure Organic Argan Oil',
      i1_desc: 'Abundant in omega-6 & 9 and vitamin E to nourish, repair, and restore deep elasticity.',
      i2_badge: 'Rare Anti-Aging',
      i2_title: 'Prickly Pear Seed Oil',
      i2_desc: 'One of the most potent natural anti-aging elixirs, smoothing fine lines and firming skin.',
      i3_badge: 'Deep Detox',
      i3_title: 'Activated Plant Charcoal',
      i3_desc: 'Draws out impurities and absorbs excess sebum without drying or tightening skin.',
      i4_badge: 'Nourishing Vitality',
      i4_title: 'Beldi Almonds & Pure Honey',
      i4_desc: 'Blended with toasted culinary argan oil in our authentic Amlou for natural wholesome energy.'
    },
    skincare: {
      eyebrow: 'FACIAL SKINCARE',
      title: 'Nourished, Soft, and Radiant Skin.',
      p1: 'Experience the harmonious synergy of argan nutrition and precious oriental aromas (Imperial Oud, Prickly Pear).',
      p2: 'Velvety creams formulated to soothe delicate skin and unveil enduring natural radiance.',
      cta: 'Explore Facial Skincare'
    },
    hammam: {
      eyebrow: 'HAMMAM & BATH RITUALS',
      title: 'Purification, Relaxation, and Renewal.',
      p1: 'Bring the authentic Moroccan bath tradition home with our purifying volcanic clays and botanical soaps.',
      p2: 'A deeply restorative ritual that cleanses pores and leaves a silky, fragrant protective veil.',
      cta: 'Explore Hammam Rituals'
    },
    featured: {
      eyebrow: 'SEASONAL SELECTIONS',
      title: 'Seasonal Highlights for Your Routine.',
      view_all: 'Full Catalog'
    },
    gift_set: {
      eyebrow: 'SIGNATURE COOPERATIVE GIFT SET',
      title: 'Pack Timomouchin · The Royal Experience',
      desc: 'The ultimate Sweet Argan collection: combining our signature face creams, natural soaps, artisanal amlou, and pure argan oil in a gift box.',
      order_cta: 'Order Pack Timomouchin',
      quick_buy: '1-Click Checkout'
    },
    testimonials: {
      eyebrow: 'CUSTOMER REVIEWS',
      title: 'Trusted by Customers Across Morocco.',
      list: [
        {
          name: 'Fatima-Zahra, Casablanca',
          quote: 'The argan cream and charcoal soap transformed my skin completely! Super smooth and 100% natural.'
        },
        {
          name: 'Yassine, Rabat',
          quote: 'Received Pack Timomouchin within 24 hours with cash on delivery. The amlou and oil are pure perfection!'
        },
        {
          name: 'Khadija, Marrakech',
          quote: 'The natural musk deodorant and tanning oil smell incredible. Wonderful cooperative and helpful WhatsApp team.'
        }
      ]
    },
    social: {
      eyebrow: 'DAILY INSPIRATION',
      title: 'Moments of Sweet Argan on Instagram.',
      follow: 'Follow us on Instagram'
    },
    order_steps: {
      eyebrow: 'ORDER WITH CONFIDENCE',
      title: 'How to Order from Sweet Argan?',
      s1_title: '01. Choose Your Ritual',
      s1_desc: 'Browse our collections and add your favorite treatments to your cart with one tap.',
      s2_title: '02. No Credit Card Needed',
      s2_desc: 'Simply provide your name, phone number, and city. No online payment required.',
      s3_title: '03. Quick Confirmation',
      s3_desc: 'Confirm your order instantly online or message our team on WhatsApp for any adjustments.',
      s4_title: '04. Cash on Delivery',
      s4_desc: 'Your courier delivers your package within 24-48h. You pay cash in person upon delivery.'
    },
    delivery_strip: {
      eyebrow: 'NATIONWIDE MOROCCAN DELIVERY',
      title: 'Casablanca, Rabat, Marrakech, Agadir, Tangier, Fes, and every city across the Kingdom.',
      b1: '35 MAD Flat Shipping Rate',
      b2: 'FREE Shipping on orders over 300 MAD',
      b3: 'Fast Dispatch within 24h / 48h',
      b4: 'Sealed Eco-Friendly Packaging'
    },
    faq: {
      eyebrow: 'FREQUENTLY ASKED QUESTIONS',
      title: 'Everything You Need to Know.',
      q1: 'How does cash on delivery work in Morocco?',
      a1: 'You do not pay anything online. You hand the exact cash amount in Moroccan Dirhams (MAD) to the delivery agent upon receiving your order.',
      q2: 'What are the delivery times?',
      a2: 'All orders are prepared at our Agadir workshop and dispatched within 24 hours. Delivery takes 24-48 hours for major cities and 72 hours for remote regions.',
      q3: 'Are products safe for sensitive skin?',
      a3: 'Yes! Our formulas are created with 100% natural botanical extracts, free of parabens, sulfates, and endocrine disruptors.',
      q4: 'Can I order or ask questions via WhatsApp?',
      a4: 'Absolutely! Our care team is available 7 days a week at +212 661-983329 to advise you and manage your order.'
    },
    quote: {
      eyebrow: 'HONEST MOROCCAN BOTANICAL CARE',
      title: 'True Radiance Blossoms Gently.\nOne Ritual at a Time.',
      sub: 'Discover treatments crafted to elevate your daily routine.',
      cta: 'Find My Ritual',
      whatsapp_cta: 'Chat on WhatsApp'
    },
    footer: {
      desc: 'Sweet Argan Women’s Agricultural Cooperative · Organic cosmetic & culinary argan oil, handcrafted natural skincare, and Moroccan terroir. Agadir, Morocco.',
      links_title: 'Shop & Collections',
      legal_title: 'Legal & Policies',
      contact_title: 'Customer Care',
      rights: 'All rights reserved © Sweet Argan Cooperative 2026'
    },
    cart: {
      title: 'Your Shopping Cart',
      empty: 'Your cart is currently empty.',
      empty_sub: 'Explore the Sweet Argan collection and craft your personalized ritual.',
      explore: 'Explore Shop',
      subtotal: 'Estimated Subtotal',
      checkout: 'Proceed to Checkout',
      continue: 'Continue Shopping',
      free_shipping_notice: 'Free shipping on orders over 300 MAD!',
      quick_add: 'Add to Cart',
      added: 'Added'
    },
    checkout: {
      title: 'Your Order',
      subtitle: 'No account needed · Pay in cash upon delivery in Morocco',
      name_label: 'Full Name *',
      phone_label: 'Mobile Phone *',
      city_label: 'City *',
      address_label: 'Full Delivery Address *',
      email_label: 'Email Address (optional)',
      notes_label: 'Delivery Notes (optional)',
      terms_notice: 'By placing an order, you agree to our terms of sale and privacy policy.',
      submit: 'Place Order',
      submitting: 'Processing…',
      summary_title: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'Free',
      total: 'Estimated Total',
      cod_reassurance: 'Cash on delivery payment'
    },
    order_copy: {
      title: 'Your Order Reference Code',
      instruction: 'Please copy and save this order code so you can track your package progress and arrival anytime.',
      copy_btn: 'Copy Order Code',
      copied: '✓ Order code copied successfully!',
      track_btn: 'Track My Order Now'
    },
    order_management: {
      eyebrow: 'SWEET ARGAN · ORDER TRACKING',
      prompt_title: 'Would you like to confirm your order?',
      prompt_desc: 'Review the details below and confirm your order. You will then have 24 hours to modify or cancel online before preparation begins.',
      prompt_modified_notice: '⚠️ Your order has been modified. Please confirm the new version to initiate processing.',
      btn_confirm: '✅ Confirm Order',
      btn_confirming: 'Saving…',
      btn_modify: '✏️ Modify Order',
      btn_cancel: '❌ Cancel Order',
      status_confirmation_label: 'Confirmation',
      status_fulfillment_label: 'Fulfillment',
      confirmation_statuses: {
        pending: 'Pending Confirmation',
        confirmed: 'Confirmed',
        needs_review: 'Under Review',
        rejected: 'Declined',
        expired: 'Expired'
      },
      fulfillment_statuses: {
        new: 'Order Received',
        processing: 'In Preparation',
        ready: 'Ready for Dispatch',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        returned: 'Returned'
      },
      confirmed_title: 'Order Confirmed 🎉',
      order_number_label: 'Order Number:',
      copy_number_btn: 'Copy Order Number',
      copied_btn: '✓ Number Copied!',
      track_order_btn: 'Track My Order',
      confirmed_notice: 'Save this order code to track your parcel. Modifications are allowed for 24 hours after confirmation, as long as preparation has not started.',
      countdown_text: 'You can still modify or cancel this order for {time}, before preparation starts.',
      order_locked_notice: '🔒 This order can no longer be modified or cancelled online (preparation has started or the 24h window elapsed).',
      contact_support: 'Contact Sweet Argan',
      cancelled_title: 'Order Cancelled',
      cancelled_date_prefix: 'This order was cancelled on ',
      cancelled_reason_label: 'Reason:',
      cancelled_stock_freed: 'Reserved inventory for your items has been immediately released.',
      back_to_shop: 'Return to Shop',
      order_details_title: 'Order Details',
      order_placed_on: 'Order placed on',
      quantity_label: 'Quantity:',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free_shipping: 'Free',
      discount: 'Discount',
      total_with_tax: 'Total',
      delivery_address_title: 'Delivery Address',
      city_label: 'City:',
      address_label: 'Address:',
      notes_label: 'Delivery Notes:',
      timeline_title: 'Order Timeline & Tracking',
      in_progress: 'In progress…',
      cancel_modal_title: 'Cancel this order?',
      cancel_modal_desc: 'Are you sure you want to cancel this order? The reserved inventory will be freed immediately.',
      cancel_modal_reason_label: 'Reason (optional)',
      cancel_reasons: ['No longer needed', 'Mistake in order', 'Changed my mind', 'Other'],
      cancel_keep_btn: 'Keep Order',
      cancel_confirm_btn: 'Confirm Cancellation',
      cancel_cancelling: 'Cancelling…'
    },
    order_editor: {
      eyebrow: 'SWEET ARGAN · ORDER MODIFICATION',
      title: 'Modify Your Order',
      subtitle: 'You are directly editing your existing order. Prices, inventory, and delivery fees will be verified by the server upon saving.',
      items_title: 'Order Items',
      add_product_btn: '+ Add a Product',
      per_unit: '/ unit',
      remove_item: 'Remove',
      empty_items_error: 'Your order must contain at least one item. Add a product or return to your order to cancel it.',
      delivery_title: 'Delivery Address',
      city_label: 'Delivery City',
      address_label: 'Full Address',
      notes_label: 'Delivery Instructions (optional)',
      notes_placeholder: 'Notes for the courier...',
      provisional_title: 'Estimated Summary',
      articles_count: 'Items',
      provisional_notice: 'ℹ️ Final total and delivery fee will be recalculated automatically by the server. You can confirm the new version on the next page.',
      save_btn: 'Save Modifications',
      saving_btn: 'Saving…',
      back_to_order_btn: 'Back to Order',
      modal_title: 'Add a Product',
      modal_search_label: 'Search by Name',
      modal_search_placeholder: 'e.g. Argan oil, Soap, Cream…',
      modal_search_btn: 'Search',
      modal_loading: 'Loading catalog…',
      modal_no_products: 'No products found.',
      modal_add_btn: 'Add',
      modal_close_btn: 'Close'
    },
    tracking_page: {
      eyebrow: 'SWEET ARGAN · CUSTOMER AREA',
      title: 'Track My Order',
      subtitle: 'Check your delivery status, confirm your order, or make changes by providing your public order code and phone number.',
      code_label: 'Order Code (e.g. SA-2026-00000001)',
      code_placeholder: 'SA-2026-00000001',
      phone_label: 'Mobile Phone Number Used at Checkout',
      phone_placeholder: '06 61 98 33 29',
      submit_btn: 'Find My Order',
      submitting_btn: 'Searching…',
      error_fallback: 'Service temporarily unavailable. Please try again.'
    }
  }
};

export const categoryNameTranslations: Record<string, { ar: string; fr: string; en: string }> = {
  'soins-du-visage': { ar: 'العناية بالوجه', fr: 'Soins du visage', en: 'Face Care' },
  'soins du visage': { ar: 'العناية بالوجه', fr: 'Soins du visage', en: 'Face Care' },
  'soins-du-corps': { ar: 'العناية بالجسم', fr: 'Soins du corps', en: 'Body Care' },
  'soins du corps': { ar: 'العناية بالجسم', fr: 'Soins du corps', en: 'Body Care' },
  'savons': { ar: 'الصابون الطبيعي', fr: 'Savons', en: 'Natural Soaps' },
  'masques-et-soins': { ar: 'الأقنعة والصلصال', fr: 'Masques & Argiles', en: 'Masks & Clays' },
  'masques & argiles': { ar: 'الأقنعة والصلصال', fr: 'Masques & Argiles', en: 'Masks & Clays' },
  'huiles-et-solaires': { ar: 'الزيوت ومستحضرات التسمير', fr: 'Huiles & Solaires', en: 'Oils & Sun Care' },
  'huiles & solaires': { ar: 'الزيوت ومستحضرات التسمير', fr: 'Huiles & Solaires', en: 'Oils & Sun Care' },
  'terroir-marocain': { ar: 'المنتجات المجالية المغربية', fr: 'Terroir marocain', en: 'Moroccan Terroir' },
  'terroir marocain': { ar: 'المنتجات المجالية المغربية', fr: 'Terroir marocain', en: 'Moroccan Terroir' },
  'coffrets': { ar: 'المجموعات والهدايا', fr: 'Coffrets', en: 'Gift Sets' }
};

export function getLocalizedCategoryName(nameOrSlug: string, locale: Locale): string {
  const key = nameOrSlug.toLowerCase().trim();
  const entry = categoryNameTranslations[key];
  if (entry) return entry[locale] || entry.fr;
  return nameOrSlug;
}

