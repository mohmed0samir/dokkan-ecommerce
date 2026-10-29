import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animated?: boolean;
}

const variantStyles = {
  text: 'h-4 rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-lg',
  card: 'rounded-xl',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width = '100%',
      height,
      lines = 1,
      animated = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const baseStyle = {
      width,
      height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '3rem' : 'auto'),
      minHeight: variant === 'text' ? '1rem' : undefined,
    } as React.CSSProperties;

    if (lines > 1 && variant === 'text') {
      return (
        <div ref={ref} className={cn('space-y-2', className)} style={style} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'bg-gray-200 dark:bg-gray-700 rounded',
                animated && 'animate-pulse'
              )}
              style={{
                width: i === lines - 1 ? '60%' : '100%',
                height: '1rem',
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-gray-200 dark:bg-gray-700',
          variantStyles[variant],
          animated && 'animate-pulse',
          className
        )}
        style={{ ...baseStyle, ...style }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export interface SkeletonCardProps {
  variant?: 'default' | 'product' | 'order' | 'user';
  className?: string;
}

export function SkeletonCard({ variant = 'default', className }: SkeletonCardProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse', className)}>
      {variant === 'product' && (
        <>
          <Skeleton variant="rectangular" width="100%" height="200px" className="mb-4" />
          <Skeleton variant="text" width="70%" className="mb-2" />
          <Skeleton variant="text" width="40%" className="mb-4" />
          <Skeleton variant="text" width="30%" className="mb-4" />
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width="80px" height="32px" />
            <Skeleton variant="text" width="60px" height="32px" />
          </div>
        </>
      )}

      {variant === 'order' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="text" width="150px" />
            <Skeleton variant="text" width="100px" />
          </div>
          <div className="space-y-3 mb-4">
            <Skeleton variant="rectangular" width="100%" height="60px" />
            <Skeleton variant="rectangular" width="100%" height="60px" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width="80px" />
            <Skeleton variant="text" width="100px" />
          </div>
        </>
      )}

      {variant === 'user' && (
        <>
          <div className="flex items-center gap-4 mb-4">
            <Skeleton variant="circular" width="56px" height="56px" />
            <div className="space-y-2 flex-1">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton variant="rectangular" height="80px" />
            <Skeleton variant="rectangular" height="80px" />
            <Skeleton variant="rectangular" height="80px" />
          </div>
        </>
      )}

      {variant === 'default' && (
        <>
          <div className="space-y-3">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Skeleton variant="rectangular" height="100px" />
            <Skeleton variant="rectangular" height="100px" />
          </div>
        </>
      )}
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton variant="text" width="80%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton variant="text" width={colIndex === 0 ? '60%' : '80%'} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonList({ items = 5, variant = 'default' }: { items?: number; variant?: 'default' | 'avatar' }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          {variant === 'avatar' && <Skeleton variant="circular" width="48px" height="48px" />}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width={variant === 'avatar' ? '40%' : '60%'} />
            <Skeleton variant="text" width={variant === 'avatar' ? '30%' : '40%'} />
          </div>
          <Skeleton variant="text" width="80px" />
        </div>
      ))}
    </div>
  );
}