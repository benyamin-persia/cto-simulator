/**
 * English → Persian dictionary (hard and medium-hard terms/phrases from codebase).
 * Source: glossary.ts, briefings, levels, level components, UI strings.
 * Use for i18n, Persian tooltips, or reference.
 *
 * Structure:
 * - hard: single terms, acronyms, technical jargon
 * - mediumHard: compound phrases, multi-word terms
 * - phrases: full sentences and UI/feedback strings
 * - uiLabels: level titles, section labels, button text
 */

export type DictionarySection = 'hard' | 'mediumHard' | 'phrases' | 'uiLabels';

/** Hard: single terms, acronyms, technical. */
export const EN_FA_HARD: Record<string, string> = {
  stakeholder: 'ذی\u200cنفع',
  stakeholders: 'ذی\u200cنفعان',
  saas: 'نرم\u200cافزار به\u200cعنوان سرویس',
  'e-commerce': 'تجارت الکترونیک',
  marketplace: 'بازارگاه / پلتفرم دوسویه',
  'dev tools': 'ابزارهای توسعه\u200cدهنده',
  'developer tools': 'ابزارهای توسعه\u200cدهنده',
  smart: 'هوشمند (در اهداف)',
  wbs: 'ساختار شکست کار',
  'work breakdown structure': 'ساختار شکست کار',
  investors: 'سرمایه\u200cگذاران',
  'end users': 'کاربران نهایی',
  monolith: 'تک\u200cپارچه / مونولیت',
  monolithic: 'تک\u200cپارچه',
  microservices: 'ریزسرویس\u200cها',
  serverless: 'بدون سرور',
  architecture: 'معماری',
  'ci/cd': 'یکپارچه\u200cسازی و استقرار مداوم',
  readme: 'فایل README',
  api: 'رابط برنامه\u200cنویسی اپلیکیشن',
  normalization: 'نرمال\u200cسازی',
  relational: 'رابطه\u200cای',
  nosql: 'نُواسکیوِل',
  indexing: 'ایندکس\u200cگذاری',
  'merge conflict': 'تعارض ادغام',
  kpi: 'شاخص کلیدی عملکرد',
  kpis: 'شاخص\u200cهای کلیدی عملکرد',
  q1: 'سه\u200cماهه اول',
  q2: 'سه\u200cماهه دوم',
  q3: 'سه\u200cماهه سوم',
  q4: 'سه\u200cماهه چهارم',
  deadline: 'مهلت / ضرب\u200cالاجل',
  measurable: 'قابل اندازه\u200cگیری',
  qa: 'تضمین کیفیت',
  scope: 'محدوده (پروژه)',
  'user story': 'داستان کاربر',
  'risk assessment': 'ارزیابی ریسک',
  devtools: 'ابزارهای توسعه\u200cدهنده',
  acid: 'اتمی بودن، سازگاری، انزوا، پایداری',
  sagas: 'ساگاها',
  'eventual consistency': 'سازگاری نهایی',
  'cold start': 'استارت سرد',
  polyglot: 'چندزبانگی',
  observability: 'مشاهده\u200cپذیری',
  deployment: 'استقرار',
  transaction: 'تراکنش',
  schema: 'طرح / اسکیما',
  'horizontal scaling': 'مقیاس\u200cپذیری افقی',
  '1nf': 'نرمال اول',
  '2nf': 'نرمال دوم',
  '3nf': 'نرمال سوم',
  bcnf: 'فرم نرمال بویس\u200cکاد',
  'normal form': 'فرم نرمال',
  git: 'گیت',
  commit: 'کامیت',
  push: 'پوش',
  pull: 'پول',
  branch: 'شاخه',
  pipeline: 'خط لوله (پایپلاین)',
  'security scan': 'اسکن امنیتی',
  'source control': 'کنترل منبع',
  'environment variables': 'متغیرهای محیطی',
};

