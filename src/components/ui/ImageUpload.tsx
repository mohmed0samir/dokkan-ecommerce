'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from './Button';
import { useLocale } from '@/hooks/index.ts';
import {
  compressImageToDataUrl,
  validateImageFile,
  type ImageUploadOptions,
} from '@/utils/imageUpload';

export interface ImageUploadProps {
  value?: string;
  onChange?: (dataUrl: string | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  options?: ImageUploadOptions;
  className?: string;
  onError?: (error: Error) => void;
}

export function ImageUpload({
  value,
  onChange,
  label,
  placeholder = 'Upload image',
  required = false,
  disabled = false,
  error,
  options = {},
  className,
  onError,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocale();

  const {
    maxSizeMB = 1,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    maxImages = 1,
  } = options;

  const handleFileSelect = useCallback(
    async (file: File) => {
      const validationError = validateImageFile(file, {
        maxSizeMB: options.maxSizeMB,
        allowedTypes: options.allowedTypes,
      });

      if (validationError) {
        setUploadError(validationError.message);
        onError?.(new Error(validationError.message));
        return;
      }

      setUploadError(null);
      setIsUploading(true);

      try {
        const result = await compressImageToDataUrl(file, {
          maxSizeMB: options.maxSizeMB,
          maxWidth: options.maxWidth,
          maxHeight: options.maxHeight,
          quality: options.quality,
          allowedTypes: options.allowedTypes,
        });

        setPreview(result.dataUrl);
        onChange?.(result.dataUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setUploadError(message);
        onError?.(err instanceof Error ? err : new Error(message));
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      // Reset input value to allow selecting the same file again
      if (event.currentTarget) {
        event.currentTarget.value = '';
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setUploadError(null);
    onChange?.(null);
  }, [onChange]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const files = Array.from(e.clipboardData.files);
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const getPreviewContent = () => {
    if (preview) {
      return (
        <div className="relative aspect-square">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500/90 text-white rounded-full hover:bg-red-700 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div
        className={cn(
          'aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors',
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500'
            : 'border-gray-200 dark:border-gray-700'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        aria-label={placeholder}
      >
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
            {placeholder}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            {t('ui.dragDropFiles') || 'Drag and drop or click to upload'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
            Max {options.maxSizeMB || 1}MB · JPEG, PNG, WebP
          </p>
        </div>
      </div>
    );
    };
    return (
    <div className={cn('w-full', className)}>
      <>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {getPreviewContent()}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled || isUploading}
          aria-label="Upload image"
        />

        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {t('ui.uploading') || 'Uploading...'}
              </span>
            </div>
          </div>
        )}

        {uploadError && (
          <div
            className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-center gap-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {error && !uploadError && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>

      <input
        type="hidden"
        name={options.name || 'image'}
        value={preview || ''}
        readOnly
      />
    </>
    </div>
  );
}