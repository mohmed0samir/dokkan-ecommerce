import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Truck, Shield, CreditCard, Home, MapPin, User, Mail, Phone, Plus } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useLocale } from '@/hooks/index.ts';
import { Button, Input, Select } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';
import { useCart } from '@/hooks/index.ts';
import { useAuth } from '@/hooks/index.ts';

const mockCartItems = [
  { id: '1', name: { en: 'Wireless Headphones Pro', ar: 'سماعات لاسلكية برو' }, image: '🎧', price: 299, quantity: 2 },
  { id: '2', name: { en: 'Smart Watch', ar: 'ساعة ذكية' }, image: '⌚', price: 599, quantity: 1 },
];

const mockAddresses = [
  { id: '1', label: 'Home', name: 'Ahmed Hassan', phone: '+966 50 123 4567', country: 'Saudi Arabia', city: 'Riyadh', district: 'Al Olaya', street: 'King Fahd Road', building: '123', floor: '5', apartment: '501', isDefault: true },
  { id: '2', label: 'Work', name: 'Ahmed Hassan', phone: '+966 50 123 4567', country: 'Saudi Arabia', city: 'Riyadh', district: 'Al Malaz', street: 'Olaya Street', building: '45', floor: '2', apartment: '201', isDefault: false },
];

const steps = [
  { id: 'information', label: 'Information', icon: User },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: Shield },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();
  const { cart, getSubtotal } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [shippingAddress, setShippingAddress] = useState(mockAddresses[0]);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [saving, setSaving] = useState(false);

  const items = mockCartItems;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    navigate('/checkout/success/ORD-123456');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return email && phone;
      case 1: return !!shippingAddress;
      case 2: return !!paymentMethod;
      default: return true;
    }
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950', direction === 'rtl' && 'rtl')}>
      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                    index < currentStep ? 'bg-primary-600 text-white' :
                    index === currentStep ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' :
                    'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  )}>
                    {index < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className={cn(
                    'hidden sm:block font-medium',
                    index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                  )}>
                    {t(`checkout.steps.${step.id}`)}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-20 h-0.5 mx-4',
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Step 1: Information */}
            {currentStep === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('checkout.steps.information')}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{t('checkout.billingDetails')}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label={t('checkout.firstName')}
                      value={user?.displayName?.split(' ')[0] || ''}
                      onChange={e => setEmail(e.target.value)} // simplified
                      required
                    />
                    <Input
                      label={t('checkout.lastName')}
                      value={user?.displayName?.split(' ').slice(1).join(' ') || ''}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label={t('checkout.email')}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />

                  <Input
                    label={t('checkout.phone')}
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} disabled={!canProceed()}>
                    {t('ui.next')}
                    <Truck className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('checkout.steps.shipping')}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{t('checkout.shippingDetails')}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mockAddresses.map(addr => (
                      <label key={addr.id} className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary-300 dark:hover:border-primary-700">
                        <input
                          type="radio"
                          name="shippingAddress"
                          checked={shippingAddress.id === addr.id}
                          onChange={() => setShippingAddress(addr)}
                          className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{addr.label}</span>
                            {addr.isDefault && <Badge variant="success" size="sm">Default</Badge>}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {addr.name} · {addr.phone}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {addr.street}, {addr.building ? `${addr.building}, ` : ''}{addr.floor ? `Floor ${addr.floor}, ` : ''}{addr.apartment ? `Apt ${addr.apartment}, ` : ''}{addr.district}, {addr.city}, {addr.country}
                          </p>
                        </div>
                      </label>
                    ))}
                    <button
                      type="button"
                      className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      <Plus className="w-5 h-5 mx-auto mb-2" />
                      <span>Add new address</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(0)}>{t('ui.back')}</Button>
                  <Button onClick={() => setCurrentStep(2)} disabled={!canProceed()}>
                    {t('ui.next')}
                    <CreditCard className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('checkout.steps.payment')}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{t('checkout.paymentMethod')}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary-300 dark:hover:border-primary-700">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{t('checkout.cashOnDelivery')}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t('checkout.codInfo')}</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer opacity-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>{t('ui.back')}</Button>
                  <Button onClick={() => setCurrentStep(3)} disabled={!canProceed()}>
                    {t('ui.next')}
                    <Shield className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('checkout.steps.review')}</h2>

                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('checkout.orderSummary')}</h3>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">{item.image}</div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{item.name[locale]}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-primary-600">{formatPriceUtil(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">{t('checkout.shippingDetails')}</h3>
                    <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{shippingAddress.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{shippingAddress.phone}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {shippingAddress.street}, {shippingAddress.building ? `${shippingAddress.building}, ` : ''}{shippingAddress.floor ? `Floor ${shippingAddress.floor}, ` : ''}{shippingAddress.apartment ? `Apt ${shippingAddress.apartment}, ` : ''}{shippingAddress.district}, {shippingAddress.city}, {shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">{t('checkout.paymentMethod')}</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{t('checkout.cashOnDelivery')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('checkout.codInfo')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>{t('ui.back')}</Button>
                  <Button onClick={handleSubmit} loading={saving} size="lg">
                    {saving ? t('checkout.placingOrder') : t('checkout.placeOrder')}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('checkout.orderSummary')}</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl flex-shrink-0">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{item.name[locale]}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-primary-600 whitespace-nowrap">{formatPriceUtil(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatPriceUtil(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('cart.shipping')}</span>
                  <span>{shipping === 0 ? t('cart.freeShipping') : formatPriceUtil(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('cart.tax')} (15%)</span>
                  <span>{formatPriceUtil(tax)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-700 pt-4">
                  <span>{t('cart.total')}</span>
                  <span>{formatPriceUtil(total)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
                  <Shield className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{t('checkout.cashOnDelivery')}</p>
                    <p className="text-sm">{t('checkout.codInfo')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}