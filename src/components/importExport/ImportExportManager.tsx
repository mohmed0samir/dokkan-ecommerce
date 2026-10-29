/**
 * Import/Export Manager UI component for Dokkan E-Commerce Platform
 * Provides file upload, preview, column mapping, and import/export operations
 */

import {
  useState,
  useCallback,
  useEffect,
  type ChangeEvent,
} from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  parseImportFile,
  detectFormat,
  applyMapping,
  inferMapping,
  validateRow,
  createImportJob,
  updateImportJob,
  type ImportEntity,
} from '@/utils/importExport';
import type { ImportJob, ImportError, ImportMapping, ImportOptions } from '@/types';
import { cn } from '@/utils';
import { useLocale } from '@/hooks/index.ts';
import { useAuth } from '@/hooks/index.ts';

interface ImportExportManagerProps {
  entity: ImportEntity;
  targetFields: string[];
  onImportComplete?: (job: ImportJob) => void;
}

type Step = 'upload' | 'preview' | 'mapping' | 'confirm' | 'complete' | 'error';

export function ImportExportManager({
  entity,
  targetFields,
  onImportComplete,
}: ImportExportManagerProps) {
  const { t, direction } = useLocale();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [rawData, setRawData] = useState<Record<string, unknown>[]>([]);
  const [mappedData, setMappedData] = useState<Record<string, unknown>[]>([]);
  const [mapping, setMapping] = useState<ImportMapping>({});
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [job, setJob] = useState<ImportJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  const totalRows = rawData.length;
  const errorCount = errors.length;
  const successCount = totalRows - errorCount;

  // Reset state when entity changes
  useEffect(() => {
    setStep('upload');
    setFile(null);
    setRawData([]);
    setMappedData([]);
    setMapping({});
    setErrors([]);
    setJob(null);
    setParseErrors([]);
  }, [entity]);

  // ------------------------------------------------------------------
  // File upload
  // ------------------------------------------------------------------

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) return;

      detectFormat(selectedFile);
      setFile(selectedFile);
      setStep('preview');
      setParseErrors([]);

      try {
        const { data, errors } = await parseImportFile(selectedFile);
        setRawData(data);
        setParseErrors(errors);

        // Auto-infer mapping
        const headers = data.length > 0 ? Object.keys(data[0]) : [];
        const inferred = inferMapping(headers, targetFields);
        setMapping(inferred);

        // Apply mapping
        const mapped = data.map((row) => applyMapping(row, inferred));
        setMappedData(mapped);

        // Validate
        const validationErrors: ImportError[] = [];
        mapped.forEach((row, idx) => {
          const rowErrors = validateRow(row, [
            { field: 'name', required: true, type: 'string' },
            { field: 'price', required: true, type: 'number', min: 0 },
          ]);
          rowErrors.forEach((e) => {
            validationErrors.push({ ...e, row: idx + 2 });
          });
        });
        setErrors(validationErrors);

        setStep('mapping');
      } catch (err) {
        setParseErrors([(err as Error).message]);
      }
    },
    [targetFields]
  );

  // ------------------------------------------------------------------
  // Mapping changes
  // ------------------------------------------------------------------

  const handleMappingChange = useCallback(
    (sourceCol: string, targetField: string) => {
      const newMapping = { ...mapping };
      if (targetField) {
        newMapping[sourceCol] = targetField;
      } else {
        delete newMapping[sourceCol];
      }
      setMapping(newMapping);

      const remapped = rawData.map((row) => applyMapping(row, newMapping));
      setMappedData(remapped);
    },
    [rawData, mapping]
  );

  // ------------------------------------------------------------------
  // Import execution
  // ------------------------------------------------------------------

  const handleImport = useCallback(async () => {
    if (!file || !user) return;

    setIsProcessing(true);

    const options: ImportOptions = {
      dryRun: false,
      skipErrors: true,
      updateExisting: true,
      createMissing: true,
      batchSize: 50,
    };

    const newJob = createImportJob(entity, file, user.uid, options);
    setJob(newJob);

    try {
      // Simulate batch processing
      let processed = 0;
      let successful = 0;
      let failed = 0;
      const jobErrors: ImportError[] = [];

      const batchSize = options.batchSize;
      for (let i = 0; i < mappedData.length; i += batchSize) {
        const batch = mappedData.slice(i, i + batchSize);
        // Simulate processing delay
        await new Promise((r) => setTimeout(r, 100));

        batch.forEach((row, batchIdx) => {
          processed++;
          // Simple validation: check required fields
          const hasName = row.name && String(row.name).trim().length > 0;
          const hasPrice = row.price && !isNaN(Number(row.price));
          if (hasName && hasPrice) {
            successful++;
          } else {
            failed++;
            jobErrors.push({
              row: i + batchIdx + 2,
              field: hasName ? 'price' : 'name',
              message: hasName ? 'Invalid price' : 'Missing name',
              value: row,
            });
          }
        });

        setJob(
          updateImportJob(newJob, {
            status: 'processing',
            processedRows: processed,
            successfulRows: successful,
            failedRows: failed,
            errors: jobErrors,
          })
        );
      }

      setJob(
        updateImportJob(newJob, {
          status: 'completed',
          processedRows: processed,
          successfulRows: successful,
          failedRows: failed,
          errors: jobErrors,
          completedAt: new Date(),
        })
      );

      setStep('complete');
      onImportComplete?.(
        updateImportJob(newJob, {
          status: 'completed',
          processedRows: processed,
          successfulRows: successful,
          failedRows: failed,
          errors: jobErrors,
          completedAt: new Date(),
        })
      );
    } catch (err) {
      setJob(
        updateImportJob(newJob, {
          status: 'failed',
          completedAt: new Date(),
        })
      );
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  }, [file, user, entity, mappedData, onImportComplete]);

  // ------------------------------------------------------------------
  // Export
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <div
      className={cn(
        'max-w-4xl mx-auto p-4',
        direction === 'rtl' && 'rtl'
      )}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('importExport.importTitle')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('importExport.subtitle', { entity })}
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-between mb-8">
        {['upload', 'preview', 'mapping', 'confirm', 'complete'].map((s, idx) => {
          const isActive = step === s;
          const isCompleted =
            (step === 'preview' && idx < 1) ||
            (step === 'mapping' && idx < 2) ||
            (step === 'confirm' && idx < 3) ||
            (step === 'complete' && idx < 4);
          return (
            <div
              key={s}
              className={cn('flex items-center', isCompleted ? '' : 'opacity-50')}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border transition-colors',
                  isCompleted
                    ? 'bg-green-600 border-green-600 text-white'
                    : isActive
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400'
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  idx + 1
                )}
              </div>
              {idx < 4 && (
                <ChevronRight
                  className={cn('w-4 h-4 mx-2', isCompleted ? 'text-green-500' : 'text-gray-300')}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step: Upload */}
      {step === 'upload' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-primary-400">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('importExport.uploadTitle')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xs mx-auto">
            {t('importExport.uploadDescription')}
          </p>

          <input
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const input = document.querySelector('input[type=file]') as HTMLInputElement | null;
              input?.click();
            }}
          >
            <FileText className="w-5 h-5 mr-2" />
            {t('importExport.chooseFile')}
          </Button>

          {parseErrors.length > 0 && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-red-700 dark:text-red-400">
                {parseErrors.join('; ')}
              </span>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>{t('importExport.supportedFormats')}: .csv, .xlsx, .xls, .json</p>
            <p>{t('importExport.maxFileSize')}: 50 MB</p>
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('importExport.previewTitle')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('importExport.rowsFound', { count: totalRows })}
              </p>
            </div>
            <Button variant="outline" onClick={() => setStep('upload')}>
              <X className="w-4 h-4 mr-2" />
              {t('importExport.changeFile')}
            </Button>
          </div>

          {parseErrors.length > 0 && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
              <span className="text-sm text-amber-700 dark:text-amber-400">
                {t('importExport.parseWarnings', { count: parseErrors.length })}
              </span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                  {Object.keys(rawData[0] ?? {}).map((header) => (
                    <th key={header} className="px-3 py-2 text-left text-gray-600 dark:text-gray-300 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rawData.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                    {Object.values(row).map((val, vIdx) => (
                      <td key={vIdx} className="px-3 py-2 text-gray-900 dark:text-white">
                        {String(val).slice(0, 50)}
                      </td>
                    ))}
                  </tr>
                ))}
                {totalRows > 10 && (
                  <tr>
                    <td
                      colSpan={Object.keys(rawData[0] ?? {}).length}
                      className="px-3 py-2 text-center text-gray-500 dark:text-gray-400 text-sm italic"
                    >
                      {t('importExport.moreRows', { count: totalRows - 10 })}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep('upload')}>
              {t('importExport.back')}
            </Button>
            <Button onClick={() => setStep('mapping')}>
              {t('importExport.next')} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Mapping */}
      {step === 'mapping' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('importExport.mappingTitle')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('importExport.mappingDescription')}
            </p>
          </div>

          <div className="space-y-3">
            {Object.keys(rawData[0] ?? {}).map((sourceCol) => (
              <div
                key={sourceCol}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {sourceCol}
                </span>
                <select
                  value={mapping[sourceCol] || ''}
                  onChange={(e) =>
                    handleMappingChange(sourceCol, e.target.value || undefined)
                  }
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{t('importExport.skipColumn')}</option>
                  {targetFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="ml-2 text-sm text-blue-800 dark:text-blue-300">
                {t('importExport.mappingHint')}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep('preview')}>
              {t('importExport.back')}
            </Button>
            <Button onClick={() => setStep('confirm')}>
              {t('importExport.next')} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('importExport.confirmTitle')}
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('importExport.totalRows')}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{totalRows}</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-xs text-green-700 dark:text-green-400 uppercase tracking-wider">
                {t('importExport.willImport')}
              </div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{successCount}</div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-xs text-red-700 dark:text-red-400 uppercase tracking-wider">
                {t('importExport.errors')}
              </div>
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{errorCount}</div>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="mb-6 max-h-64 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('importExport.errorPreview')}
              </h4>
              <ul className="space-y-1 text-sm">
                {errors.slice(0, 10).map((err, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700 dark:text-red-400">
                      Row {err.row}: {err.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep('mapping')}>
              {t('importExport.back')}
            </Button>
            <Button
              variant="success"
              onClick={handleImport}
              disabled={isProcessing}
              loading={isProcessing}
            >
              {isProcessing ? t('importExport.processing') : t('importExport.startImport')}
            </Button>
          </div>
        </div>
      )}

      {/* Step: Complete */}
      {step === 'complete' && job && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('importExport.importComplete')}
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-xs mx-auto">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('importExport.processed')}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{job.processedRows}</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-xs text-green-700 dark:text-green-400 uppercase tracking-wider">
                {t('importExport.successful')}
              </div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{job.successfulRows}</div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-xs text-red-700 dark:text-red-400 uppercase tracking-wider">
                {t('importExport.failed')}
              </div>
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{job.failedRows}</div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setStep('upload')}>
            {t('importExport.importAnother')}
          </Button>
        </div>
      )}

      {/* Step: Error */}
      {step === 'error' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('importExport.importFailed')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('importExport.importFailedDescription')}
          </p>
          <Button onClick={() => setStep('upload')}>
            {t('importExport.tryAgain')}
          </Button>
        </div>
      )}
    </div>
  );
}
