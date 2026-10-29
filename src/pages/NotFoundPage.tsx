import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button } from '@/components/ui/index.ts';
import { cn } from '@/utils/index.ts';

export function NotFoundPage() {
  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4', direction === 'rtl' && 'rtl')}>
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600/20 dark:text-primary-400/20 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('errors.notFound')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">{t('errors.notFoundMessage')}</p>
        </div>

        <div className="space-y-4 mb-8">
          <Link to="/">
            <Button size="lg" className="w-full" rightIcon={<Home className="w-5 h-5" />}>
              {t('errors.goHome')}
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" size="lg" className="w-full" rightIcon={<Search className="w-5 h-5" />}>
              {t('errors.goBack') || 'Browse Products'}
            </Button>
          </Link>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
          <p className="text-gray-500 dark:text-gray-400 mb-6">{t('errors.contactSupport') || 'Still need help?'}</p>
          <Link to="/contact">
            <Button variant="outline" leftIcon={<Headphones className="w-5 h-5" />}>
              {t('errors.contactSupport') || 'Contact Support'}
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-4 gap-4 text-center">
          {[
            { icon: Truck, label: 'Fast Delivery' },
            { icon: Shield, label: 'Secure Payment' },
            { icon: RotateCcw, label: 'Easy Returns' },
            { icon: Headphones, label: '24/7 Support' },
          ].map((item, index) => (
            <div key={index} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <item.icon className="w-6 h-6 mx-auto mb-2 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}