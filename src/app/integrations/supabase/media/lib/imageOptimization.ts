const KB = 1024;
const MB = 1024 * KB;

type Preset = {
  maxSide: number;
  targetBytes: number;
  initialQuality: number;
  minQuality: number;
  qualityStep: number;
};

type ImageUploadKind = 'talent-photo' | 'employer-logo';

const PRESETS: Record<ImageUploadKind, Preset> = {
  'talent-photo': {
    maxSide: 1600,
    targetBytes: 450 * KB,
    initialQuality: 0.82,
    minQuality: 0.58,
    qualityStep: 0.06,
  },
  'employer-logo': {
    maxSide: 1200,
    targetBytes: 300 * KB,
    initialQuality: 0.84,
    minQuality: 0.62,
    qualityStep: 0.06,
  },
};

const MAX_ACCEPTED_SOURCE_BYTES = 8 * MB;
const OUTPUT_MIME = 'image/webp';

export function isCompressibleImage(file: File): boolean {
  return file.type.startsWith('image/') && file.type !== 'image/svg+xml';
}

export function assertImageSourceSize(file: File) {
  if (file.size > MAX_ACCEPTED_SOURCE_BYTES) {
    throw new Error('validation.media_too_large_8mb');
  }
}

export async function optimizeImageForUpload(file: File, kind: ImageUploadKind): Promise<File> {
  if (!isCompressibleImage(file)) return file;

  const preset = PRESETS[kind];
  const bitmap = await readBitmap(file);

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
    let out = await canvasToBlob(canvas, OUTPUT_MIME, quality);

    while (out.size > preset.targetBytes && quality > preset.minQuality) {
      quality = Math.max(preset.minQuality, quality - preset.qualityStep);
      out = await canvasToBlob(canvas, OUTPUT_MIME, quality);
    }

    const optimizedFile = blobToFile(out, forceWebpName(file.name));
    return optimizedFile.size <= file.size ? optimizedFile : file;
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
    type: blob.type || OUTPUT_MIME,
    lastModified: Date.now(),
  });
}

function forceWebpName(name: string): string {
  const dot = name.lastIndexOf('.');
  if (dot <= 0) return `${name}.webp`;
  return `${name.slice(0, dot)}.webp`;
}
