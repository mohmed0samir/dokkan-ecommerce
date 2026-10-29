import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const variantStyles = {
  default: 'bg-primary-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      size = 'md',
      variant = 'default',
      showLabel = false,
      label,
      animated = false,
      striped = false,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label || `${Math.round(percentage)}%`}</span>
            {showLabel && <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</span>}
          </div>
        )}
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
            sizeStyles[size]
          )}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              variantStyles[variant],
              striped && 'bg-stripes',
              animated && 'animate-progress'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

const circularVariantStyles = {
  default: 'text-primary-600',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
};

export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value,
      max = 100,
      size = 48,
      strokeWidth = 4,
      variant = 'default',
      showLabel = true,
      label,
      animated = false,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={cn(
              'transition-all duration-500 ease-out',
              circularVariantStyles[variant],
              animated && 'animate-spin'
            )}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transformOrigin: 'center',
              transition: 'stroke-dashoffset 0.5s ease-out',
            }}
          />
        </svg>
        {(showLabel || label) && (
          <div className="absolute flex items-center justify-center" style={{ width: size - strokeWidth * 2, height: size - strokeWidth * 2 }}>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label || `${Math.round(percentage)}%`}</span>
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

export interface StepProgressProps {
  steps: { label: string; completed?: boolean; current?: boolean }[];
  variant?: 'default' | 'vertical';
  className?: string;
}

export function StepProgress({ steps, variant = 'default', className }: StepProgressProps) {
  return (
    <div className={cn('flex', variant === 'vertical' && 'flex-col', className)}>
      {steps.map((step, index) => (
        <div key={step.label} className={cn('flex items-center', variant === 'vertical' && 'flex-col')}>
          <div className={cn('relative flex items-center', variant === 'vertical' && 'mb-4')}>
            {index > 0 && (
              <div
                className={cn(
                  'absolute z-0',
                  variant === 'vertical'
                    ? 'left-5 top-10 bottom-10 w-0.5'
                    : 'left-0 right-0 h-0.5 top-5'
                )}
                style={{ backgroundColor: step.completed ? 'var(--color-success)' : 'var(--color-gray-300)' }}
              />
            )}
            <div
              className={cn(
                'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2',
                'transition-all duration-300',
                step.completed
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : step.current
                  ? 'border-primary-600 bg-white dark:bg-gray-800 text-primary-600'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400'
              )}
            >
              {step.completed ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
          </div>
          <div className={cn('flex-1 px-3', variant === 'vertical' && 'pl-12')}>
            <p className={cn('text-sm font-medium', step.current ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300')}>
              {step.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}