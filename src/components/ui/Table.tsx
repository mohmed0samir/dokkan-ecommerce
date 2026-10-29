import { ReactNode, HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

export interface Column<T> {
  key: string;
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyAccessor: keyof T | ((row: T) => string);
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  sort?: {
    column: string;
    direction: 'asc' | 'desc';
    onSort: (column: string, direction: 'asc' | 'desc') => void;
  };
}

export const Table = forwardRef<HTMLDivElement, TableProps<any>>(
  (
    {
      columns,
      data,
      keyAccessor,
      onRowClick,
      selectable = false,
      selectedKeys = new Set(),
      onSelectionChange,
      loading = false,
      emptyMessage = 'No data available',
      className,
      striped = true,
      hoverable = true,
      bordered = true,
      compact = false,
      pagination,
      sort,
    },
    ref
  ) => {
  const getRowKey = (row: any): string => {
    if (typeof keyAccessor === 'function') return keyAccessor(row);
    return String(row[keyAccessor]);
  };

  const isSelected = (row: any) => selectedKeys.has(getRowKey(row));
  const isAllSelected = data.length > 0 && data.every(row => isSelected(row));
  const isIndeterminate = data.length > 0 && data.some(row => isSelected(row)) && !isAllSelected;

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (isAllSelected) {
      onSelectionChange(new Set());
    } else {
      const newKeys = new Set(selectedKeys);
      data.forEach(row => newKeys.add(getRowKey(row)));
      onSelectionChange(newKeys);
    }
  };

  const handleRowSelect = (row: any) => {
    if (!onSelectionChange) return;
    const key = getRowKey(row);
    const newKeys = new Set(selectedKeys);
    if (newKeys.has(key)) {
      newKeys.delete(key);
    } else {
      newKeys.add(key);
    }
    onSelectionChange(newKeys);
  };

  const handleSort = (columnKey: string) => {
    if (!sort || !columns.find(c => c.key === columnKey)?.sortable) return;
    const newDirection = sort.column === columnKey && sort.direction === 'asc' ? 'desc' : 'asc';
    sort.onSort(columnKey, newDirection);
  };

  if (loading) {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <table className="w-full" role="grid">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.key} className={cn('px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400', column.headerClassName)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map(column => (
                  <td key={column.key} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('overflow-x-auto', className)}>
      <table className="w-full" role="grid">
        <thead>
          <tr className={cn('border-b border-gray-200 dark:border-gray-700', bordered && '')}>
            {selectable && (
              <th
                className={cn(
                  'px-4 py-3 text-left',
                  compact && 'py-2',
                  bordered && 'border-r border-gray-200 dark:border-gray-700'
                )}
                scope="col"
              >
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map(column => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400',
                  'cursor-pointer select-none',
                  compact && 'py-2',
                  column.sortable && 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  bordered && 'border-r border-gray-200 dark:border-gray-700',
                  column.headerClassName
                )}
                scope="col"
                onClick={() => handleSort(column.key)}
                style={{ width: column.width }}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && sort?.column === column.key && (
                    <span className="text-primary-600 dark:text-primary-400">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={getRowKey(row)}
                className={cn(
                  'transition-colors',
                  striped && rowIndex % 2 === 0 && 'bg-gray-50 dark:bg-gray-800/50',
                  hoverable && 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className={cn('px-4 py-3', compact && 'py-2', bordered && 'border-r border-gray-200 dark:border-gray-700')}>
                    <Checkbox
                      checked={isSelected(row)}
                      onChange={() => handleRowSelect(row)}
                      aria-label={`Select row ${rowIndex + 1}`}
                    />
                  </td>
                )}
                {columns.map(column => {
                  const value = typeof column.accessor === 'function' ? column.accessor(row) : row[column.accessor];
                  const rendered = column.render ? column.render(value, row, rowIndex) : (value as ReactNode);

                  return (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-sm text-gray-900 dark:text-gray-100',
                        compact && 'py-2',
                        bordered && 'border-r border-gray-200 dark:border-gray-700',
                        column.cellClassName
                      )}
                    >
                      {rendered}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pagination.pageSize}
              onChange={e => pagination.onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {[10, 20, 50, 100].map(size => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export const TableComponent = forwardRef<HTMLDivElement, TableProps<any>>((props, ref) => <Table {...props} ref={ref} />);
TableComponent.displayName = 'Table';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, className, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <label className={cn('flex items-center gap-2 cursor-pointer', className)}>
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={cn(
            'w-4 h-4 rounded border-gray-300 text-primary-600',
            'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          {...props}
        />
        {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';