/** Medium-hard: compound phrases, multi-word terms. */
export const EN_FA_MEDIUM_HARD: Record<string, string> = {
  'Work Breakdown Structure': 'ساختار شکست کار',
  'Key Performance Indicator': 'شاخص کلیدی عملکرد',
  'Quality Assurance': 'تضمین کیفیت',
  'Continuous Integration': 'یکپارچه\u200cسازی مداوم',
  'Continuous Deployment': 'استقرار مداوم',
  'Application Programming Interface': 'رابط برنامه\u200cنویسی اپلیکیشن',
  'Software as a Service': 'نرم\u200cافزار به\u200cعنوان سرویس',
  'First normal form': 'فرم نرمال اول',
  'Second normal form': 'فرم نرمال دوم',
  'Third normal form': 'فرم نرمال سوم',
  'Boyce–Codd normal form': 'فرم نرمال بویس\u200cکاد',
  'Market research & feasibility': 'تحقیق بازار و امکان\u200cسنجی',
  'Define requirements & scope': 'تعریف نیازمندی\u200cها و محدوده',
  'Design system architecture': 'طراحی معماری سیستم',
  'Development & implementation': 'توسعه و پیاده\u200cسازی',
  'Testing & QA': 'تست و تضمین کیفیت',
  'Deployment & launch': 'استقرار و راه\u200cاندازی',
  'Source control (commit)': 'کنترل منبع (کامیت)',
  'Build & package': 'ساخت و بسته\u200cبندی',
  'Run tests': 'اجرای تست\u200cها',
  'Project overview and purpose': 'نمای کلی و هدف پروژه',
  'Installation and configuration': 'نصب و پیکربندی',
  'Environment variables (e.g. DATABASE_URL)': 'متغیرهای محیطی (مثلاً DATABASE_URL)',
  'How to run the application': 'نحوه اجرای اپلیکیشن',
  'API overview or link to API docs': 'نمای کلی API یا لینک مستندات API',
  'Subscription-based software': 'نرم\u200cافزار مبتنی بر اشتراک',
  'Online retail platform': 'پلتفرم خرده\u200cفروشی آنلاین',
  'Two-sided platform': 'پلتفرم دوسویه',
  'Engineering & product team': 'تیم فنی و محصول',
  'Atomic values, no repeating groups': 'مقادیر اتمی، بدون گروه تکراری',
  'No partial dependencies': 'بدون وابستگی جزئی به کلید',
  'No transitive dependencies': 'بدون وابستگی تراگذر',
  'Index often-queried columns': 'ستون\u200cهای پرکاربرد در کوئری را ایندکس بگذار',
  'Full table scan': 'اسکن کامل جدول',
  'Staged changes': 'تغییرات مرحله\u200cشده',
  'Remote repository': 'مخزن دور',
  'Local branch': 'شاخه محلی',
  'Fault isolation': 'جداسازی خطا',
  'Scale to zero': 'مقیاس به صفر',
  'Pay per use': 'پرداخت به ازای استفاده',
  'Vendor lock-in': 'وابستگی به فروشنده',
  'Distributed transactions': 'تراکنش\u200cهای توزیع\u200cشده',
  'Strong consistency': 'سازگاری قوی',
  'Composite index': 'ایندکس مرکب',
  'Primary key': 'کلید اصلی',
  'Foreign key': 'کلید خارجی',
  'Write throughput': 'توان نوشتاری',
  'Recurring revenue': 'درآمد تکراری',
  conversion: 'تبدیل',
  liquidity: 'نقدشوندگی',
  'Developer experience': 'تجربه توسعه\u200cدهنده',
};

