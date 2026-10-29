import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Users, Edit2, Trash2, Eye, Pause, Play, CheckCircle, XCircle, DollarSign, Target, BarChart3, Megaphone, Calendar, Filter, ChevronDown } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Input, Select, Badge, Dropdown, Modal, Tabs, TabPanel } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';

const mockCampaigns = [
  { id: '1', name: 'Summer Sale 2024', type: 'homepage_banner', status: 'active', budget: 50000, spent: 32500, startDate: '2024-01-01', endDate: '2024-03-31', impressions: 125000, clicks: 3750, ctr: 3.0, cpc: 8.67, advertiser: 'TechDistributors Inc.', targeting: { categories: ['electronics'], locations: ['Riyadh', 'Jeddah'] } },
  { id: '2', name: 'New Arrival Promotion', type: 'sponsored_product', status: 'active', budget: 25000, spent: 18200, startDate: '2024-01-10', endDate: '2024-02-10', impressions: 85000, clicks: 2125, ctr: 2.5, cpc: 8.57, advertiser: 'FashionWholesale Co.', targeting: { categories: ['fashion'], locations: ['Riyadh'] } },
  { id: '3', name: 'Category Spotlight: Home', type: 'promoted_category', status: 'paused', budget: 15000, spent: 8500, startDate: '2024-01-05', endDate: '2024-02-05', impressions: 42000, clicks: 840, ctr: 2.0, cpc: 10.12, advertiser: 'HomeEssentials Ltd.', targeting: { categories: ['home-garden'] } },
  { id: '4', name: 'Electronics Flash Sale', type: 'search_top', status: 'pending_approval', budget: 30000, spent: 0, startDate: '2024-02-01', endDate: '2024-02-15', impressions: 0, clicks: 0, ctr: 0, cpc: 0, advertiser: 'TechDistributors Inc.', targeting: { categories: ['electronics'], devices: ['mobile'] } },
  { id: '5', name: 'Back to School', type: 'category_banner', status: 'draft', budget: 20000, spent: 0, startDate: '2024-08-01', endDate: '2024-09-15', impressions: 0, clicks: 0, ctr: 0, cpc: 0, advertiser: 'FashionWholesale Co.', targeting: { categories: ['fashion', 'home-garden'] } },
];

const mockAdvertisers = [
  { id: '1', name: 'TechDistributors Inc.', contactName: 'John Smith', email: 'john@techdist.com', phone: '+966 50 123 4567', company: 'TechDistributors Inc.', balance: 25000, status: 'approved' },
  { id: '2', name: 'FashionWholesale Co.', contactName: 'Sarah Johnson', email: 'sarah@fashionwholesale.com', phone: '+966 55 234 5678', company: 'FashionWholesale Co.', balance: 15000, status: 'approved' },
  { id: '3', name: 'HomeEssentials Ltd.', contactName: 'Ahmed Al-Rashid', email: 'ahmed@homeessentials.com', phone: '+966 53 345 6789', company: 'HomeEssentials Ltd.', balance: 8000, status: 'pending' },
  { id: '4', name: 'SportsGear Supply', contactName: 'Mike Chen', email: 'mike@sportsgear.com', phone: '+966 54 456 7890', company: 'SportsGear Supply', balance: 12000, status: 'approved' },
];

const campaignTypes = [
  { value: 'sponsored_product', label: 'Sponsored Product' },
  { value: 'featured_product', label: 'Featured Product' },
  { value: 'promoted_category', label: 'Promoted Category' },
  { value: 'homepage_banner', label: 'Homepage Banner' },
  { value: 'category_banner', label: 'Category Banner' },
  { value: 'search_top', label: 'Search Top' },
];

const statusColors: Record<string, string> = {
  draft: 'default',
  pending_approval: 'warning',
  approved: 'info',
  active: 'success',
  paused: 'warning',
  expired: 'default',
  rejected: 'error',
  cancelled: 'error',
};

