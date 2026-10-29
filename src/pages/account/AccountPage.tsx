import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, Settings, Shield, LogOut, Bell, CreditCard, Edit2, Eye, EyeOff, Truck, RotateCcw, Headphones } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { useAuth } from '@/hooks/index.ts';
import { Button, Input, Tabs, TabPanel, Badge, Avatar, Modal } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';
import { profileSchema, changePasswordSchema } from '../../utils/validation';
import { toast } from 'react-hot-toast';

const mockOrders = [
  { id: 'ORD-001', date: '2024-01-15', status: 'delivered', total: 598, items: 2 },
  { id: 'ORD-002', date: '2024-01-10', status: 'shipped', total: 299, items: 1 },
  { id: 'ORD-003', date: '2024-01-05', status: 'processing', total: 899, items: 3 },
  { id: 'ORD-004', date: '2023-12-28', status: 'delivered', total: 1249, items: 4 },
];

const mockAddresses = [
  { id: '1', label: 'Home', name: 'Ahmed Hassan', phone: '+966 50 123 4567', country: 'Saudi Arabia', city: 'Riyadh', district: 'Al Olaya', street: 'King Fahd Road', building: '123', floor: '5', apartment: '501', isDefault: true },
  { id: '2', label: 'Work', name: 'Ahmed Hassan', phone: '+966 50 123 4567', country: 'Saudi Arabia', city: 'Riyadh', district: 'Al Malaz', street: 'Olaya Street', building: '45', floor: '2', apartment: '201', isDefault: false },
];

const statusLabels: Record<string, { ar: string; en: string }> = {
  pending_confirmation: { ar: 'في انتظار التأكيد', en: 'Pending Confirmation' },
  confirmed: { ar: 'مؤكد', en: 'Confirmed' },
  processing: { ar: 'قيد المعالجة', en: 'Processing' },
  shipped: { ar: 'تم الشحن', en: 'Shipped' },
  delivered: { ar: 'تم التسليم', en: 'Delivered' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
  returned: { ar: 'مرتجع', en: 'Returned' },
  refunded: { ar: 'مسترد', en: 'Refunded' },
};

const statusColors: Record<string, string> = {
  pending_confirmation: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  returned: 'warning',
  refunded: 'success',
};

export function AccountPage() {
  const navigate = useNavigate();
  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();
  const { user, updateProfile, changePassword, updatePreferences, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const profileTabs = [
    { value: 'profile', label: t('account.profile'), icon: User },
    { value: 'orders', label: t('account.orders'), icon: Package },
    { value: 'addresses', label: t('account.addresses'), icon: MapPin },
    { value: 'wishlist', label: t('account.wishlist'), icon: Heart },
    { value: 'settings', label: t('account.settings'), icon: Settings },
    { value: 'security', label: t('account.security'), icon: Shield },
    { value: 'notifications', label: t('account.notifications'), icon: Bell },
  ];

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };
    const result = profileSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, messages]) => {
        newErrors[key] = messages?.[0] || 'Invalid value';
      });
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success(t('account.profileUpdated'));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmNewPassword: formData.get('confirmNewPassword') as string,
    };
    const result = changePasswordSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, messages]) => {
        newErrors[key] = messages?.[0] || 'Invalid value';
      });
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success(t('account.passwordChanged'));
      setShowPassword(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950', direction === 'rtl' && 'rtl')}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('account.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('account.welcome', { name: user.displayName })}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />}>
            {t('auth.logout')}
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <Avatar size="xl" src={user.photoURL} fallback={user.displayName?.charAt(0).toUpperCase()} />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.displayName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {profileTabs.map(tab => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                      activeTab === tab.value
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                  >
                    <tab.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <Tabs items={profileTabs} value={activeTab} onChange={setActiveTab} variant="pills" className="mb-6">
              {/* Profile Tab */}
              <TabPanel value="profile">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('account.editProfile')}</h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label={t('auth.fullName')}
                        name="fullName"
                        defaultValue={user.displayName}
                        required
                      />
                      <Input
                        label={t('auth.email')}
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        required
                      />
                    </div>
                    <Input
                      label={t('auth.phone')}
                      name="phone"
                      type="tel"
                      defaultValue={user.phoneNumber || ''}
                    />
                    <Button type="submit" loading={loading}>
                      {t('ui.save')}
                    </Button>
                  </form>
                </div>
              </TabPanel>

              {/* Orders Tab */}
              <TabPanel value="orders">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {mockOrders.length === 0 ? (
                    <div className="text-center py-16">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('account.noOrders')}</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">{t('account.startShopping')}</p>
                      <Link to="/shop"><Button rightIcon={<Truck className="w-4 h-4" />}>{t('ui.continueShopping')}</Button></Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {mockOrders.map(order => (
                        <div key={order.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">📦</div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{order.id}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 sm:ml-auto">
                            <Badge variant={statusColors[order.status] as any}>{statusLabels[order.status][locale]}</Badge>
                            <span className="font-bold text-primary-600">{formatPriceUtil(order.total)}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{order.items} items</span>
                            <Link to={`/account/orders/${order.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">{t('account.orderDetails')}</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabPanel>

              {/* Addresses Tab */}
              <TabPanel value="addresses">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('account.addresses')}</h2>
                    <Button variant="outline" size="sm" leftIcon={<MapPin className="w-4 h-4" />}>Add Address</Button>
                  </div>
                  {mockAddresses.map(addr => (
                    <div key={addr.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">{addr.label}</span>
                            {addr.isDefault && <Badge variant="success" size="sm">Default</Badge>}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{addr.name} · {addr.phone}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {addr.street}, {addr.building ? `${addr.building}, ` : ''}{addr.floor ? `Floor ${addr.floor}, ` : ''}{addr.apartment ? `Apt ${addr.apartment}, ` : ''}{addr.district}, {addr.city}, {addr.country}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm" onClick={() => {}}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>

              {/* Wishlist Tab */}
              <TabPanel value="wishlist">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Wishlist is empty</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Add products to your wishlist</p>
                    <Link to="/shop"><Button rightIcon={<Truck className="w-4 h-4" />}>Start Shopping</Button></Link>
                  </div>
                </div>
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel value="settings">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">Language</label>
                      <select
                        defaultValue={user.preferences?.locale || 'ar'}
                        onChange={e => updatePreferences({ locale: e.target.value as 'ar' | 'en' })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">Theme</label>
                      <select
                        defaultValue={user.preferences?.theme || 'system'}
                        onChange={e => updatePreferences({ theme: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel value="security">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('account.changePassword')}</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    <Input
                      label={t('account.currentPassword')}
                      name="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      rightIcon={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />
                    <Input
                      label={t('account.newPassword')}
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                    <Input
                      label={t('account.confirmNewPassword')}
                      name="confirmNewPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                    <Button type="submit" loading={loading}>{t('ui.save')}</Button>
                  </form>
                </div>
              </TabPanel>

              {/* Notifications Tab */}
              <TabPanel value="notifications">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email notifications', desc: 'Order updates, promotions, newsletters' },
                      { key: 'sms', label: 'SMS notifications', desc: 'Order status, delivery alerts' },
                      { key: 'push', label: 'Push notifications', desc: 'Real-time updates on your device' },
                    ].map(item => (
                      <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={user.preferences?.notifications[item.key as keyof typeof user.preferences.notifications] || false}
                          onChange={e => updatePreferences({ notifications: { ...user.preferences.notifications, [item.key]: e.target.checked } })}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}