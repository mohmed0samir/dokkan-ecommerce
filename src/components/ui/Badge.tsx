import { ReactNode, HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  outline: 'bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
};

const dotColors = {
  default: 'bg-gray-400',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  outline: 'bg-gray-400',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', dot = false, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export interface StatusBadgeProps {
  status: string;
  variant?: BadgeProps['variant'];
  size?: BadgeProps['size'];
}

const statusConfig: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
  // Order statuses
  pending_confirmation: { label: 'Pending Confirmation', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'info' },
  processing: { label: 'Processing', variant: 'info' },
  shipped: { label: 'Shipped', variant: 'info' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'error' },
  returned: { label: 'Returned', variant: 'warning' },
  refunded: { label: 'Refunded', variant: 'success' },

  // COD statuses
  pending: { label: 'Pending Payment', variant: 'warning' },
  collected: { label: 'Collected', variant: 'success' },
  failed: { label: 'Collection Failed', variant: 'error' },

  // Product statuses
  draft: { label: 'Draft', variant: 'default' },
  active: { label: 'Active', variant: 'success' },
  archived: { label: 'Archived', variant: 'default' },
  out_of_stock: { label: 'Out of Stock', variant: 'error' },

  // Campaign statuses
  pending_approval: { label: 'Pending Approval', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  paused: { label: 'Paused', variant: 'warning' },
  expired: { label: 'Expired', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'error' },

  // Supplier statuses
  connected: { label: 'Connected', variant: 'success' },
  disconnected: { label: 'Disconnected', variant: 'warning' },
  not_configured: { label: 'Not Configured', variant: 'default' },

  // Advertiser statuses
  advertiser_approved: { label: 'Approved', variant: 'success' },
  suspended: { label: 'Suspended', variant: 'error' },
};

export function StatusBadge({ status, variant, size }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'default' };
  return <Badge variant={variant || config.variant} size={size}>{config.label}</Badge>;
}