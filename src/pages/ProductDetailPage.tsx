import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, RotateCcw, Heart, Share2, ChevronLeft, ChevronRight, Minus, Plus, Check, X, ShoppingCart } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Badge, Tabs, TabPanel, Modal } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';
import { useCart } from '@/hooks/index.ts';

const mockProduct = {
  id: 1,
  name: { ar: 'سماعات لاسلكية برو', en: 'Wireless Headphones Pro' },
  description: { ar: 'سماعات عالية الجودة مع إلغاء ضوضاء نشط', en: 'High-quality headphones with active noise cancellation' },
  shortDescription: { ar: 'صوت نقي وراحة فائقة', en: 'Crystal clear sound and supreme comfort' },
  price: 299,
  originalPrice: 499,
  images: ['🎧', '🎧', '🎧', '🎧'],
  rating: 4.8,
  reviews: 245,
  brand: 'Sony',
  category: 'Electronics',
  inStock: true,
  stock: 50,
  variants: [
    { id: '1', name: { ar: 'أسود', en: 'Black' }, price: 299, color: '#000000', stock: 20 },
    { id: '2', name: { ar: 'أبيض', en: 'White' }, price: 299, color: '#FFFFFF', stock: 15 },
    { id: '3', name: { ar: 'أزرق', en: 'Blue' }, price: 319, color: '#3B82F6', stock: 10 },
  ],
  specifications: [
    { name: { ar: 'النوع', en: 'Type' }, value: { ar: 'فوق الأذن', en: 'Over-ear' }, group: { ar: 'عام', en: 'General' } },
    { name: { ar: 'إلغاء الضوضاء', en: 'Noise Cancellation' }, value: { ar: 'نشط', en: 'Active' }, group: { ar: 'صوت', en: 'Audio' } },
    { name: { ar: 'عمر البطارية', en: 'Battery Life' }, value: { ar: '30 ساعة', en: '30 hours' }, group: { ar: 'بطارية', en: 'Battery' } },
    { name: { ar: 'الوزن', en: 'Weight' }, value: { ar: '250 جرام', en: '250g' }, group: { ar: 'عام', en: 'General' } },
  ],
  shippingInfo: { ar: 'توصيل مجاني خلال 2-3 أيام', en: 'Free delivery within 2-3 days' },
  returnPolicy: { ar: 'إرجاع مجاني خلال 14 يوم', en: 'Free returns within 14 days' },
  warranty: { ar: 'ضمان سنتين', en: '2-year warranty' },
};

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();
  const { addItem } = useCart();

  const product = mockProduct;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [activeTab, setActiveTab] = useState('description');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleAddToCart = () => {
    addItem(product as any, selectedVariant.id, quantity);
    setShowSuccessModal(true);
  };

  const handleBuyNow = () => {
    addItem(product as any, selectedVariant.id, quantity);
    // Navigate to checkout
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950', direction === 'rtl' && 'rtl')}>
      {/* Breadcrumb */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link to="/" className="text-gray-500 hover:text-primary-600">{t('nav.home')}</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/shop" className="text-gray-500 hover:text-primary-600">{t('nav.shop')}</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to={`/shop?category=${product.category.toLowerCase()}`} className="text-gray-500 hover:text-primary-600">{product.category}</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 dark:text-white truncate max-w-xs">{product.name[locale]}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                {product.images[selectedImage]}
              </div>
              {/* Zoom on hover */}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0',
                    selectedImage === index ? 'border-primary-600' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <div className="w-full h-full flex items-center justify-center text-3xl">{img}</div>
                </button>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-4 gap-4 text-center">
              {[
                { icon: Truck, label: t('product.freeShipping') },
                { icon: Shield, label: t('product.securePayment') },
                { icon: RotateCcw, label: t('product.easyReturns') },
                { icon: Heart, label: t('product.warranty') },
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <item.icon className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <Badge variant="success">{product.brand}</Badge>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name[locale]}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{product.rating}</span>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">({product.reviews} {t('product.reviews')})</span>
              <Badge variant="outline">{t('product.inStock')}</Badge>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-primary-600">{formatPriceUtil(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPriceUtil(product.originalPrice)}</span>
                  <Badge variant="error">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</Badge>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">{product.shortDescription[locale]}</p>

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">{t('product.selectVariant')}</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        'px-4 py-2 rounded-lg border-2 font-medium transition-all',
                        selectedVariant.id === variant.id
                          ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-600'
                      )}
                      disabled={variant.stock === 0}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full border" style={{ backgroundColor: variant.color }} />
                        <span>{variant.name[locale]}</span>
                        {variant.price !== product.price && (
                          <span className="text-sm font-bold">{formatPriceUtil(variant.price)}</span>
                        )}
                      </div>
                      {variant.stock === 0 && <span className="text-xs text-red-500"> - {t('product.outOfStock')}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">{t('product.quantity')}</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-lg font-medium text-gray-900 dark:text-white min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    disabled={quantity >= selectedVariant.stock}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('product.stock')}: {selectedVariant.stock} {t('product.available')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button onClick={handleAddToCart} size="lg" className="flex-1" rightIcon={<ShoppingCart className="w-5 h-5" />}>
                {t('product.addToCart')}
              </Button>
              <Button onClick={handleBuyNow} size="lg" variant="secondary" className="w-36">
                {t('product.buyNow')}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              {[
                { icon: Truck, title: t('product.shippingInfo'), desc: product.shippingInfo[locale] },
                { icon: RotateCcw, title: t('product.returnPolicy'), desc: product.returnPolicy[locale] },
                { icon: Shield, title: t('product.warranty'), desc: product.warranty[locale] },
                { icon: Heart, title: t('product.securePayment'), desc: t('product.codAvailable') },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <Tabs
            items={[
              {
                value: 'description',
                label: t('product.description'),
                children: (
                  <div className="prose dark:prose-invert max-w-none mt-6">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description[locale]}</p>
                  </div>
                ),
              },
              {
                value: 'specifications',
                label: t('product.specifications'),
                children: (
                  <div className="mt-6">
                    <dl className="divide-y divide-gray-100 dark:divide-gray-800">
                      {Object.entries(
                        product.specifications.reduce((acc, spec) => {
                          const group = spec.group?.[locale] || 'General';
                          if (!acc[group]) acc[group] = [];
                          acc[group].push(spec);
                          return acc;
                        }, {} as Record<string, typeof product.specifications>)
                      ).map(([group, specs]) => (
                        <div key={group} className="py-4">
                          <dt className="font-semibold text-gray-900 dark:text-white mb-2">{group}</dt>
                          <div className="grid grid-cols-2 gap-4">
                            {specs.map((spec, i) => (
                              <div key={i} className="flex gap-4">
                                <span className="text-gray-500 dark:text-gray-400">{spec.name[locale]}</span>
                                <span className="text-gray-900 dark:text-white font-medium">{spec.value[locale]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </dl>
                  </div>
                ),
              },
              {
                value: 'reviews',
                label: `${t('product.reviews')} (${product.reviews})`,
                children: (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">{t('product.reviews')} ({product.reviews})</h3>
                      <Button variant="outline" size="sm">{t('product.writeReview')}</Button>
                    </div>
                    <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <span className="font-medium text-primary-600 dark:text-primary-400">A</span>
                        </div>
                        <div>
                          <p className="font-medium">Ahmed Hassan</p>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                          </div>
                        </div>
                        <span className="ml-auto text-sm text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Great product! Fast delivery and excellent quality. Highly recommended.</p>
                    </div>
                  ))}
                </div>
            </div>
          ),
        },
      ]}
      value={activeTab}
      onChange={setActiveTab}
      variant="underline"
      className="border-gray-200 dark:border-gray-700"
    />
        </div>

        {/* Related Products */}
        <section className="py-12 px-4 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('product.relatedProducts')}</h2>
              <Link to="/shop" className="text-primary-600 hover:text-primary-700 font-medium">{t('ui.viewAll')} →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Link key={i} to={`/product/${i + 10}`} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-6xl">🎧</div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600">Related Product {i + 1}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary-600">{formatPriceUtil(199 + i * 50)}</span>
                        <span className="text-sm text-gray-400 line-through">{formatPriceUtil(299 + i * 50)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title={t('cart.addedToCart')} size="sm">
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('cart.addedToCart')}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setShowSuccessModal(false)}>{t('cart.continueShopping')}</Button>
            <Button onClick={() => setShowSuccessModal(false)}>View Cart</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}