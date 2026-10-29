import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, Heart, Globe, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn, useClickOutside } from '@/utils/index.ts';
import { useAuth } from '@/hooks/index.ts';
import { useLocale } from '@/hooks/index.ts';
import { useCart } from '@/hooks/index.ts';
import { supportedLocales } from '../../locales';

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { locale, setLocale, t, direction } = useLocale();
  const { cart, getItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchRef, () => setSearchOpen(false));
  useClickOutside(userMenuRef, () => setUserMenuOpen(false));
  useClickOutside(langMenuRef, () => setLangMenuOpen(false));

  const isHome = location.pathname === '/';
  const cartCount = getItemCount();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/shop', label: t('nav.shop') },
    { path: '/categories', label: t('nav.categories') },
    { path: '/brands', label: t('nav.brands') },
    { path: '/offers', label: t('nav.offers') },
  ];

  return (
    <header className={cn('sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800', direction === 'rtl' && '')}>
      {/* Top Bar */}
      <div className="hidden md:flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            {t('nav.language')}: {locale === 'ar' ? 'العربية' : 'English'}
          </span>
          <span className="flex items-center gap-1">
            📞 {t('footer.contact')}: +966 11 234 5678
          </span>
          <span className="flex items-center gap-1">
            ✉️ {t('footer.contact')}: support@dokkan.sa
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/faq" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
            {t('nav.faq')}
          </Link>
          <Link to="/contact" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
            {t('nav.contact')}
          </Link>
          <Link to="/track" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
            {t('footer.trackOrder')}
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label={t('app.name')}>
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white hidden sm:block">
                {t('app.name')}
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl hidden md:block relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder={t('ui.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  aria-label={t('ui.searchPlaceholder')}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Language Selector */}
              <div ref={langMenuRef} className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <Globe className="w-5 h-5" />
                  <span className="hidden sm:inline">{locale === 'ar' ? 'عربي' : 'EN'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 animate-in zoom-in-95">
                    {supportedLocales.map(loc => (
                      <button
                        key={loc}
                        onClick={() => { setLocale(loc); setLangMenuOpen(false); }}
                        className={cn(
                          'w-full px-4 py-2 text-sm text-left transition-colors',
                          locale === loc ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        )}
                      >
                        {loc === 'ar' ? 'العربية' : 'English'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                {user ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{user.displayName || user.email}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{t('nav.login')}</span>
                  </Link>
                )}

                {userMenuOpen && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 animate-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName || user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {t('nav.account')}
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {t('nav.orders')}
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {t('nav.wishlist')}
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {t('nav.settings')}
                    </Link>
                    {user.role !== 'customer' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        {t('nav.admin')}
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100 dark:border-gray-700" />
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                    >
                      {t('auth.logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top">
            <nav className="flex flex-col gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                    location.pathname === item.path && 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {t('nav.login')}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}