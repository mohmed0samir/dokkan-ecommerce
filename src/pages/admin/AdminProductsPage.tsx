import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Edit2, Trash2, Eye, MoreVertical, ChevronDown, Package, Tag, DollarSign, AlertTriangle } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Input, Select, Badge, Dropdown, Modal, Table } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';

const mockProducts = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  sku: `SKU-${String(i + 1).padStart(4, '0')}`,
  price: Math.floor(Math.random() * 500) + 50,
  compareAtPrice: Math.floor(Math.random() * 200) + 600,
  stock: Math.floor(Math.random() * 100),
  status: ['active', 'draft', 'archived', 'out_of_stock'][i % 4] as any,
  visibility: ['public', 'hidden', 'featured'][i % 3] as any,
  category: ['Electronics', 'Fashion', 'Home', 'Sports'][i % 4],
  brand: ['Apple', 'Nike', 'Samsung', 'Adidas', 'Sony'][i % 5],
  featured: i % 5 === 0,
}));

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'sports', name: 'Sports' },
];

export function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [loading, setLoading] = useState(false);

  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();

  const filteredProducts = mockProducts.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory) {
      return false;
    }
    if (selectedStatus !== 'all' && p.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const handleDelete = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDeleteModalOpen(false);
        setSelectedProduct(null);
      }, 500);
    }
  };

  return (
    <div className={cn('p-6', direction === 'rtl' && 'rtl')}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.products')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your product catalog</p>
        </div>
        <Link to="/admin/products/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>{t('admin.addProduct')}</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Input
              placeholder={t('ui.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              className="max-w-xs sm:max-w-md"
            />
            <Select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              className="w-48"
            />
            <Select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'archived', label: 'Archived' },
                { value: 'out_of_stock', label: 'Out of Stock' },
              ]}
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === 'table' ? 'primary' : 'outline'} size="sm" onClick={() => setViewMode('table')} leftIcon={<Package className="w-4 h-4" />} />
            <Button variant={viewMode === 'grid' ? 'primary' : 'outline'} size="sm" onClick={() => setViewMode('grid')} leftIcon={<Package className="w-4 h-4" />} />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {viewMode === 'table' ? (
          <Table
            columns={[
              { key: 'image', header: '', accessor: 'image', width: '60px' },
              { key: 'name', header: t('admin.productName'), accessor: 'name', width: '300px' },
              { key: 'sku', header: t('admin.productSku'), accessor: 'sku', width: '120px' },
              { key: 'category', header: t('admin.category'), accessor: 'category' },
              { key: 'price', header: t('admin.productPrice'), accessor: 'price', width: '120px', render: (v: number) => formatPriceUtil(v) },
              { key: 'stock', header: 'Stock', accessor: 'stock', width: '80px', render: (v: number) => (
                <Badge variant={v < 10 ? 'error' : v < 20 ? 'warning' : 'success'}>{v}</Badge>
              )},
              { key: 'status', header: 'Status', accessor: 'status', width: '120px', render: (v: string) => (
                <Badge variant={v === 'active' ? 'success' : v === 'draft' ? 'default' : v === 'archived' ? 'outline' : 'error'}>
                  {v === 'active' ? 'Active' : v === 'draft' ? 'Draft' : v === 'archived' ? 'Archived' : 'Out of Stock'}
                </Badge>
              )},
              { key: 'actions', header: '', accessor: 'actions', width: '120px', render: (_, row: any) => (
                <div className="flex items-center justify-end gap-2">
                  <Link to={`/admin/products/${row.id}/edit`} className="p-2 text-gray-500 hover:text-primary-600" title="Edit"><Edit2 className="w-4 h-4" /></Link>
                  <Link to={`/admin/products/${row.id}`} className="p-2 text-gray-500 hover:text-blue-600" title="View"><Eye className="w-4 h-4" /></Link>
                  <button onClick={() => handleDelete(row)} className="p-2 text-gray-500 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              )},
            ]}
            data={filteredProducts}
            keyAccessor="id"
            striped
            hoverable
          />
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <Link key={product.id} to={`/admin/products/${product.id}`} className="group">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-6xl mb-3">📦</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.sku}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={product.status === 'active' ? 'success' : product.status === 'draft' ? 'default' : 'error'}>{product.status}</Badge>
                    <span className="font-bold text-primary-600">{formatPriceUtil(product.price)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-gray-100 dark:border-gray-700">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="primary" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <span className="px-2 text-gray-500">...</span>
          <Button variant="outline" size="sm">10</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setSelectedProduct(null); }} title="Delete Product" size="sm">
        {selectedProduct && (
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{selectedProduct.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setDeleteModalOpen(false); setSelectedProduct(null); }}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} loading={loading}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}