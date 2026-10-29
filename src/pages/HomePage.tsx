import { Link } from 'react-router-dom';
import { Truck, Shield, RotateCcw, Headphones, ShoppingCart, Tag, Zap, Star } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button } from '@/components/ui/index.ts';
import { cn } from '@/utils/index.ts';

const features = [
  { icon: Truck, title: 'home.benefits.0.title', description: 'home.benefits.0.description' },
  { icon: Shield, title: 'home.benefits.2.title', description: 'home.benefits.2.description' },
  { icon: RotateCcw, title: 'home.benefits.1.title', description: 'home.benefits.1.description' },
  { icon: Headphones, title: 'home.benefits.3.title', description: 'home.benefits.3.description' },
];

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: '📱', count: 1240 },
  { name: 'Fashion', slug: 'fashion', icon: '👗', count: 890 },
  { name: 'Home & Garden', slug: 'home-garden', icon: '🏠', count: 560 },
  { name: 'Sports', slug: 'sports', icon: '⚽', count: 340 },
  { name: 'Beauty', slug: 'beauty', icon: '💄', count: 670 },
  { name: 'Toys', slug: 'toys', icon: '🧸', count: 230 },
  { name: 'Automotive', slug: 'automotive', icon: '🚗', count: 180 },
  { name: 'Books', slug: 'books', icon: '📚', count: 450 },
];

const flashSaleProducts = [
  { id: 1, name: 'Wireless Headphones', price: 299, originalPrice: 499, discount: 40, image: '🎧', rating: 4.8 },
  { id: 2, name: 'Smart Watch', price: 599, originalPrice: 899, discount: 33, image: '⌚', rating: 4.6 },
  { id: 3, name: 'Bluetooth Speaker', price: 149, originalPrice: 249, discount: 40, image: '🔊', rating: 4.7 },
  { id: 4, name: 'Phone Charger', price: 79, originalPrice: 129, discount: 39, image: '🔌', rating: 4.5 },
];

const bestSellers = [
  { id: 5, name: 'Running Shoes', price: 349, image: '👟', rating: 4.9, sold: 1200 },
  { id: 6, name: 'Coffee Maker', price: 279, image: '☕', rating: 4.7, sold: 890 },
  { id: 7, name: 'Backpack', price: 189, image: '🎒', rating: 4.6, sold: 750 },
  { id: 8, name: 'Desk Lamp', price: 129, image: '💡', rating: 4.5, sold: 620 },
];

export function HomePage() {
  const { t, locale, direction, formatPrice } = useLocale();

  return (
    <div className={cn('min-h-screen', direction === 'rtl' && 'rtl')}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                {t('home.hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('home.hero.cta')}
                    <ShoppingCart className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/offers">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    {t('home.hero.secondaryCta')}
                    <Tag className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  {flashSaleProducts.map((product, index) => (
                    <div key={product.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="text-4xl mb-2">{product.image}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                        <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                        <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">-{product.discount}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-accent-100 dark:bg-accent-900/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.whyChooseUs')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('app.tagline')}
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t(feature.title)}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t(feature.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t('home.featuredCategories')}
            </h2>
            <Link to="/categories" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('ui.viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <Link key={category.slug} to={`/shop?category=${category.slug}`} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('home.flashSale')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{t('home.limitedTime')}</p>
            </div>
            <div className="flex items-center gap-4" id="countdown">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <span className="font-mono text-lg font-bold text-gray-900 dark:text-white" id="hours">12</span>
                <span className="text-gray-500">:</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <span className="font-mono text-lg font-bold text-gray-900 dark:text-white" id="minutes">34</span>
                <span className="text-gray-500">:</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <span className="font-mono text-lg font-bold text-gray-900 dark:text-white" id="seconds">56</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                  <div className="relative aspect-square bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-6xl">
                    {product.image}
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <button className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Star className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingCart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                      <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t('home.bestSellers')}
            </h2>
            <Link to="/shop?sort=bestSelling" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('ui.viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                  <div className="relative aspect-square bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-6xl">
                    {product.image}
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {t('nav.bestSellers')}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{product.sold} sold</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.newsletter.title')}
          </h2>
          <p className="text-primary-100 mb-8">{t('home.newsletter.subtitle')}</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('home.newsletter.placeholder')}
              className="flex-1 px-6 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={t('home.newsletter.placeholder')}
            />
            <Button type="submit" variant="secondary" size="lg" className="whitespace-nowrap">
              {t('home.newsletter.subscribe')}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}