export function AdminAdvertisingPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    if (search && !campaign.name.toLowerCase().includes(search.toLowerCase()) && !campaign.advertiser.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && campaign.status !== statusFilter) return false;
    if (typeFilter !== 'all' && campaign.type !== typeFilter) return false;
    return true;
  });

  const advertisingTabs = [
    { value: 'campaigns', label: t('admin.campaigns'), icon: Megaphone },
    { value: 'advertisers', label: t('admin.advertisers'), icon: Users },
    { value: 'analytics', label: t('admin.analytics'), icon: BarChart3 },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.advertising')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage advertising campaigns and advertisers</p>
        </div>
        <Link to="/admin/advertising/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Create Campaign</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Campaigns', value: mockCampaigns.filter(c => c.status === 'active').length, icon: Megaphone, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
          { label: 'Total Budget', value: formatPriceUtil(mockCampaigns.reduce((sum, c) => sum + c.budget, 0)), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Total Spent', value: formatPriceUtil(mockCampaigns.reduce((sum, c) => sum + c.spent, 0)), icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { label: 'Avg CTR', value: '2.38%', icon: Target, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs items={advertisingTabs} value={activeTab} onChange={setActiveTab} variant="pills" className="mb-6">
        {/* Campaigns Tab */}
        <TabPanel value="campaigns">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search className="w-5 h-5" />} className="max-w-xs" />
              <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={[
                { value: 'all', label: 'All Status' },
                { value: 'draft', label: 'Draft' },
                { value: 'pending_approval', label: 'Pending Approval' },
                { value: 'approved', label: 'Approved' },
                { value: 'active', label: 'Active' },
                { value: 'paused', label: 'Paused' },
              ]} className="w-40" />
              <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} options={campaignTypes} className="w-40" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Campaign</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Advertiser</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Budget</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Spent</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Impressions</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">CTR</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Dates</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {mockCampaigns.map(campaign => (
                  <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">{campaign.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.type.replace('_', ' ')}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={campaign.type === 'homepage_banner' ? 'info' : campaign.type === 'sponsored_product' ? 'success' : 'warning'} size="sm">
                        {campaign.type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">{campaign.advertiser}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={statusColors[campaign.status] as any}>{campaign.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-gray-900 dark:text-white">{formatPriceUtil(campaign.budget)}</td>
                    <td className="py-4 px-4 text-center font-medium text-gray-900 dark:text-white">{formatPriceUtil(campaign.spent)}</td>
                    <td className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">{campaign.impressions.toLocaleString()}</td>
                    <td className="py-4 px-4 text-center font-medium text-primary-600 dark:text-primary-400">{campaign.ctr}%</td>
                    <td className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      {new Date(campaign.startDate).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')} - {new Date(campaign.endDate).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/advertising/campaigns/${campaign.id}`} className="p-2 text-gray-500 hover:text-primary-600" title="View"><Eye className="w-4 h-4" /></Link>
                        <Link to={`/admin/advertising/campaigns/${campaign.id}/edit`} className="p-2 text-gray-500 hover:text-blue-600" title="Edit">✏️</Link>
                        {campaign.status === 'draft' && (
                          <button className="p-2 text-gray-500 hover:text-green-600" title="Submit for Approval">✅</button>
                        )}
                        {campaign.status === 'pending_approval' && (
                          <>
                            <button className="p-2 text-gray-500 hover:text-green-600" title="Approve">✅</button>
                            <button className="p-2 text-gray-500 hover:text-red-600" title="Reject">❌</button>
                          </>
                        )}
                        {campaign.status === 'active' && (
                          <button className="p-2 text-gray-500 hover:text-yellow-600" title="Pause">⏸️</button>
                        )}
                        {campaign.status === 'paused' && (
                          <button className="p-2 text-gray-500 hover:text-green-600" title="Resume">▶️</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>

        {/* Advertisers Tab */}
        <TabPanel value="advertisers">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Advertiser</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Company</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Balance</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {mockAdvertisers.map(advertiser => (
                  <tr key={advertiser.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-medium text-primary-600 dark:text-primary-400">
                          {advertiser.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{advertiser.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{advertiser.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">{advertiser.contactName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{advertiser.phone}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{advertiser.company}</td>
                    <td className="py-4 px-4 text-center font-medium text-gray-900 dark:text-white">{formatPriceUtil(advertiser.balance)}</td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={advertiser.status === 'approved' ? 'success' : advertiser.status === 'pending' ? 'warning' : 'error'}>{advertiser.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/advertising/advertisers/${advertiser.id}`} className="p-2 text-gray-500 hover:text-primary-600" title="View">👁️</Link>
                        <Link to={`/admin/advertising/advertisers/${advertiser.id}/edit`} className="p-2 text-gray-500 hover:text-blue-600" title="Edit">✏️</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value="analytics">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Performance Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Impressions', value: '252,000', change: '+12%', icon: Eye, color: 'text-blue-600' },
                  { label: 'Total Clicks', value: '6,715', change: '+8%', icon: Target, color: 'text-green-600' },
                  { label: 'Total Spent', value: formatPriceUtil(59200), change: '+5%', icon: DollarSign, color: 'text-purple-600' },
                  { label: 'Avg CPC', value: formatPriceUtil(8.81), change: '-2%', icon: DollarSign, color: 'text-orange-600' },
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
                      <stat.icon className={cn('w-5 h-5', stat.color)} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{stat.change} vs last month</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Campaigns</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Campaign</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Impressions</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Clicks</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">CTR</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">CPC</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {mockCampaigns.filter(c => c.status === 'active').map(campaign => (
                    <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{campaign.name}</td>
                      <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">{campaign.impressions.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">{campaign.clicks.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center font-medium text-primary-600 dark:text-primary-400">{campaign.ctr}%</td>
                      <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">{formatPriceUtil(campaign.cpc)}</td>
                      <td className="py-3 px-4 text-center font-medium text-green-600 dark:text-green-400">4.2x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}