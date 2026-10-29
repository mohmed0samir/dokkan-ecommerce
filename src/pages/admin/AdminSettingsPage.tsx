import { useState } from 'react';
import { Save, Eye, EyeOff, Mail, Shield, Truck, RotateCcw, Headphones, Globe, CreditCard, Palette, Bell, Key, Database, Wifi, Megaphone, BarChart3, Settings, Users, Package, Truck as TruckIcon, DollarSign, Shield as ShieldIcon, RotateCcw as RotateCcwIcon, Headphones as HeadphonesIcon, Plus } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Input, Select, Badge, Tabs, TabPanel, Switch } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';
import { toast } from 'react-hot-toast';

const settingsTabs = [
  { value: 'general', label: 'General', icon: Settings },
  { value: 'store', label: 'Store', icon: Package },
  { value: 'shipping', label: 'Shipping', icon: TruckIcon },
  { value: 'cod', label: 'COD', icon: DollarSign },
  { value: 'taxes', label: 'Taxes', icon: ShieldIcon },
  { value: 'payments', label: 'Payments', icon: CreditCard },
  { value: 'emails', label: 'Emails', icon: Mail },
  { value: 'sms', label: 'SMS', icon: Megaphone },
  { value: 'push', label: 'Push', icon: Bell },
  { value: 'appearance', label: 'Appearance', icon: Palette },
  { value: 'seo', label: 'SEO', icon: BarChart3 },
  { value: 'maintenance', label: 'Maintenance', icon: Settings },
  { value: 'features', label: 'Features', icon: Package },
  { value: 'integrations', label: 'Integrations', icon: Wifi },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const currencyOptions = [
  { value: 'SAR', label: 'Saudi Riyal (SAR)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
];

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();

  const handleSave = async () => {
    setLoading(true);
    setSaved(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    toast.success('Settings saved successfully');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your store settings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSave} loading={loading}>
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs items={settingsTabs} value={activeTab} onChange={setActiveTab} variant="pills" className="mb-6">
        {/* General Settings */}
        <TabPanel value="general">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Store Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Store Name (AR)" name="name_ar" defaultValue="دكان" />
                <Input label="Store Name (EN)" name="name_en" defaultValue="Dokkan" />
                <Input label="Store Description (AR)" name="desc_ar" placeholder="وصف المتجر بالعربي" />
                <Input label="Store Description (EN)" name="desc_en" placeholder="Store description in English" />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Contact Email" name="contactEmail" type="email" defaultValue="support@dokkan.sa" />
                <Input label="Contact Phone" name="contactPhone" defaultValue="+966 11 234 5678" />
                <Input label="Address (AR)" name="address_ar" placeholder="العنوان بالعربي" />
                <Input label="Address (EN)" name="address_en" placeholder="Address in English" />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Localization</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <Select label="Default Language" name="defaultLocale" options={[
                  { value: 'ar', label: 'Arabic' },
                  { value: 'en', label: 'English' },
                ]} defaultValue="ar" />
                <Select label="Default Currency" name="defaultCurrency" options={currencyOptions} defaultValue="SAR" />
                <Select label="Timezone" name="timezone" options={[
                  { value: 'Asia/Riyadh', label: 'Riyadh (UTC+3)' },
                  { value: 'UTC', label: 'UTC' },
                ]} defaultValue="Asia/Riyadh" />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Links</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {['Facebook', 'Instagram', 'Twitter', 'YouTube', 'TikTok', 'Snapchat', 'WhatsApp'].map((social, index) => (
                  <Input key={index} label={social} name={social.toLowerCase()} placeholder={`https://${social.toLowerCase()}.com/dokkan`} />
                ))}
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Store Settings */}
        <TabPanel value="store">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Branding</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Primary Color" name="primaryColor" type="color" defaultValue="#16a34a" />
                <Input label="Secondary Color" name="secondaryColor" type="color" defaultValue="#ea580c" />
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Logo</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                    <input type="file" accept="image/*" className="hidden" id="logo-upload" />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400">Click to upload logo (max 2MB)</p>
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Favicon</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                    <input type="file" accept="image/*" className="hidden" id="favicon-upload" />
                    <label htmlFor="favicon-upload" className="cursor-pointer">
                      <p className="text-gray-500 dark:text-gray-400">Click to upload favicon (32x32px)</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Currency Settings</h3>
              <div className="grid sm:grid-cols-4 gap-4">
                <Select label="Currency Code" name="currencyCode" options={currencyOptions} defaultValue="SAR" />
                <Input label="Currency Symbol" name="currencySymbol" defaultValue="ر.س" />
                <Select label="Symbol Position" name="currencyPosition" options={[
                  { value: 'before', label: 'Before (SAR 100)' },
                  { value: 'after', label: 'After (100 SAR)' },
                ]} defaultValue="after" />
                <Input label="Decimal Places" name="decimalPlaces" type="number" defaultValue="2" />
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Shipping Settings */}
        <TabPanel value="shipping">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Shipping Settings</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <Input label="Default Shipping Fee" name="defaultFee" type="number" defaultValue="25" />
                <Input label="Free Shipping Threshold" name="freeShippingThreshold" type="number" defaultValue="500" />
                <Select label="Estimated Delivery" name="estimatedDelivery" options={[
                  { value: '2-5', label: '2-5 business days' },
                  { value: '1-3', label: '1-3 business days' },
                  { value: '3-7', label: '3-7 business days' },
                ]} defaultValue="2-5" />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Regions</h3>
                <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Region</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Region Name (AR)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Region Name (EN)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Countries</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Fee</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Free Shipping</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Est. Days</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[
                      { id: '1', name: { ar: 'الرياض', en: 'Riyadh' }, countries: ['Saudi Arabia'], fee: 25, freeShipping: 500, days: '2-3' },
                      { id: '2', name: { ar: 'جدة', en: 'Jeddah' }, countries: ['Saudi Arabia'], fee: 30, freeShipping: 500, days: '2-4' },
                      { id: '3', name: { ar: 'الدمام', en: 'Dammam' }, countries: ['Saudi Arabia'], fee: 35, freeShipping: 500, days: '3-5' },
                    ].map(region => (
                      <tr key={region.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">{region.name.ar}</td>
                        <td className="py-3 px-4">{region.name.en}</td>
                        <td className="py-3 px-4">{region.countries.join(', ')}</td>
                        <td className="py-3 px-4 text-center">{region.fee} SAR</td>
                        <td className="py-3 px-4 text-center">{region.freeShipping} SAR</td>
                        <td className="py-3 px-4 text-center">{region.days}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* COD Settings */}
        <TabPanel value="cod">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cash on Delivery Settings</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="cod-enabled" defaultChecked className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <label htmlFor="cod-enabled" className="font-medium text-gray-900 dark:text-white">Enable Cash on Delivery</label>
                </div>
                <Input label="COD Fee" name="codFee" type="number" defaultValue="15" />
                <Input label="Maximum COD Amount" name="codMaxAmount" type="number" placeholder="Optional" />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Allowed Regions</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Select regions where COD is available (leave empty for all regions)</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar', 'Tabuk', 'Abha'].map(city => (
                  <label key={city} className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                    <span>{city}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Collection Instructions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Instructions (AR)" name="codInstructions_ar" placeholder="تعليمات التحصيل بالعربي" />
                <Input label="Instructions (EN)" name="codInstructions_en" placeholder="Collection instructions in English" />
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Taxes Settings */}
        <TabPanel value="taxes">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tax Settings</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 sm:col-span-3">
                  <input type="checkbox" id="tax-enabled" defaultChecked className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <label htmlFor="tax-enabled" className="font-medium text-gray-900 dark:text-white">Enable Taxes</label>
                </div>
                <Input label="Default Tax Rate (%)" name="defaultTaxRate" type="number" defaultValue="15" min="0" max="100" step="0.1" />
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="tax-included" defaultChecked className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <label htmlFor="tax-included" className="font-medium text-gray-900 dark:text-white">Prices include tax</label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tax Rates by Region</h3>
                <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Tax Rate</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Country</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Region</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Rate (%)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tax Name</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[
                      { country: 'Saudi Arabia', region: 'All', rate: 15, name: 'VAT' },
                      { country: 'UAE', region: 'All', rate: 5, name: 'VAT' },
                    ].map((tax, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">{tax.country}</td>
                        <td className="py-3 px-4">{tax.region}</td>
                        <td className="py-3 px-4 text-center">{tax.rate}%</td>
                        <td className="py-3 px-4">{tax.name}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Other tabs - simplified */}
        {[ 'payments', 'emails', 'sms', 'push', 'appearance', 'seo', 'maintenance', 'features', 'integrations' ].map(tab => (
          <TabPanel key={tab} value={tab}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <div className="text-center py-12">
                <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tab.charAt(0).toUpperCase() + tab.slice(1)} Settings</h3>
                <p className="text-gray-500 dark:text-gray-400">This section is under development</p>
              </div>
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}