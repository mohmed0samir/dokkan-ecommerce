import { Link } from 'react-router-dom';
import { Share2, Camera, X, Play, Smartphone, MessageCircle, Phone, Truck, Shield, RotateCcw, Headphones, ArrowUp } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { cn } from '@/utils/index.ts';
import { Button } from '@/components/ui';

export function Footer() {
  const { t, tObject, direction } = useLocale();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { label: t('footer.about'), path: '/about' },
      { label: t('footer.contact'), path: '/contact' },
      { label: t('footer.careers'), path: '/careers' },
      { label: t('footer.press'), path: '/press' },
      { label: t('footer.blog'), path: '/blog' },
    ],
    help: [
      { label: t('footer.help'), path: '/help' },
      { label: t('footer.faq'), path: '/faq' },
      { label: t('footer.shipping'), path: '/shipping' },
      { label: t('footer.returns'), path: '/returns' },
      { label: t('footer.trackOrder'), path: '/track' },
    ],
    legal: [
      { label: t('footer.privacy'), path: '/privacy' },
      { label: t('footer.terms'), path: '/terms' },
      { label: t('footer.cookies'), path: '/cookies' },
      { label: t('footer.accessibility'), path: '/accessibility' },
      { label: t('footer.sitemap'), path: '/sitemap' },
    ],
    customerService: [
      { label: t('footer.customerService'), path: '/support' },
      { label: t('footer.trackOrder'), path: '/track' },
      { label: t('footer.paymentMethods'), path: '/payment-methods' },
    ],
  };

  const benefitsData = tObject<{ title: string; description: string }[]>('home.benefits');
  const benefits = [
    { icon: Truck, ...benefitsData[0] },
    { icon: Shield, ...benefitsData[2] },
    { icon: RotateCcw, ...benefitsData[1] },
    { icon: Headphones, ...benefitsData[3] },
  ];

  const socialLinks = [
    { icon: Share2, label: 'Facebook', url: 'https://facebook.com/dokkan' },
    { icon: Camera, label: 'Instagram', url: 'https://instagram.com/dokkan' },
    { icon: X, label: 'Twitter', url: 'https://twitter.com/dokkan' },
    { icon: Play, label: 'YouTube', url: 'https://youtube.com/dokkan' },
    { icon: Smartphone, label: 'TikTok', url: 'https://tiktok.com/@dokkan' },
    { icon: MessageCircle, label: 'Snapchat', url: 'https://snapchat.com/add/dokkan' },
    { icon: Phone, label: 'WhatsApp', url: 'https://wa.me/966112345678' },
  ];

  return (
    <footer className={cn('bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800', direction === 'rtl' && '')}>
      {/* Benefits Bar */}
      <div className="py-8 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4" aria-label={t('app.name')}>
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{t('app.name')}</span>
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('app.tagline')}</p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('footer.about')}</h4>
              <nav className="flex flex-col gap-2">
                {footerLinks.about.map((link, index) => (
                  <Link key={index} to={link.path} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('footer.help')}</h4>
              <nav className="flex flex-col gap-2">
                {footerLinks.help.map((link, index) => (
                  <Link key={index} to={link.path} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('footer.legal')}</h4>
              <nav className="flex flex-col gap-2">
                {footerLinks.legal.map((link, index) => (
                  <Link key={index} to={link.path} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('footer.customerService')}</h4>
              <nav className="flex flex-col gap-2">
                {footerLinks.customerService.map((link, index) => (
                  <Link key={index} to={link.path} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('footer.newsletter')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('home.newsletter.subtitle')}</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t('home.newsletter.placeholder')}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={t('home.newsletter.placeholder')}
              />
              <Button type="submit" variant="primary" size="sm">
                {t('home.newsletter.subscribe')}
              </Button>
            </form>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('footer.privacy')} & {t('footer.terms')}</p>
          </div>
        </div>
      </div>

      {/* App Download */}
      <div className="py-8 px-4 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('footer.downloadApp')}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('footer.downloadAppDesc')}</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-32 h-40 md:w-40 md:h-48 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center" aria-label="Download on App Store">
                <span className="text-white dark:text-black font-bold text-lg">App Store</span>
              </a>
              <a href="#" className="w-32 h-40 md:w-40 md:h-48 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center" aria-label="Get it on Google Play">
                <span className="text-white dark:text-black font-bold text-lg">Google Play</span>
              </a>
              <a href="#" className="w-32 h-40 md:w-40 md:h-48 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center" aria-label="Explore on AppGallery">
                <span className="text-white dark:text-black font-bold text-lg">AppGallery</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-6 px-4 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('footer.madeWith')}</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600">{t('footer.privacy')}</Link>
              <Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600">{t('footer.terms')}</Link>
              <Link to="/cookies" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600">{t('footer.cookies')}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors opacity-0 invisible group-hover:opacity-100 group-hover:visible"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </footer>
  );
}