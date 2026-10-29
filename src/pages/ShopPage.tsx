import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Grid, List, Filter, ChevronDown, Star, Tag } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Select, Badge, Skeleton, SkeletonCard } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';

const mockProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 500) + 50,
  originalPrice: Math.floor(Math.random() * 200) + 600,
  image: ['📱', '👟', '🎧', '⌚', '💻', '👕', '👗', '🧸', '📚', '🏠'][i % 10],
  rating: (Math.random() * 1.5 + 3.5).toFixed(1),
  reviews: Math.floor(Math.random() * 500) + 10,
  badge: i % 5 === 0 ? 'New' : i % 3 === 0 ? 'Sale' : null,
  category: ['electronics', 'fashion', 'home', 'sports'][i % 4],
  brand: ['Apple', 'Nike', 'Samsung', 'Adidas', 'Sony'][i % 5],
}));

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'sports', name: 'Sports' },
];

const brands = ['Apple', 'Nike', 'Samsung', 'Adidas', 'Sony', 'LG', 'Puma', 'Under Armour'];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [showFilters, setShowFilters] = useState(false);

  const { t, locale, direction, formatPrice: formatPriceUtil } = useLocale();

  // Filter products based on selections
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...mockProducts];

      if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }

      if (selectedBrand.length > 0) {
        filtered = filtered.filter(p => selectedBrand.includes(p.brand));
      }

      filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

      // Sort
      switch (sortBy) {
        case 'priceLowHigh':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'priceHighLow':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => b.id - a.id);
          break;
        case 'bestSelling':
          filtered.sort((a, b) => b.reviews - a.reviews);
          break;
        case 'topRated':
          filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
          break;
      }

      setProducts(filtered);
      setLoading(false);
    }, 300);
  }, [selectedCategory, selectedBrand, priceRange, sortBy]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const params = new URLSearchParams(searchParams);
    if (value === 'all') params.delete('category');
    else params.set('category', value);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand([]);
    setPriceRange([0, 1000]);
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    setSearchParams(params);
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedBrand.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950', direction === 'rtl' && 'rtl')}>
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {t('shop.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('shop.resultsCount', { count: products.length })}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={cn('lg:w-64 flex-shrink-0', showFilters && 'fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 w-80 shadow-xl p-4 overflow-y-auto')}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('shop.filters')}</h2>
              {showFilters && (
                <button onClick={() => setShowFilters(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
                  <ChevronDown className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('shop.categories')}</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={selectedCategory === cat.id}
                      onChange={e => handleCategoryChange(e.target.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t(`categories.${cat.id}`) || cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('shop.brands')}</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrand.includes(brand)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedBrand([...selectedBrand, brand]);
                        } else {
                          setSelectedBrand(selectedBrand.filter(b => b !== brand));
                        }
                      }}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('shop.priceRange')}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-16">{t('shop.minPrice')}</span>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                    min={0}
                    max={1000}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-16">{t('shop.maxPrice')}</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                    min={0}
                    max={1000}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="range" min={0} max={1000} value={priceRange[0]} onChange={e => setPriceRange([parseInt(e.target.value), priceRange[1]])} className="flex-1" />
                  <input type="range" min={0} max={1000} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="flex-1" />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <Button variant="outline" className="w-full" onClick={clearFilters}>
                {t('shop.clearFilters')}
              </Button>
            )}
          </aside>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden fixed bottom-4 left-4 z-40 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            {t('shop.filters')} ({products.length})
          </button>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  options={[
                    { value: 'featured', label: t('shop.sortOptions.featured') },
                    { value: 'priceLowHigh', label: t('shop.sortOptions.priceLowHigh') },
                    { value: 'priceHighLow', label: t('shop.sortOptions.priceHighLow') },
                    { value: 'newest', label: t('shop.sortOptions.newest') },
                    { value: 'bestSelling', label: t('shop.sortOptions.bestSelling') },
                    { value: 'topRated', label: t('shop.sortOptions.topRated') },
                  ]}
                  className="w-48"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn('p-2 rounded-lg', viewMode === 'grid' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800')}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn('p-2 rounded-lg', viewMode === 'list' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800')}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className={cn('grid gap-6', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1')}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} variant="product" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">{viewMode === 'grid' ? '📦' : '📋'}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('shop.noProductsFound')}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{t('shop.tryDifferentFilters')}</p>
                <Button variant="outline" onClick={clearFilters}>{t('shop.clearFilters')}</Button>
              </div>
            ) : (
              <div className={cn('gap-6', viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4')}>
                {products.map(product => (
                  <Link key={product.id} to={`/product/${product.id}`} className="group">
                    <article className={cn(
                      'bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300',
                      viewMode === 'list' && 'flex flex-row'
                    )}>
                      <div className={cn('relative aspect-square bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-6xl', viewMode === 'list' && 'w-48 flex-shrink-0')}>
                        {product.image}
                        {product.badge && (
                          <Badge variant={product.badge === 'Sale' ? 'error' : 'info'} className="absolute top-2 right-2">
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                      <div className={cn('p-4', viewMode === 'list' && 'flex-1 flex flex-col justify-between')}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">
                            {product.name}
                          </h3>
                          <span className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm">{product.rating}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">({product.reviews})</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{product.brand}</p>
                        <div className={cn('flex items-center gap-2', viewMode === 'list' && 'mt-auto pt-4 border-t border-gray-100 dark:border-gray-700')}>
                          <span className="text-xl font-bold text-primary-600">{formatPriceUtil(product.price)}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">{formatPriceUtil(product.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="primary" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <span className="px-2 text-gray-500">...</span>
              <Button variant="outline" size="sm">10</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

