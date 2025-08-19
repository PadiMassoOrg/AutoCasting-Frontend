// ui-lib/UploadTile.tsx
import React, { useRef, useState, useCallback, forwardRef, type ChangeEvent, type DragEvent } from 'react';
import clsx from 'clsx';

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
}>;

export type UploadTileProps = {
  /** Texto o nodo cuando está vacío */
  label?: React.ReactNode;
  /** URL persistida (server) */
  value?: string | null;
  /** URL de preview temporal (ObjectURL). Tiene prioridad sobre `value` */
  previewUrl?: string | null;

  /** Callback con 1 o N archivos */
  onSelect: (files: File[] | File) => void;
  /** Limpia el valor actual (si controlás desde afuera) */
  onClear?: () => void;

  /** Estética / estilos */
  className?: string;
  classes?: UploadTileClasses;
  style?: React.CSSProperties;
  /** CSS aspect-ratio (p. ej. 0.75, "3/4", "1 / 1") */
  aspectRatio?: number | string;
  /** Tailwind rounded (default: "rounded-xl") */
  roundedClassName?: string;
  /** Borde punteado (dashed) */
  dashed?: boolean;
  /** cover | contain (default: cover) */
  objectFit?: 'cover' | 'contain';

  /** Comportamiento */
  disabled?: boolean;
  multiple?: boolean;
  accept?: string; // "image/*,video/*"
  capture?: 'user' | 'environment';
  maxSizeMB?: number;
  onError?: (err: Error) => void;

  /** Personalizaciones profundas */
  renderEmpty?: () => React.ReactNode;
  renderPreview?: (url: string) => React.ReactNode;
  renderOverlay?: () => React.ReactNode;

  /** Cache-busting: agrega ?v={bustKey} */
  bustKey?: string | number;

  /** Overlay de carga simple sin tener que pasar renderOverlay */
  busy?: boolean;
  busyText?: React.ReactNode;

  /** Accesibilidad */
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
    renderOverlay,

    bustKey,
    busy = false,
    busyText = 'Loading...',

    ariaLabel = 'Upload file',
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [hover, setHover] = useState(false);

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
    e.currentTarget.value = ''; // permite re-seleccionar el mismo archivo
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
  const hoverCls = hover ? 'bg-gray-100' : '';

  const displayUrl = withBust(previewUrl ?? value ?? undefined, bustKey);

  return (
    <div
      ref={ref}
      className={clsx('cursor-pointer relative w-full select-none focus:outline-none', classes?.root, className)}
      style={{ ...style, aspectRatio }}
      role="button"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      aria-busy={busy || undefined}
      tabIndex={0}
      onClick={openDialog}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDialog();
        }
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={clsx(
          'h-full w-full flex items-center justify-center',
          baseBorder,
          roundedClassName,
          dragCls,
          hoverCls,
          disabled && 'opacity-50 pointer-events-none',
          classes?.inner
        )}
      >
        {/* Preview o estado vacío */}
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

      {/* Overlay: usa el custom si viene; si no, muestra uno simple cuando busy=true */}
      {(renderOverlay || busy) && (
        <div
          className={clsx('absolute inset-0 grid place-items-center', roundedClassName, classes?.overlay)}
          style={{ pointerEvents: 'none', background: 'rgba(0,0,0,0.25)' }}
        >
          {renderOverlay ? (
            renderOverlay()
          ) : (
            <div className="flex items-center gap-2 text-white text-sm">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>{busyText}</span>
            </div>
          )}
        </div>
      )}

      {/* Input real */}
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

      {/* Botón limpiar */}
      {onClear && (previewUrl || value) && (
        <button
          type="button"
          className={clsx(
            'absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 text-white',
            'flex items-center justify-center text-sm',
            classes?.remove
          )}
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          aria-label="Eliminar archivo"
        >
          ×
        </button>
      )}
    </div>
  );
});

export default UploadTile;
