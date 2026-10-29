import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'w-8 h-5',
  md: 'w-11 h-6',
  lg: 'w-14 h-7',
};

const thumbSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const thumbTranslateStyles = {
  sm: 'translate-x-4',
  md: 'translate-x-5',
  lg: 'translate-x-7',
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, size = 'md', className, id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <label className={cn('flex items-center gap-3 cursor-pointer', className)}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className={cn(
              'peer appearance-none rounded-full border-2 border-gray-300 dark:border-gray-600',
              'bg-gray-200 dark:bg-gray-700',
              'checked:bg-primary-600 checked:border-primary-600',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors duration-200',
              sizeStyles[size]
            )}
            {...props}
          />
          <span
            className={cn(
              'absolute top-1/2 left-1 bg-white rounded-full shadow-md',
              'peer-checked:translate-x-full',
              'transition-transform duration-200',
              thumbSizeStyles[size],
              thumbTranslateStyles[size]
            )}
            aria-hidden="true"
          />
        </div>
        {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = 'Switch';