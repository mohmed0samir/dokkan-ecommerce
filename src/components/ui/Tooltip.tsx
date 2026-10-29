import React, { ReactNode, useState, useRef, useEffect, useCallback, isValidElement, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils';

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  trigger?: 'hover' | 'focus' | 'click';
}

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles = {
  top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-800',
  bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-800',
  left: 'right-[-4px] top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-800',
  right: 'left-[-4px] top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-800',
};

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
  className,
  trigger = 'hover',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipRect, setTooltipRect] = useState<DOMRect | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const childRef = useRef<HTMLElement>(null);

  const showTooltip = useCallback(() => {
    if (trigger === 'hover' || trigger === 'focus') {
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    }
  }, [delay, trigger]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  const handleClick = useCallback(() => {
    if (trigger === 'click') {
      setIsVisible(prev => !prev);
    }
  }, [trigger]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const childWithProps = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        ref: childRef,
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
        onClick: handleClick,
        'aria-describedby': isVisible ? 'tooltip-content' : undefined,
      } as any)
    : children;

  const tooltipContent = isVisible && childRef.current ? (
    <div
      id="tooltip-content"
      role="tooltip"
      className={cn(
        'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg',
        'animate-in zoom-in-95 duration-150',
        'whitespace-nowrap',
        positionStyles[position],
        className
      )}
      style={{ visibility: tooltipRect ? 'visible' : 'hidden' }}
    >
      {content}
      <div
        className={cn(
          'absolute w-0 h-0 border-4 border-transparent',
          arrowStyles[position]
        )}
      />
    </div>
  ) : null;

  return (
    <>
      {childWithProps}
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  );
}

export interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  className?: string;
  closeOnClickOutside?: boolean;
}

export function Popover({
  children,
  content,
  position = 'bottom',
  trigger = 'click',
  className,
  closeOnClickOutside = true,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current?.contains(event.target as Node)) return;
      if (contentRef.current?.contains(event.target as Node)) return;
      close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close, closeOnClickOutside]);

  const childWithProps = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        ref: triggerRef,
        onClick: trigger === 'click' ? toggle : undefined,
        onMouseEnter: trigger === 'hover' ? () => setIsOpen(true) : undefined,
        onMouseLeave: trigger === 'hover' ? close : undefined,
        'aria-expanded': isOpen,
        'aria-haspopup': true,
      } as any)
    : children;

  const popoverContent = isOpen ? (
    <div
      ref={contentRef}
      className={cn(
        'absolute z-50 w-72 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
        'animate-in zoom-in-95 duration-150',
        positionStyles[position],
        className
      )}
      role="dialog"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={trigger === 'hover' ? close : undefined}
    >
      {content}
    </div>
  ) : null;

  return (
    <div className="relative inline-block">
      {childWithProps}
      {popoverContent && createPortal(popoverContent, document.body)}
    </div>
  );
}