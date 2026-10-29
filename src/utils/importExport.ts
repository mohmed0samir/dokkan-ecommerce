/**
 * CSV and XLSX import/export utilities for Dokkan E-Commerce Platform
 */

import { parse as papaParse, ParseResult } from 'papaparse';
import * as XLSX from 'xlsx';
import type { ImportJob, ImportError, ImportMapping, ImportOptions } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ImportFormat = 'csv' | 'xlsx' | 'json';
export type ImportEntity = 'products' | 'suppliers' | 'inventory' | 'orders';

export interface ImportResult<T = unknown> {
  job: ImportJob;
  successful: T[];
  errors: ImportError[];
}

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  filename?: string;
  columns?: string[];
}

// ---------------------------------------------------------------------------
// CSV helpers
// ---------------------------------------------------------------------------

/** Parse a CSV file (File or Blob) into an array of row objects. */
export async function parseCSV(file: File | Blob): Promise<{ data: Record<string, unknown>[]; errors: string[] }> {
  return new Promise((resolve, reject) => {
    papaParse(file as unknown as File, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (result: ParseResult<Record<string, unknown>>) => {
        const errors: string[] = [];
        if (result.errors.length > 0) {
          result.errors.forEach((e) => errors.push(`Row ${e.row ?? 0}: ${e.message}`));
        }
        resolve({ data: result.data, errors });
      },
      error: (e: Error) => reject(e),
    });
  });
}

/** Parse an XLSX file (File or Blob) into an array of row objects (first sheet). */
export async function parseXLSX(file: File | Blob): Promise<{ data: Record<string, unknown>[]; errors: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        if (json.length === 0) {
          resolve({ data: [], errors: [] });
          return;
        }

        const headers = (json[0] as unknown[]).map(String);
        const rows: Record<string, unknown>[] = [];
        const errors: string[] = [];

        for (let i = 1; i < json.length; i++) {
          const row = json[i] as unknown[];
          const obj: Record<string, unknown> = {};
          let rowError = false;
          headers.forEach((h, idx) => {
            if (h && h.trim()) {
              obj[h.trim()] = row[idx];
            }
          });
          if (Object.keys(obj).length === 0) {
            errors.push(`Row ${i + 1}: Empty row`);
            rowError = true;
          }
          if (!rowError) rows.push(obj);
        }

        resolve({ data: rows, errors });
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/** Detect import format from file extension or MIME type. */
export function detectFormat(file: File): ImportFormat {
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv') || file.type.includes('csv')) return 'csv';
  if (name.endsWith('.xlsx') || name.endsWith('.xls') || file.type.includes('spreadsheet')) return 'xlsx';
  if (name.endsWith('.json') || file.type.includes('json')) return 'json';
  return 'csv';
}

/** Parse an uploaded file based on its detected format. */
export async function parseImportFile(
  file: File
): Promise<{ data: Record<string, unknown>[]; errors: string[]; format: ImportFormat }> {
  const format = detectFormat(file);
  if (format === 'csv') {
    const { data, errors } = await parseCSV(file);
    return { data, errors, format };
  }
  if (format === 'xlsx') {
    const { data, errors } = await parseXLSX(file);
    return { data, errors, format };
  }
  // JSON
  const text = await file.text();
  try {
    const json = JSON.parse(text);
    const data = Array.isArray(json) ? json : [json];
    return { data: data as Record<string, unknown>[], errors: [], format };
  } catch (e) {
    return { data: [], errors: [(e as Error).message], format };
  }
}

// ---------------------------------------------------------------------------
// Column mapping
// ---------------------------------------------------------------------------

/** Apply a column mapping to a row, renaming keys according to the mapping. */
export function applyMapping(
  row: Record<string, unknown>,
  mapping: ImportMapping
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  Object.entries(row).forEach(([sourceCol, value]) => {
    const target = mapping[sourceCol] ?? sourceCol;
    mapped[target] = value;
  });
  return mapped;
}

/** Infer a column mapping by matching source headers to known target fields. */
export function inferMapping(
  sourceHeaders: string[],
  targetFields: string[]
): ImportMapping {
  const mapping: ImportMapping = {};
  const lowerTargets = targetFields.map((t) => t.toLowerCase());

  sourceHeaders.forEach((header) => {
    const lowerHeader = header.toLowerCase().trim();
    // Exact match
    const exactIdx = lowerTargets.indexOf(lowerHeader);
    if (exactIdx !== -1) {
      mapping[header] = targetFields[exactIdx];
      return;
    }
    // Contains match
    const containsIdx = lowerTargets.findIndex((t) => lowerHeader.includes(t) || t.includes(lowerHeader));
    if (containsIdx !== -1) {
      mapping[header] = targetFields[containsIdx];
      return;
    }
    // Default: keep as-is
    mapping[header] = header;
  });

  return mapping;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'phone' | 'date' | 'boolean';
  min?: number;
  max?: number;
  pattern?: RegExp;
}

/** Validate a single row against rules. Returns errors or null. */
export function validateRow(
  row: Record<string, unknown>,
  rules: ValidationRule[]
): ImportError[] {
  const errors: ImportError[] = [];
  let rowNum: number | undefined;

  rules.forEach((rule) => {
    const value = row[rule.field];

    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        row: rowNum,
        field: rule.field,
        message: `${rule.field} is required`,
        value,
      });
      return;
    }

    if (value === undefined || value === null) return;

    switch (rule.type) {
      case 'number':
        if (typeof value !== 'number' && isNaN(Number(value))) {
          errors.push({ row: rowNum, field: rule.field, message: `${rule.field} must be a number`, value });
        } else if (rule.min !== undefined && Number(value) < rule.min) {
          errors.push({ row: rowNum, field: rule.field, message: `${rule.field} must be >= ${rule.min}`, value });
        } else if (rule.max !== undefined && Number(value) > rule.max) {
          errors.push({ row: rowNum, field: rule.field, message: `${rule.field} must be <= ${rule.max}`, value });
        }
        break;
      case 'email':
        if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push({ row: rowNum, field: rule.field, message: `${rule.field} must be a valid email`, value });
        }
        break;
      case 'phone':
        if (typeof value === 'string' && !/^(\+966|0)?[5-9]\d{8}$/.test(value.replace(/\s+/g, ''))) {
          errors.push({ row: rowNum, field: rule.field, message: `${rule.field} must be a valid Saudi phone number`, value });
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean' && !['true', 'false', '1', '0'].includes(String(value))) {
          errors.push({ row: rowNum, field: rule.field, message: `${rule.field} must be a boolean`, value });
        }
        break;
    }
  });

  return errors;
}

