import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, Eye, Edit2, Truck, Package, MoreVertical, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Input, Select, Badge, Dropdown, Modal, Table } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';

const mockOrders = Array.from({ length: 50 }, (_, i) => ({
  id: `ORD-${String(1000 + i).padStart(4, '0')}`,
  customer: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  items: Math.floor(Math.random() * 5) + 1,
  total: Math.floor(Math.random() * 1000) + 100,
  status: ['pending_confirmation', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'][i % 6] as any,
  codStatus: ['pending', 'collected', 'failed'][i % 3] as any,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  paymentMethod: i % 2 === 0 ? 'cod' : 'card',
  shippingAddress: 'Riyadh, Saudi Arabia',
}));

const statusColors: Record<string, string> = {
  pending_confirmation: 'warning',
  confirmed: 'info',
  processing: 'warning',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

const codStatusColors: Record<string, string> = {
  pending: 'warning',
  collected: 'success',
  failed: 'error',
};

export function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [codFilter, setCodFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();

  const filteredOrders = mockOrders.filter(order => {
    if (search && !order.id.toLowerCase().includes(search.toLowerCase()) && !order.customer.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (codFilter !== 'all' && order.codStatus !== codFilter) return false;
    if (dateFrom && order.date < dateFrom) return false;
    if (dateTo && order.date > dateTo) return false;
    return true;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.orders')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and track orders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>Export</Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} leftIcon={<Filter className="w-4 h-4" />}>
            {showFilters ? 'Hide Filters' : 'Filters'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6 animate-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search className="w-5 h-5" />} className="max-w-xs" />
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending_confirmation', label: 'Pending Confirmation' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'processing', label: 'Processing' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' },
            ]} className="w-48" />
            <Select value={codFilter} onChange={e => setCodFilter(e.target.value)} options={[
              { value: 'all', label: 'All COD Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'collected', label: 'Collected' },
              { value: 'failed', label: 'Failed' },
            ]} className="w-40" />
            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="From Date" className="w-40" />
            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="To Date" className="w-40" />
            <Button variant="outline" onClick={() => { setSearch(''); setStatusFilter('all'); setCodFilter('all'); setDateFrom(''); setDateTo(''); }}>Clear</Button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <Table
          columns={[
            { key: 'id', header: 'Order ID', accessor: 'id', width: '140px' },
            { key: 'customer', header: 'Customer', accessor: 'customer', width: '180px', render: (v: string, row: any) => (
              <div>
                <p className="font-medium">{row.customer}</p>
                <p className="text-sm text-gray-500">{row.email}</p>
              </div>
            )},
            { key: 'items', header: 'Items', accessor: 'items', width: '70px', render: (v: number) => <Badge size="sm">{v} items</Badge> },
            { key: 'total', header: 'Total', accessor: 'total', width: '120px', render: (v: number) => formatPriceUtil(v) },
            { key: 'status', header: 'Status', accessor: 'status', width: '140px', render: (v: string) => (
              <Badge variant={statusColors[v] as any}>{t(`account.orderStatus.${v}`) || v}</Badge>
            )},
            { key: 'codStatus', header: 'COD Status', accessor: 'codStatus', width: '120px', render: (v: string) => (
              <Badge variant={codStatusColors[v] as any} size="sm">{v}</Badge>
            )},
            { key: 'paymentMethod', header: 'Payment', accessor: 'paymentMethod', width: '100px', render: (v: string) => (
              <Badge variant={v === 'cod' ? 'success' : 'info'} size="sm">{v.toUpperCase()}</Badge>
            )},
            { key: 'date', header: 'Date', accessor: 'date', width: '120px' },
            { key: 'actions', header: '', accessor: 'actions', width: '100px', render: (_, row: any) => (
              <Dropdown
                trigger={<button className="p-2 text-gray-500 hover:text-gray-700"><MoreVertical className="w-4 h-4" /></button>}
                items={[
                  { label: 'View Details', value: 'view', icon: <Eye className="w-4 h-4" /> },
                  { label: 'Edit', value: 'edit', icon: <Edit2 className="w-4 h-4" /> },
                  { label: 'Print Invoice', value: 'print', icon: <Package className="w-4 h-4" /> },
                  { label: 'Update Status', value: 'status', icon: <Truck className="w-4 h-4" /> },
                  { label: 'Add Tracking', value: 'tracking', icon: <Package className="w-4 h-4" /> },
                ]}
                onSelect={(value) => {
                  if (value === 'view') window.open(`/admin/orders/${row.id}`, '_blank');
                }}
              />
            )},
          ]}
          data={filteredOrders}
          keyAccessor="id"
          striped
          hoverable
        />
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button variant="outline" size="sm" disabled>Previous</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <span className="px-2 text-gray-500">...</span>
        <Button variant="outline" size="sm">10</Button>
        <Button variant="outline" size="sm">Next</Button>
      </div>
    </div>
  );
}