import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, ChevronRight, FolderOpen, Package, Tag } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Input, Badge, Modal } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';

const mockCategories = [
  { id: '1', name: { ar: 'الإلكترونيات', en: 'Electronics' }, slug: 'electronics', parentId: null, productCount: 450, featured: true, visible: true },
  { id: '2', name: { ar: 'الهواتف', en: 'Phones' }, slug: 'phones', parentId: '1', productCount: 120, featured: true, visible: true },
  { id: '3', name: { ar: 'اللابتوبات', en: 'Laptops' }, slug: 'laptops', parentId: '1', productCount: 85, featured: false, visible: true },
  { id: '4', name: { ar: 'الأزياء', en: 'Fashion' }, slug: 'fashion', parentId: null, productCount: 320, featured: true, visible: true },
  { id: '5', name: { ar: 'الرجال', en: 'Men' }, slug: 'men', parentId: '4', productCount: 180, featured: true, visible: true },
  { id: '6', name: { ar: 'النساء', en: 'Women' }, slug: 'women', parentId: '4', productCount: 140, featured: false, visible: true },
  { id: '7', name: { ar: 'المنزل والحديقة', en: 'Home & Garden' }, slug: 'home-garden', parentId: null, productCount: 210, featured: false, visible: true },
  { id: '8', name: { ar: 'الرياضة', en: 'Sports' }, slug: 'sports', parentId: null, productCount: 150, featured: false, visible: true },
];

export function AdminCategoriesPage() {
  const [search, setSearch] = useState('');
  const [showTree, setShowTree] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof mockCategories[0] | null>(null);
  const [loading, setLoading] = useState(false);

  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();

  const filteredCategories = mockCategories.filter(c =>
    c.name[locale].toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const getParentName = (parentId: string | null) => {
    if (!parentId) return '—';
    const parent = mockCategories.find(c => c.id === parentId);
    return parent ? parent.name[locale] : '—';
  };

  const handleDelete = (category: typeof mockCategories[0]) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDeleteModalOpen(false);
        setSelectedCategory(null);
      }, 500);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.categories')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage product categories</p>
        </div>
        <Link to="/admin/categories/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Category</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder={t('ui.searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            className="flex-1 max-w-md"
          />
          <Button variant="outline" leftIcon={<ChevronRight className="w-4 h-4" />} onClick={() => setShowTree(!showTree)}>
            {showTree ? 'Hide Tree' : 'Show Tree'}
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Slug</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Parent</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Products</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Featured</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Visible</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredCategories.map(category => (
              <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{category.name[locale]}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{category.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{category.slug}</td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{getParentName(category.parentId)}</td>
                <td className="py-4 px-4 text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{category.productCount}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">products</p>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={cn('w-5 h-5 rounded-full mx-auto', category.featured ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-700')}>
                    {category.featured ? <Tag className="w-4 h-4 text-yellow-600" /> : <Tag className="w-4 h-4 text-gray-400" />}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={cn('w-5 h-5 rounded-full mx-auto', category.visible ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700')}>
                    {category.visible ? '✓' : '✗'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <Link to={`/admin/categories/${category.id}/edit`} className="p-2 text-gray-500 hover:text-primary-600" title="Edit">✏️</Link>
                  <button onClick={() => handleDelete(category)} className="p-2 text-gray-500 hover:text-red-600" title="Delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No categories found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search</p>
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setSelectedCategory(null); }} title="Delete Category" size="sm">
        {selectedCategory && (
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{selectedCategory.name[locale]}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setDeleteModalOpen(false); setSelectedCategory(null); }}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setDeleteModalOpen(false); setSelectedCategory(null); }, 500); }} loading={loading}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function formatPriceUtil(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR' }).format(amount);
}