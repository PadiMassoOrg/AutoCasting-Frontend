import clsx from 'clsx';
import React, { forwardRef, useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import deleteIcon from '../../../../../shared/icons/delete.svg';
import editIcon from '../../../../../shared/icons/edit.svg';

export type UploadTileClasses = Partial<{
  root: string;
  inner: string;
  preview: string;
  empty: string;
  icon: string;
  label: string;
  remove: string;
  input: string;
  overlay: string;
  actionsBar: string;
  actionBtn: string;
}>;

export type UploadTileProps = {
  label?: React.ReactNode;
  value?: string | null;
  previewUrl?: string | null;
  onSelect: (files: File[] | File) => void;
  onClear?: () => void;
  openOnClick?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  className?: string;
  classes?: UploadTileClasses;
  style?: React.CSSProperties;
  aspectRatio?: number | string;
  roundedClassName?: string;
  dashed?: boolean;
  objectFit?: 'cover' | 'contain';
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  capture?: 'user' | 'environment';
  maxSizeMB?: number;
  onError?: (err: Error) => void;
  renderEmpty?: () => React.ReactNode;
  renderPreview?: (url: string) => React.ReactNode;
  bustKey?: string | number;
  busy?: boolean;
  busyText?: React.ReactNode;
  ariaLabel?: string;
};

const DEFAULT_ROUNDED = 'rounded-xl';

function withinAccept(file: File, accept?: string) {
  if (!accept) return true;
  const parts = accept.split(',').map((s) => s.trim());
  return parts.some((p) => {
    if (p.endsWith('/*')) {
      const prefix = p.slice(0, -2);
      return file.type.startsWith(prefix);
    }
    return file.type === p;
  });
}

function withBust(url?: string | null, bustKey?: string | number) {
  if (!url) return url ?? undefined;
  if (bustKey == null) return url;
  return url + (url.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(String(bustKey));
}

const UploadTile = forwardRef<HTMLDivElement, UploadTileProps>(function UploadTile(
  {
    label,
    value,
    previewUrl,
    onSelect,
    onClear,
    onEditClick,
    onDeleteClick,
    className,
    classes,
    style,
    aspectRatio = '3 / 4',
    roundedClassName = DEFAULT_ROUNDED,
    dashed = true,
    objectFit = 'cover',
    disabled = false,
    multiple = false,
    accept = 'image/*',
    capture,
    maxSizeMB,
    onError,
    renderEmpty,
    renderPreview,
    bustKey,
    busy = false,
    busyText = 'Loading...',
    ariaLabel = 'Upload file',
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const openDialog = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleFiles = useCallback(
    (filesList: FileList | File[]) => {
      const files = Array.from(filesList as any as File[]);
      for (const f of files) {
        if (!withinAccept(f, accept)) {
          onError?.(new Error('Formato no permitido.'));
          return;
        }
        if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) {
          onError?.(new Error(`Máximo ${maxSizeMB}MB.`));
          return;
        }
      }
      onSelect(multiple ? files : files[0]);
    },
    [accept, maxSizeMB, multiple, onSelect, onError]
  );

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fl = e.target.files;
    if (fl?.length) handleFiles(fl);
    e.currentTarget.value = '';
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);

  const baseBorder = dashed ? 'border-1 border-dashed' : 'border';
  const dragCls = dragOver ? 'bg-gray-100 border-gray-400' : 'bg-gray-50 border-gray-300';

  const displayUrl = withBust(previewUrl ?? value ?? undefined, bustKey);
  const hasImage = Boolean(displayUrl);
  const rootClickable = !disabled && !busy && !hasImage;

  return (
    <div
      ref={ref}
      className={clsx(
        'relative w-full select-none focus:outline-none overflow-hidden',
        rootClickable ? 'cursor-pointer' : 'cursor-default',
        classes?.root,
        className
      )}
      style={{ ...style, aspectRatio }}
      role={rootClickable ? 'button' : undefined}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      aria-busy={busy || undefined}
      tabIndex={rootClickable ? 0 : -1}
      onClick={() => {
        if (rootClickable) openDialog();
      }}
      onKeyDown={(e) => {
        if (!rootClickable) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDialog();
        }
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div
        className={clsx(
          'h-full w-full flex items-center justify-center',
          baseBorder,
          roundedClassName,
          dragCls,
          disabled && 'opacity-50 pointer-events-none',
          classes?.inner
        )}
      >
        {displayUrl ? (
          renderPreview ? (
            renderPreview(displayUrl)
          ) : (
            <img
              src={displayUrl}
              alt=""
              loading="lazy"
              decoding="async"
              crossOrigin="anonymous"
              className={clsx('h-full w-full', roundedClassName, classes?.preview)}
              style={{ objectFit }}
            />
          )
        ) : renderEmpty ? (
          renderEmpty()
        ) : (
          <div className={clsx('flex flex-col items-center gap-2 text-gray-400', classes?.empty)}>
            <div
              className={clsx(
                'h-11 w-11 grid place-items-center rounded-full bg-gray-200 text-2xl leading-none',
                classes?.icon
              )}
            >
              +
            </div>
            {label && <span className={clsx('text-xs', classes?.label)}>{label}</span>}
          </div>
        )}
      </div>

      {busy && (
        <div
          className={clsx('absolute inset-0 grid place-items-center', roundedClassName, classes?.overlay)}
          style={{ pointerEvents: 'none', background: 'rgba(0,0,0,0.25)' }}
        >
          <div className="flex items-center gap-2 text-white text-sm">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>{busyText}</span>
          </div>
        </div>
      )}

      {hasImage && !busy && (
        <div
          className={clsx(
            'absolute left-0 right-0 bottom-0 px-3 py-2 sm:px-5 sm:py-3   bg-black/45 z-10 pointer-events-auto',
            roundedClassName,
            classes?.actionsBar
          )}
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-row justify-between items-center">
            <button
              type="button"
              className={clsx(
                'w-7 h-7 rounded-full bg-[var(--color-primary-light-grey)] grid place-items-center',
                'sm:w-12 sm:h-12 ',
                classes?.actionBtn
              )}
              style={{ cursor: 'pointer' }}
              aria-label="Editar imagen"
              onClick={(e) => {
                e.stopPropagation();
                if (onEditClick) onEditClick();
                else openDialog();
              }}
            >
              <img src={editIcon} className="w-[10px] h-[10px] sm:w-auto sm:h-auto" />
            </button>
            <button
              type="button"
              className={clsx(
                'w-7 h-7 rounded-full bg-[var(--color-primary-light-grey)] grid place-items-center',
                'sm:w-12 sm:h-12 ',
                classes?.actionBtn
              )}
              style={{ cursor: 'pointer' }}
              aria-label="Eliminar imagen"
              onClick={(e) => {
                e.stopPropagation();
                if (onDeleteClick) onDeleteClick();
                else onClear?.();
              }}
            >
              <img src={deleteIcon} className="w-[10px] h-[10px] sm:w-auto sm:h-auto" />
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        className={clsx('hidden', classes?.input)}
        type="file"
        accept={accept}
        multiple={multiple}
        capture={capture}
        disabled={disabled}
        onChange={onInputChange}
      />
    </div>
  );
});

export default UploadTile;