/** Full sentences and UI/feedback strings. */
export const EN_FA_PHRASES: Record<string, string> = {
  'Launch your startup. Make decisions. Learn software engineering.':
    'استارتاپ خود را راه\u200cاندازی کنید. تصمیم بگیرید. مهندسی نرم\u200cافزار یاد بگیرید.',
  'Each level teaches you first — then you play. Learn by doing.':
    'هر مرحله اول آموزش می\u200cدهد — بعد بازی می\u200cکنید. با عمل یاد بگیرید.',
  'Start game': 'شروع بازی',
  'Review briefing': 'مرور briefing',
  'Next phase': 'مرحله بعد',
  'Next level': 'مرحله بعدی',
  'Complete level': 'تکمیل مرحله',
  'Try again': 'دوباره امتحان کنید',
  'Check order': 'بررسی ترتیب',
  Submit: 'ارسال',
  'Back to levels': 'بازگشت به مراحل',
  'Restart game': 'شروع مجدد بازی',
  'See summary': 'مشاهده خلاصه',
  'Startup Successfully Launched': 'استارتاپ با موفقیت راه\u200cاندازی شد',
  'Game progress': 'پیشرفت بازی',
  'You completed all levels. Your startup is ready.':
    'همه مراحل را تکمیل کردید. استارتاپ شما آماده است.',
  'Total XP': 'امتیاز کل',
  'Summary of decisions': 'خلاصه تصمیم\u200cها',
  'Curriculum (Starting a New Programming Project)':
    'سرفصل (شروع یک پروژه برنامه\u200cنویسی جدید)',
  'Tooltips On/Off': 'راهنما (کلیک روی اصطلاح) روشن/خاموش',
  'Show levels': 'نمایش مراحل',
  'Ctrl+Shift+R reset': 'ریست با Ctrl+Shift+R',
};

/** Level titles and section labels (UI). */
export const EN_FA_UI_LABELS: Record<string, string> = {
  'Level 1 – Project Planning': 'مرحله ۱ – برنامه\u200cریزی پروژه',
  'Level 2 – Architecture Decision': 'مرحله ۲ – تصمیم معماری',
  'Level 3 – Database Design': 'مرحله ۳ – طراحی پایگاه داده',
  'Level 4 – Git': 'مرحله ۴ – گیت',
  'Level 5 – CI/CD Pipeline': 'مرحله ۵ – خط لوله CI/CD',
  'Level 6 – Documentation': 'مرحله ۶ – مستندات',
  Planning: 'برنامه\u200cریزی',
  Architecture: 'معماری',
  Database: 'پایگاه داده',
  'Git Conflict Simulation': 'شبیه\u200cسازی تعارض گیت',
  'CI/CD Pipeline Builder': 'سازنده خط لوله CI/CD',
  'Documentation Review': 'بازبینی مستندات',
  'Choose your startup type': 'نوع استارتاپ را انتخاب کنید',
  'Select the SMART goal': 'هدف SMART را انتخاب کنید',
  'Identify key stakeholders': 'ذی\u200cنفعان کلیدی را مشخص کنید',
  'When to review risk assessment?': 'چه زمانی ارزیابی ریسک را بازبینی کنیم؟',
  'Which is a well-formed user story?': 'کدام یک داستان کاربر درست است؟',
  'Order the WBS (Work Breakdown Structure)': 'ترتیب مراحل ساختار شکست کار را مشخص کنید',
  'Relational vs NoSQL': 'رابطه\u200cای در مقابل NoSQL',
  'Normalization (normal forms)': 'نرمال\u200cسازی (فرم\u200cهای نرمال)',
  'Indexing and optimization': 'ایندکس\u200cگذاری و بهینه\u200cسازی',
  'Order the CI/CD pipeline': 'ترتیب مراحل خط لوله CI/CD را مشخص کنید',
  'What should a README include?': 'یک README چه بخش\u200cهایی باید داشته باشد؟',
  'Learn first:': 'اول یاد بگیر:',
};

/** Combined flat map: all keys → Persian. For lookup use: prefer exact key, then lowercase. */
export const EN_FA_DICTIONARY: Record<string, string> = {
  ...EN_FA_HARD,
  ...EN_FA_MEDIUM_HARD,
  ...EN_FA_PHRASES,
  ...EN_FA_UI_LABELS,
};

/**
 * Look up Persian for an English term/phrase.
 * Tries exact key, then lowercase key (for glossary-style lookup).
 */
export function translateToPersian(english: string): string | undefined {
  const trimmed = english.trim();
  return EN_FA_DICTIONARY[trimmed] ?? EN_FA_DICTIONARY[trimmed.toLowerCase()];
}