// ---------------------------------------------------------------------------
// Export helpers
// ---------------------------------------------------------------------------

/** Convert an array of objects to CSV string. */
export function toCSV<T extends Record<string, unknown>>(
  data: T[],
  columns?: string[]
): string {
  if (data.length === 0) return '';

  const cols = columns ?? Object.keys(data[0]);
  const header = cols.join(',');

  const rows = data.map((row) =>
    cols
      .map((c) => {
        const val = row[c];
        if (val === undefined || val === null) return '';
        const str = String(val);
        // Quote if contains comma, quote, or newline
        if (/[,"\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
        return str;
      })
      .join(',')
  );

  return [header, ...rows].join('\n');
}

/** Export data to CSV file download. */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: string[]
): void {
  const csv = toCSV(data, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Export data to XLSX file download. */
export function exportToXLSX<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  sheetName = 'Sheet1'
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/** Export data to JSON file download. */
export function exportToJSON<T extends Record<string, unknown>>(
  data: T[],
  filename: string
): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Generic export dispatcher. */
export function exportData<T extends Record<string, unknown>>(
  data: T[],
  options: ExportOptions
): void {
  const filename = options.filename ?? `export-${new Date().toISOString().slice(0, 10)}`;

  switch (options.format) {
    case 'csv':
      exportToCSV(data, filename, options.columns);
      break;
    case 'xlsx':
      exportToXLSX(data, filename);
      break;
    case 'json':
      exportToJSON(data, filename);
      break;
  }
}

// ---------------------------------------------------------------------------
// Import job helpers
// ---------------------------------------------------------------------------

export function createImportJob(
  entity: ImportEntity,
  file: File,
  createdBy: string,
  options: ImportOptions
): ImportJob {
  return {
    id: `import_${Date.now()}`,
    type: entity,
    status: 'pending',
    fileName: file.name,
    fileSize: file.size,
    totalRows: 0,
    processedRows: 0,
    successfulRows: 0,
    failedRows: 0,
    errors: [],
    mapping: {},
    options,
    createdAt: new Date(),
    createdBy,
  };
}

export function updateImportJob(
  job: ImportJob,
  updates: Partial<Pick<ImportJob, 'status' | 'totalRows' | 'processedRows' | 'successfulRows' | 'failedRows' | 'errors' | 'startedAt' | 'completedAt'>>
): ImportJob {
  return { ...job, ...updates };
}
