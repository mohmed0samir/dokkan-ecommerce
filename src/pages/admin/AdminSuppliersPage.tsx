import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Truck, Wifi, AlertCircle, CheckCircle, ChevronDown, RefreshCw, Package, DollarSign, Users, Eye } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Input, Select, Badge, Dropdown, Modal } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';

const mockSuppliers = [
  { id: '1', name: 'TechDistributors Inc.', contactName: 'John Smith', email: 'john@techdist.com', phone: '+966 50 123 4567', city: 'Riyadh', country: 'Saudi Arabia', apiStatus: 'connected', lastSyncAt: '2024-01-15T10:30:00Z', productCount: 120, totalRevenue: 450000, status: 'active', apiConfig: { type: 'rest', baseUrl: 'https://api.techdist.com' } },
  { id: '2', name: 'FashionWholesale Co.', contactName: 'Sarah Johnson', email: 'sarah@fashionwholesale.com', phone: '+966 55 234 5678', city: 'Jeddah', country: 'Saudi Arabia', apiStatus: 'connected', lastSyncAt: '2024-01-15T09:15:00Z', productCount: 85, totalRevenue: 320000, status: 'active', apiConfig: { type: 'rest', baseUrl: 'https://api.fashionwholesale.com' } },
  { id: '3', name: 'HomeEssentials Ltd.', contactName: 'Ahmed Al-Rashid', email: 'ahmed@homeessentials.com', phone: '+966 53 345 6789', city: 'Dammam', country: 'Saudi Arabia', apiStatus: 'disconnected', lastSyncAt: '2024-01-10T14:20:00Z', productCount: 45, totalRevenue: 180000, status: 'active', apiConfig: { type: 'graphql', baseUrl: 'https://api.homeessentials.com' } },
  { id: '4', name: 'SportsGear Supply', contactName: 'Mike Chen', email: 'mike@sportsgear.com', phone: '+966 54 456 7890', city: 'Riyadh', country: 'Saudi Arabia', apiStatus: 'connected', lastSyncAt: '2024-01-15T11:45:00Z', productCount: 60, totalRevenue: 150000, status: 'active', apiConfig: { type: 'rest', baseUrl: 'https://api.sportsgear.com' } },
  { id: '5', name: 'BeautyDistributors ME', contactName: 'Layla Hassan', email: 'layla@beautydist.com', phone: '+966 56 567 8901', city: 'Jeddah', country: 'Saudi Arabia', apiStatus: 'error', lastSyncAt: '2024-01-12T16:30:00Z', productCount: 35, totalRevenue: 95000, status: 'inactive', apiConfig: { type: 'rest', baseUrl: 'https://api.beautydist.com' } },
];

export function AdminSuppliersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [apiStatusFilter, setApiStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<typeof mockSuppliers[0] | null>(null);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncingSupplier, setSyncingSupplier] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    if (search && !supplier.name.toLowerCase().includes(search.toLowerCase()) && !supplier.contactName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && supplier.status !== statusFilter) return false;
    if (apiStatusFilter !== 'all' && supplier.apiStatus !== apiStatusFilter) return false;
    return true;
  });

  const handleDelete = (supplier: typeof mockSuppliers[0]) => {
    setSelectedSupplier(supplier);
    setDeleteModalOpen(true);
  };

  const handleSync = (supplierId: string) => {
    setSyncingSupplier(supplierId);
    setTimeout(() => {
      setSyncingSupplier(null);
    }, 2000);
  };

  const confirmDelete = () => {
    if (selectedSupplier) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDeleteModalOpen(false);
        setSelectedSupplier(null);
      }, 500);
    }
  };

  const apiStatusColors: Record<string, string> = {
    connected: 'success',
    disconnected: 'warning',
    error: 'error',
    not_configured: 'default',
  };

  const apiStatusLabels: Record<string, string> = {
    connected: 'Connected',
    disconnected: 'Disconnected',
    error: 'Error',
    not_configured: 'Not Configured',
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.suppliers')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage supplier relationships and integrations</p>
        </div>
        <Link to="/admin/suppliers/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Supplier</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Suppliers', value: mockSuppliers.length, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Active', value: mockSuppliers.filter(s => s.status === 'active').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
          { label: 'Connected', value: mockSuppliers.filter(s => s.apiStatus === 'connected').length, icon: Wifi, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { label: 'Issues', value: mockSuppliers.filter(s => s.apiStatus === 'error' || s.apiStatus === 'disconnected').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search className="w-5 h-5" />} className="max-w-xs sm:max-w-md" />
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]} className="w-40" />
          <Select value={apiStatusFilter} onChange={e => setApiStatusFilter(e.target.value)} options={[
            { value: 'all', label: 'All API Status' },
            { value: 'connected', label: 'Connected' },
            { value: 'disconnected', label: 'Disconnected' },
            { value: 'error', label: 'Error' },
          ]} className="w-40" />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Supplier</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Contact</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Location</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">API Status</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Products</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Last Sync</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {mockSuppliers.map(supplier => (
              <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{supplier.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.apiConfig?.type?.toUpperCase() || 'MANUAL'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{supplier.contactName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.phone}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {supplier.city}, {supplier.country}
                </td>
                <td className="py-4 px-4 text-center">
                  <Badge variant={apiStatusColors[supplier.apiStatus] as any}>
                    <span className="flex items-center gap-1">
                      {supplier.apiStatus === 'connected' && <CheckCircle className="w-3 h-3" />}
                      {supplier.apiStatus === 'disconnected' && <Wifi className="w-3 h-3" />}
                      {supplier.apiStatus === 'error' && <AlertCircle className="w-3 h-3" />}
                      {apiStatusLabels[supplier.apiStatus]}
                    </span>
                  </Badge>
                </td>
                <td className="py-4 px-4 text-center font-medium text-gray-900 dark:text-white">{supplier.productCount}</td>
                <td className="py-4 px-4 text-center font-medium text-gray-900 dark:text-white">{formatPriceUtil(supplier.totalRevenue)}</td>
                <td className="py-4 px-4 text-center">
                  <Badge variant={supplier.status === 'active' ? 'success' : 'error'} size="sm">
                    {supplier.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  {supplier.lastSyncAt ? new Date(supplier.lastSyncAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US') : 'Never'}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleSync(supplier.id)} disabled={syncingSupplier === supplier.id} className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50" title="Sync Now">
                      {syncingSupplier === supplier.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </button>
                    <Link to={`/admin/suppliers/${supplier.id}`} className="p-2 text-gray-500 hover:text-primary-600" title="View"><Eye className="w-4 h-4" /></Link>
                    <Link to={`/admin/suppliers/${supplier.id}/edit`} className="p-2 text-gray-500 hover:text-blue-600" title="Edit"><Edit2 className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(supplier)} className="p-2 text-gray-500 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}