import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Shield, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Badge } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';
import { useCart } from '@/hooks/index.ts';

const mockCartItems = [
  {
    id: '1',
    productId: '1',
    name: { ar: 'سماعات لاسلكية برو', en: 'Wireless Headphones Pro' },
    image: '🎧',
    price: 299,
    quantity: 2,
    maxQuantity: 50,
    variantOptions: [{ name: 'Color', value: 'Black' }],
  },
  {
    id: '2',
    productId: '2',
    name: { ar: 'ساعة ذكية', en: 'Smart Watch' },
    image: '⌚',
    price: 599,
    quantity: 1,
    maxQuantity: 20,
    variantOptions: [{ name: 'Color', value: 'Silver' }],
  },
  {
    id: '3',
    productId: '3',
    name: { ar: 'حقيبة ظهر', en: 'Backpack' },
    image: '🎒',
    price: 189,
    quantity: 3,
    maxQuantity: 10,
  },
];

export function CartPage() {
  const navigate = useNavigate();
  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();
  const { cart, updateQuantity, removeItem, getItemCount, getSubtotal, applyCoupon, removeCoupon } = useCart();

  const items = mockCartItems;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;
  const freeShippingThreshold = 500;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950', direction === 'rtl' && 'rtl')}>
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('cart.title')}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('cart.items', { count: getItemCount() })}
              </p>
            </div>
            <Link to="/shop" className="text-primary-600 hover:text-primary-700 font-medium">
              ← {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <>
          {/* Empty Cart */}
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('cart.empty')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t('cart.emptyMessage')}</p>
          <Link to="/shop">
            <Button size="lg" rightIcon={<Truck className="w-5 h-5" />}>
              {t('cart.continueShopping')}
            </Button>
          </Link>
        </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {items.map(item => (
                    <div key={item.id} className="p-6 flex gap-4">
                      <div className="relative w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-4xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link to={`/product/${item.productId}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 line-clamp-1 mb-1">
                              {item.name[locale]}
                            </Link>
                            {item.variantOptions && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.variantOptions.map(v => `${v.name}: ${v.value}`).join(', ')}
                              </p>
                            )}
                            <p className="text-lg font-bold text-primary-600 mt-1">{formatPriceUtil(item.price)}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                            aria-label={t('cart.removeCoupon') || 'Remove'}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-1.5 text-lg font-medium text-gray-900 dark:text-white min-w-[3rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                              disabled={item.quantity >= item.maxQuantity}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t('cart.maxQuantityReached', { max: item.maxQuantity })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('cart.orderSummary')}</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatPriceUtil(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t('cart.shipping')}</span>
                    <span>{shipping === 0 ? t('cart.freeShipping') : formatPriceUtil(shipping)}</span>
                  </div>
                  {remainingForFreeShipping > 0 && (
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                      <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300 text-sm">
                        <Truck className="w-4 h-4" />
                        <span>{t('cart.freeShippingThreshold', { amount: formatPriceUtil(remainingForFreeShipping) })}</span>
                      </div>
                      <div className="w-full bg-primary-200 dark:bg-primary-800 rounded-full h-2 mt-2">
                        <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <span>{t('cart.tax')} (15%)</span>
                    <span>{formatPriceUtil(tax)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-700 pt-4">
                    <span>{t('cart.total')}</span>
                    <span>{formatPriceUtil(total)}</span>
                  </div>
                </div>

                {/* COD Notice */}
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
                    <Shield className="w-5 h-5" />
                    <div>
                      <p className="font-medium">{t('cart.cashOnDeliveryNotice')}</p>
                      <p className="text-sm">{t('cart.codInfo')}</p>
                    </div>
                  </div>
                </div>

                {/* Secure Checkout */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                    <CreditCard className="w-5 h-5" />
                    <p className="font-medium">{t('cart.secureCheckout')}</p>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button onClick={() => navigate('/checkout')} className="w-full" size="lg" rightIcon={<Truck className="w-5 h-5" />}>
                  {t('cart.checkout')} - {formatPriceUtil(total)}
                </Button>

                {/* Coupon */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('cart.coupon')}</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t('cart.coupon')}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button variant="outline" onClick={() => applyCoupon('')}>{t('cart.applyCoupon')}</Button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: Shield, label: t('product.securePayment') },
                    { icon: Truck, label: t('product.shippingInfo') },
                    { icon: RotateCcw, label: t('product.returnPolicy') },
                  ].map((item, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <item.icon className="w-5 h-5 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}