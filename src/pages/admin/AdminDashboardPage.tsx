import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, Truck, DollarSign, TrendingUp, AlertTriangle, Eye, Plus, BarChart3, Clock } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Card, Badge, Progress, Skeleton } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';

const stats = [
  { label: 'Total Revenue', value: 'SAR 1,234,567', change: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  { label: 'Total Orders', value: '2,341', change: '+8.2%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { label: 'Total Products', value: '1,234', change: '+15', icon: Package, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { label: 'Total Customers', value: '5,678', change: '+3.1%', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Ahmed Hassan', amount: 'SAR 598', status: 'delivered', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Sara Ahmed', amount: 'SAR 299', status: 'shipped', date: '2024-01-15' },
  { id: 'ORD-003', customer: 'Mohammed Ali', amount: 'SAR 899', status: 'processing', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Fatima Khalid', amount: 'SAR 1,249', status: 'pending', date: '2024-01-14' },
  { id: 'ORD-005', customer: 'Omar Abdullah', amount: 'SAR 450', status: 'cancelled', date: '2024-01-13' },
];

const lowStockProducts = [
  { name: 'Wireless Headphones Pro', stock: 3, threshold: 10 },
  { name: 'Smart Watch Series 5', stock: 5, threshold: 15 },
  { name: 'Bluetooth Speaker Mini', stock: 2, threshold: 10 },
  { name: 'Phone Charger 65W', stock: 8, threshold: 20 },
];

const topCategories = [
  { name: 'Electronics', revenue: 'SAR 450,000', orders: 1200 },
  { name: 'Fashion', revenue: 'SAR 320,000', orders: 980 },
  { name: 'Home & Garden', revenue: 'SAR 180,000', orders: 560 },
  { name: 'Sports', revenue: 'SAR 120,000', orders: 340 },
];

export function AdminDashboardPage() {
  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();

  const statusColors: Record<string, string> = {
    delivered: 'success',
    shipped: 'info',
    processing: 'warning',
    pending: 'warning',
    cancelled: 'error',
  };

  return (
    <div className={cn('p-6', direction === 'rtl' && 'rtl')}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.dashboard')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('admin.overview')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<BarChart3 className="w-4 h-4" />}>Export Report</Button>
          <Button leftIcon={<Plus className="w-4 h-4" />}>Quick Action</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-sm font-medium mt-1">{stat.change}</p>
              </div>
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-gray-900 dark:text-white">{order.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{order.customer}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{order.amount}</td>
                    <td className="py-4 px-4">
                      <Badge variant={statusColors[order.status] as any}>{order.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{order.date}</td>
                    <td className="py-4 px-4 text-right">
                      <Link to={`/admin/orders/${order.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Low Stock Alert</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">4 products need restocking</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">📦</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Threshold: {product.threshold}</p>
                    </div>
                  </div>
                  <Progress value={product.stock} max={product.threshold} size="sm" variant="error" className="w-32" showLabel label={`${product.stock}/${product.threshold}`} />
                </div>
              ))}
            </div>
          </Card>

          {/* Top Categories */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Top Categories</h3>
              <Link to="/admin/categories" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All →</Link>
            </div>
            <div className="space-y-3">
              {topCategories.map((cat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{cat.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{cat.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{cat.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/products" className="group">
                <Button variant="outline" className="w-full justify-start gap-3" leftIcon={<Plus className="w-4 h-4" />}>Add Product</Button>
              </Link>
              <Link to="/admin/categories" className="group">
                <Button variant="outline" className="w-full justify-start gap-3" leftIcon={<Plus className="w-4 h-4" />}>Add Category</Button>
              </Link>
              <Link to="/admin/orders" className="group">
                <Button variant="outline" className="w-full justify-start gap-3" leftIcon={<Eye className="w-4 h-4" />}>View Orders</Button>
              </Link>
              <Link to="/admin/customers" className="group">
                <Button variant="outline" className="w-full justify-start gap-3" leftIcon={<Users className="w-4 h-4" />}>Manage Users</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  delivered: 'success',
  shipped: 'info',
  processing: 'warning',
  pending: 'warning',
  cancelled: 'error',
};