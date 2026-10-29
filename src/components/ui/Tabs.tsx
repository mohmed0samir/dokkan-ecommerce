import React, { ReactNode, useState, useCallback, HTMLAttributes, forwardRef, isValidElement } from 'react';
import { cn } from '../../utils';

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode | React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  badge?: string | number;
  children?: ReactNode;
}

export interface TabsProps {
  items?: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

const variantStyles = {
  default: 'border-b border-gray-200 dark:border-gray-700',
  pills: '',
  underline: 'border-b border-gray-200 dark:border-gray-700',
};

const tabStyles = {
  default: 'px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
  pills: 'px-4 py-2 text-sm font-medium rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
  underline: 'px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-b-2 border-transparent -mb-px',
};

const activeStyles = {
  default: 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400',
  pills: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  underline: 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400',
};

export function Tabs({ items = [], value, onChange, variant = 'default', fullWidth = false, className, children }: TabsProps) {
  // Support both APIs:
  // 1. New API: items with children property
  // 2. Old API: children prop containing TabPanel components
  const useNewApi = items.length > 0 && items.some(item => item.children !== undefined);
  const tabItems = useNewApi ? items : ([] as TabItem[]);

  // Extract tab items from children (old API) if not using new API
  let oldApiTabItems: TabItem[] = [];
  if (!useNewApi && children) {
    React.Children.forEach(children, (child) => {
      if (isValidElement<TabPanelProps>(child) && child.type === TabPanel) {
        const panelValue = child.props.value as string;
        const panelLabel = tabItems.find(t => t.value === panelValue)?.label || panelValue;
        oldApiTabItems.push({
          value: panelValue,
          label: panelLabel,
          children: child.props.children,
        });
      }
    });
  }

  const effectiveItems = useNewApi ? items : oldApiTabItems;

  return (
    <div className={cn(variantStyles[variant], className)}>
      <nav className={cn('flex', fullWidth && 'w-full')} role="tablist" aria-label="Tabs">
        {effectiveItems.map((item, index) => (
          <button
            key={item.value}
            role="tab"
            aria-selected={value === item.value}
            aria-controls={`tabpanel-${item.value}`}
            id={`tab-${item.value}`}
            disabled={item.disabled}
            onClick={() => !item.disabled && onChange(item.value)}
            className={cn(
              'flex items-center justify-center gap-2 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              tabStyles[variant],
              value === item.value && activeStyles[variant],
              fullWidth && 'flex-1'
            )}
          >
            {item.icon && (
              <span className="flex-shrink-0">
                {typeof item.icon === 'function' ? React.createElement(item.icon, { className: 'w-4 h-4' }) : item.icon}
              </span>
            )}
            {item.label}
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="mt-4">
        {effectiveItems.map(item => (
          <div
            key={item.value}
            role="tabpanel"
            id={`tabpanel-${item.value}`}
            aria-labelledby={`tab-${item.value}`}
            hidden={value !== item.value}
            className="animate-in fade-in-0 duration-200"
          >
            {item.children}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  return <div className={cn(className)}>{children}</div>;
}