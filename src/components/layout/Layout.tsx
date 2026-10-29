import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { cn } from '../../utils';

interface LayoutProps {
  children?: ReactNode;
  className?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export function Layout({ children, className, hideHeader = false, hideFooter = false }: LayoutProps) {
  return (
    <div className={cn('flex flex-col min-h-screen', className)}>
      {!hideHeader && <Header />}
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export function AdminLayout({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex h-screen bg-gray-50 dark:bg-gray-900', className)}>
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hidden lg:flex">
        <AdminSidebar />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/admin/products', label: 'Products', icon: 'Package' },
    { path: '/admin/categories', label: 'Categories', icon: 'FolderOpen' },
    { path: '/admin/orders', label: 'Orders', icon: 'ShoppingBag' },
    { path: '/admin/customers', label: 'Customers', icon: 'Users' },
    { path: '/admin/suppliers', label: 'Suppliers', icon: 'Truck' },
    { path: '/admin/advertising', label: 'Advertising', icon: 'Megaphone' },
    { path: '/admin/campaigns', label: 'Campaigns', icon: 'Target' },
    { path: '/admin/advertisers', label: 'Advertisers', icon: 'UserPlus' },
    { path: '/admin/settings', label: 'Settings', icon: 'Settings' },
    { path: '/admin/users', label: 'Users', icon: 'UserCog' },
    { path: '/admin/audit', label: 'Audit Log', icon: 'FileText' },
    { path: '/admin/imports', label: 'Imports', icon: 'Upload' },
    { path: '/admin/exports', label: 'Exports', icon: 'Download' },
  ];

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Menu
      </div>
      {navItems.map((item, index) => (
        <a
          key={index}
          href={item.path}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="w-5 h-5 text-gray-400">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function AdminHeader() {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your store</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">A</span>
        </div>
      </div>
    </header>
  );
}

export function AuthLayout({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4', className)}>
      <div className="w-full max-w-md">
        {children || <Outlet />}
      </div>
    </div>
  );
}