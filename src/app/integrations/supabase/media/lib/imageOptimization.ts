const KB = 1024;
const MB = 1024 * KB;

type Preset = {
  maxSide: number;
  targetBytes: number;
  initialQuality: number;
  minQuality: number;
  qualityStep: number;
};

type ImageUploadKind =
  | 'talent-photo'
  | 'talent-thumbnail'
  | 'employer-logo'
  | 'employer-logo-thumbnail'
  | 'casting-role-photo';

const PRESETS: Record<ImageUploadKind, Preset> = {
  'talent-photo': {
    maxSide: 1600,
    targetBytes: 450 * KB,
    initialQuality: 0.82,
    minQuality: 0.58,
    qualityStep: 0.06,
  },
  // Sized for listing cards on retina screens and phones; avatars reuse it.
  'talent-thumbnail': {
    maxSide: 800,
    targetBytes: 90 * KB,
    initialQuality: 0.8,
    minQuality: 0.6,
    qualityStep: 0.05,
  },
  // Logos show at 240 px (edit tile) and 24-56 px (avatars).
  'employer-logo-thumbnail': {
    maxSide: 480,
    targetBytes: 50 * KB,
    initialQuality: 0.8,
    minQuality: 0.6,
    qualityStep: 0.05,
  },
  'employer-logo': {
    maxSide: 1200,
    targetBytes: 300 * KB,
    initialQuality: 0.84,
    minQuality: 0.62,
    qualityStep: 0.06,
  },
  'casting-role-photo': {
    maxSide: 1200,
    targetBytes: 300 * KB,
    initialQuality: 0.84,
    minQuality: 0.62,
    qualityStep: 0.06,
  },
};

const MAX_ACCEPTED_SOURCE_BYTES = 8 * MB;
const OUTPUT_MIME = 'image/webp';

const HEIC_MIME = /^image\/(heic|heif)(-sequence)?$/i;
const HEIC_EXT = /\.(heic|heif)$/i;

// HEIC/HEIF only decodes natively in Safari — every other browser (and the
// canvas re-encode pipeline below) needs it turned into a JPEG first.
export function isHeicImage(file: File): boolean {
  return HEIC_MIME.test(file.type) || (file.type === '' && HEIC_EXT.test(file.name));
}

export function isConvertibleImage(file: File): boolean {
  if (isHeicImage(file)) return true;
  return file.type.startsWith('image/') && file.type !== 'image/svg+xml';
}

async function normalizeHeic(file: File): Promise<File> {
  if (!isHeicImage(file)) return file;

  try {
    const { heicTo } = await import('heic-to');
    const jpegBlob = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.92 });
    const name = HEIC_EXT.test(file.name) ? file.name.replace(HEIC_EXT, '.jpg') : `${file.name}.jpg`;
    return new File([jpegBlob], name, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    throw new Error('validation.media_decode_failed');
  }
}

export function assertImageSourceSize(file: File) {
  if (file.size > MAX_ACCEPTED_SOURCE_BYTES) {
    throw new Error('validation.media_too_large_8mb');
  }
}

// Every upload is stored as WebP: anything that can't be converted is rejected, never uploaded as-is.
export async function optimizeImageForUpload(file: File, kind: ImageUploadKind): Promise<File> {
  if (!isConvertibleImage(file)) throw new Error('validation.type_image');

  const preset = PRESETS[kind];
  const source = await normalizeHeic(file);
  const bitmap = await readBitmap(source);

  try {
    const { width, height } = fitWithin(bitmap.width, bitmap.height, preset.maxSide);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo preparar el canvas para optimizar la imagen.');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);

    let quality = preset.initialQuality;
    let out = await encodeWebp(canvas, ctx, quality);

    while (out.size > preset.targetBytes && quality > preset.minQuality) {
      quality = Math.max(preset.minQuality, quality - preset.qualityStep);
      out = await encodeWebp(canvas, ctx, quality);
    }

    return blobToFile(out, forceWebpName(source.name));
  } finally {
    bitmap.close();
  }
}

function fitWithin(width: number, height: number, maxSide: number) {
  const largest = Math.max(width, height);
  if (largest <= maxSide) return { width, height };
  const ratio = maxSide / largest;
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

async function readBitmap(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file);
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = url;
      });
      return await createImageBitmap(image);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

let nativeWebpEncoding: boolean | undefined;

// Browsers without canvas WebP encoding (e.g. older Safari) silently return a PNG from
// toBlob('image/webp'), so the result's type is checked and the WASM encoder takes over.
async function encodeWebp(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, quality: number): Promise<Blob> {
  if (nativeWebpEncoding !== false) {
    const blob = await canvasToBlob(canvas, OUTPUT_MIME, quality);
    nativeWebpEncoding = blob.type === OUTPUT_MIME;
    if (nativeWebpEncoding) return blob;
  }

  try {
    const { default: encode } = await import('@jsquash/webp/encode');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const buffer = await encode(imageData, { quality: Math.round(quality * 100) });
    return new Blob([buffer], { type: OUTPUT_MIME });
  } catch {
    throw new Error('validation.media_decode_failed');
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo generar la imagen comprimida.'));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

function blobToFile(blob: Blob, name: string): File {
  return new File([blob], name, {
    type: OUTPUT_MIME,
    lastModified: Date.now(),
  });
}

function forceWebpName(name: string): string {
  const dot = name.lastIndexOf('.');
  if (dot <= 0) return `${name}.webp`;
  return `${name.slice(0, dot)}.webp`;
}
