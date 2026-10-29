import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, User, Mail, Phone, MapPin, Shield, MoreVertical, ChevronDown, Calendar } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Input, Select, Badge, Dropdown, Table } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';

const mockCustomers = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: `+966 5${String(Math.floor(Math.random() * 9) + 1)}${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
  ordersCount: Math.floor(Math.random() * 20),
  totalSpent: Math.floor(Math.random() * 5000) + 100,
  status: ['active', 'inactive', 'blocked'][i % 3] as any,
  role: i % 10 === 0 ? 'admin' : 'customer',
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
}));

export function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();

  const filteredCustomers = mockCustomers.filter(customer => {
    if (search && !customer.name.toLowerCase().includes(search.toLowerCase()) && !customer.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && customer.status !== statusFilter) return false;
    if (roleFilter !== 'all' && customer.role !== roleFilter) return false;
    return true;
  });

  const statusColors: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    blocked: 'error',
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.customers')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage customer accounts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />} onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide Filters' : 'Filters'}
          </Button>
          <Link to="/admin/users/new">
            <Button leftIcon={<User className="w-4 h-4" />}>Add User</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6 animate-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search className="w-5 h-5" />} className="max-w-xs" />
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'blocked', label: 'Blocked' },
            ]} className="w-40" />
            <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} options={[
              { value: 'all', label: 'All Roles' },
              { value: 'customer', label: 'Customer' },
              { value: 'admin', label: 'Admin' },
            ]} className="w-40" />
            <Button variant="outline" onClick={() => { setSearch(''); setStatusFilter('all'); setRoleFilter('all'); }}>Clear</Button>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <Table
          columns={[
            { key: 'avatar', header: '', accessor: 'avatar', width: '60px', render: (_, row: any) => (
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-medium text-primary-600 dark:text-primary-400">
                {row.name.charAt(0)}
              </div>
            )},
            { key: 'name', header: 'Name', accessor: 'name', width: '180px', render: (_, row: any) => (
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-gray-500">{row.email}</p>
              </div>
            )},
            { key: 'phone', header: 'Phone', accessor: 'phone', width: '150px' },
            { key: 'orders', header: 'Orders', accessor: 'ordersCount', width: '80px', render: (v: number) => <Badge size="sm">{v} orders</Badge> },
            { key: 'spent', header: 'Total Spent', accessor: 'totalSpent', width: '120px', render: (v: number) => formatPriceUtil(v) },
            { key: 'status', header: 'Status', accessor: 'status', width: '100px', render: (v: string) => (
              <Badge variant={v === 'active' ? 'success' : v === 'inactive' ? 'warning' : 'error'} size="sm">{v}</Badge>
            )},
            { key: 'role', header: 'Role', accessor: 'role', width: '100px', render: (v: string) => (
              <Badge variant={v === 'admin' ? 'info' : 'default'} size="sm">{v}</Badge>
            )},
            { key: 'created', header: 'Joined', accessor: 'createdAt', width: '120px' },
            { key: 'lastLogin', header: 'Last Login', accessor: 'lastLogin', width: '120px' },
            { key: 'actions', header: '', accessor: 'actions', width: '100px', render: (_, row: any) => (
              <div className="flex items-center justify-end gap-2">
                <Link to={`/admin/customers/${row.id}`} className="p-2 text-gray-500 hover:text-primary-600" title="View"><User className="w-4 h-4" /></Link>
                <Link to={`/admin/customers/${row.id}/edit`} className="p-2 text-gray-500 hover:text-blue-600" title="Edit">✏️</Link>
                <button className="p-2 text-gray-500 hover:text-red-600" title="Block">🚫</button>
              </div>
            )},
          ]}
          data={mockCustomers}
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