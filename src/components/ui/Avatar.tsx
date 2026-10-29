import React, { ReactNode, HTMLAttributes, forwardRef, isValidElement, cloneElement, Children } from 'react';
import { cn } from '../../utils';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
  statusPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

const statusPositions = {
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      fallback,
      size = 'md',
      shape = 'circle',
      status,
      statusPosition = 'bottom-right',
      className,
      ...props
    },
    ref
  ) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700', sizeStyles[size], shapeClass, className)}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || ''}
            className={cn('w-full h-full object-cover', shapeClass)}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className={cn('flex items-center justify-center w-full h-full font-medium text-gray-600 dark:text-gray-400')}>
            {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
          </span>
        )}
        {status && (
          <span
            className={cn(
              'absolute border-2 border-white dark:border-gray-800 rounded-full',
              statusSizes[size],
              statusColors[status],
              statusPositions[statusPosition]
            )}
            aria-label={status}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;
  size?: AvatarProps['size'];
  overlap?: number;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max, size = 'md', overlap = -8, className, ...props }, ref) => {
    const kids = Children.toArray(children);
    const visibleChildren = max ? kids.slice(0, max) : kids;
    const remainingCount = max && kids.length > max ? kids.length - max : 0;

    return (
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        {visibleChildren.map((child, index) =>
          isValidElement(child) ? (
            <div key={index} className={cn('-ml-1 first:ml-0', index > 0 && `ml-[${overlap}px]`)}>
              {cloneElement(child as React.ReactElement<AvatarProps>, { size })}
            </div>
          ) : null
        )}
        {remainingCount > 0 && (
          <div
            className={cn(
              'flex items-center justify-center font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800',
              sizeStyles[size],
              'rounded-full',
              `ml-[${overlap}px]`
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';