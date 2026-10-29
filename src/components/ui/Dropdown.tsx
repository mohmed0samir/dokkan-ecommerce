import { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { cn, useClickOutside } from '../../utils';
import { Button } from './Button';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
  danger?: boolean;
  shortcut?: string;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  onSelect: (value: string, item: DropdownItem) => void;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  align?: 'left' | 'right';
  className?: string;
  maxHeight?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function Dropdown({
  trigger,
  items,
  onSelect,
  placeholder,
  value,
  disabled = false,
  align = 'left',
  className,
  maxHeight = 300,
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const filteredItems = items.filter(item => {
    if (item.divider) return true;
    if (searchQuery) {
      return item.label.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
          event.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      const validItems = filteredItems.filter(item => !item.divider && !item.disabled);
      const validCount = validItems.length;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => {
            let next = prev + 1;
            while (next < filteredItems.length && (filteredItems[next].divider || filteredItems[next].disabled)) {
              next++;
            }
            return next >= filteredItems.length ? 0 : next;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => {
            let next = prev - 1;
            while (next >= 0 && (filteredItems[next].divider || filteredItems[next].disabled)) {
              next--;
            }
            return next < 0 ? filteredItems.length - 1 : next;
          });
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
            const item = filteredItems[highlightedIndex];
            if (!item.divider && !item.disabled) {
              onSelect(item.value, item);
              setIsOpen(false);
            }
          }
          break;
        case 'Tab':
          setIsOpen(false);
          break;
      }
    },
    [isOpen, filteredItems, highlightedIndex, onSelect]
  );

  const handleItemClick = (item: DropdownItem) => {
    if (item.divider || item.disabled) return;
    onSelect(item.value, item);
    setIsOpen(false);
  };

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
      setSearchQuery('');
    }
  };

  const selectedItem = items.find(item => item.value === value);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && itemsRef.current) {
      const itemElement = itemsRef.current.children[highlightedIndex] as HTMLElement;
      if (itemElement) {
        itemElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className={cn('relative inline-block', className)}
      onKeyDown={handleKeyDown}
    >
      <Button
        ref={triggerRef}
        variant="outline"
        onClick={handleTriggerClick}
        disabled={disabled}
        rightIcon={<ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />}
        className="w-full justify-between"
      >
        {value && selectedItem ? selectedItem.label : placeholder}
      </Button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
            'animate-in zoom-in-95',
            'overflow-hidden',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {searchable && (
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={e => e.stopPropagation()}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
          )}

          <div ref={itemsRef} className="py-1 max-h-[calc(100%-60px)] overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </div>
            ) : (
              filteredItems.map((item, index) => {
                if (item.divider) {
                  return <div key={index} className="border-t border-gray-100 dark:border-gray-700 my-1" />;
                }

                const isSelected = value === item.value;
                const isHighlighted = highlightedIndex === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={cn(
                      'w-full px-3 py-2 text-sm text-left flex items-center gap-2',
                      'transition-colors',
                      isHighlighted && 'bg-gray-100 dark:bg-gray-700',
                      item.danger && 'text-red-600 dark:text-red-400',
                      item.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    style={{ backgroundColor: isHighlighted ? undefined : 'transparent' }}
                  >
                    {item.icon && <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />}
                    {item.shortcut && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{item.shortcut}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (typeof window === 'undefined') return <>{trigger}</>;

  return createPortal(dropdownContent, document.body);
}

export interface SelectDropdownProps extends Omit<DropdownProps, 'trigger' | 'onSelect' | 'value'> {
  label?: string;
  error?: string;
  hint?: string;
  name: string;
  onChange: (value: string) => void;
  required?: boolean;
  fullWidth?: boolean;
}

export function SelectDropdown({
  label,
  error,
  hint,
  name,
  onChange,
  required,
  fullWidth = true,
  placeholder,
  items,
  disabled,
  align,
  className,
  maxHeight,
  searchable,
  searchPlaceholder,
  emptyMessage,
}: SelectDropdownProps) {
  const [value, setValue] = useState('');

  const handleSelect = useCallback(
    (selectedValue: string) => {
      setValue(selectedValue);
      onChange(selectedValue);
    },
    [onChange]
  );

  const trigger = (
    <Button
      variant="outline"
      fullWidth={fullWidth}
      disabled={disabled}
      leftIcon={null}
      rightIcon={<ChevronDown className="w-4 h-4" />}
      className={cn('w-full justify-between', className)}
    >
      {value ? items.find(i => i.value === value)?.label : placeholder}
    </Button>
  );

  return (
    <div className={cn('w-full', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <Dropdown
        trigger={trigger}
        items={items}
        onSelect={handleSelect}
        value={value}
        disabled={disabled}
        align={align}
        maxHeight={maxHeight}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
      />
      {error && <p className="mt-1.5 text-sm text-red-500" role="alert">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  );
}