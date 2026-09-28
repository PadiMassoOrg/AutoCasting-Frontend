import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const encodeMock = vi.fn();

vi.mock('@jsquash/webp/encode', () => ({ default: (...args: unknown[]) => encodeMock(...args) }));

const toBlobMock = vi.fn();

const stubCanvas = () => {
  const ctx = {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ width: 10, height: 10, data: new Uint8ClampedArray(400) })),
    imageSmoothingEnabled: false,
    imageSmoothingQuality: 'low',
  };
  const canvas = { width: 0, height: 0, getContext: () => ctx, toBlob: toBlobMock };
  const originalCreateElement = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) =>
    tag === 'canvas' ? (canvas as unknown as HTMLCanvasElement) : originalCreateElement(tag)
  );
};

const nativeToBlob = (type: string) =>
  toBlobMock.mockImplementation((callback: (blob: Blob) => void) => callback(new Blob(['x'], { type })));

const loadModule = async () => {
  vi.resetModules();
  return import('./imageOptimization');
};

const jpeg = new File(['source-bytes'], 'photo.jpg', { type: 'image/jpeg' });

describe('optimizeImageForUpload', () => {
  beforeEach(() => {
    encodeMock.mockReset();
    toBlobMock.mockReset();
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async () => ({ width: 3000, height: 2000, close: vi.fn() }))
    );
    stubCanvas();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('outputs a .webp file encoded natively by the browser', async () => {
    nativeToBlob('image/webp');
    const { optimizeImageForUpload } = await loadModule();

    const result = await optimizeImageForUpload(jpeg, 'talent-photo');

    expect(result.type).toBe('image/webp');
    expect(result.name).toBe('photo.webp');
    expect(encodeMock).not.toHaveBeenCalled();
  });

  it('keeps the WebP output even when it is larger than the source', async () => {
    toBlobMock.mockImplementation((callback: (blob: Blob) => void) =>
      callback(new Blob(['a much larger webp output than the source'], { type: 'image/webp' }))
    );
    const { optimizeImageForUpload } = await loadModule();

    const result = await optimizeImageForUpload(new File(['x'], 'tiny.png', { type: 'image/png' }), 'talent-photo');

    expect(result.type).toBe('image/webp');
    expect(result.name).toBe('tiny.webp');
  });

  it('falls back to the WASM encoder when the browser returns PNG for WebP', async () => {
    nativeToBlob('image/png');
    encodeMock.mockResolvedValue(new Uint8Array([1, 2, 3]).buffer);
    const { optimizeImageForUpload } = await loadModule();

    const result = await optimizeImageForUpload(jpeg, 'employer-logo');

    expect(result.type).toBe('image/webp');
    expect(result.name).toBe('photo.webp');
    expect(encodeMock).toHaveBeenCalledWith(expect.anything(), { quality: 84 });
  });

  it('stops trying native encoding once the browser is known not to support it', async () => {
    nativeToBlob('image/png');
    encodeMock.mockResolvedValue(new Uint8Array([1]).buffer);
    const { optimizeImageForUpload } = await loadModule();

    await optimizeImageForUpload(jpeg, 'talent-photo');
    await optimizeImageForUpload(jpeg, 'talent-photo');

    expect(toBlobMock).toHaveBeenCalledTimes(1);
    expect(encodeMock).toHaveBeenCalledTimes(2);
  });

  it('rejects the upload when the WASM encoder fails instead of uploading another format', async () => {
    nativeToBlob('image/png');
    encodeMock.mockRejectedValue(new Error('wasm failed'));
    const { optimizeImageForUpload } = await loadModule();

    await expect(optimizeImageForUpload(jpeg, 'talent-photo')).rejects.toThrow('validation.media_decode_failed');
  });

  it('rejects files that cannot be converted to WebP', async () => {
    const { optimizeImageForUpload } = await loadModule();
    const svg = new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' });

    await expect(optimizeImageForUpload(svg, 'employer-logo')).rejects.toThrow('validation.type_image');
  });
});
