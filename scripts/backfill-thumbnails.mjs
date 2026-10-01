// One-off backfill: creates the listing thumbnail (`<key>.thumb.webp`) for every talent photo and
// employer logo uploaded before thumbnails existed. Safe to re-run: photos that already have one are skipped.
//
// Usage (service role key only in the local shell, never committed):
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... SUPABASE_BUCKET=profile-media-develop \
//     node scripts/backfill-thumbnails.mjs [--dry-run] [--limit N]
//
// Keep the thumbnail settings in sync with the 'talent-thumbnail' and 'employer-logo-thumbnail' presets in
// src/app/integrations/supabase/media/lib/imageOptimization.ts and the suffix in lib/thumbnail.ts.
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const THUMBNAIL_SUFFIX = '.thumb.webp';
// Photos uploaded by the app are named `<timestamp>.<ext>`; anything else (e.g. seed data) is never shown as a thumbnail.
const UPLOADED_NAME = /^\d+\.[a-z0-9]+$/i;
const INITIAL_QUALITY = 80;
const MIN_QUALITY = 60;
const QUALITY_STEP = 5;
const TARGETS = [
  { root: 'talent', folderMarker: '/media/', maxSide: 800, targetBytes: 90 * 1024 },
  { root: 'employer', folderMarker: '/logo/', maxSide: 480, targetBytes: 50 * 1024 },
];
const PAGE_SIZE = 100;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex === -1 ? Infinity : Number(args[limitIndex + 1]);

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_BUCKET) {
  console.error('Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or SUPABASE_BUCKET.');
  process.exit(1);
}
if (!Number.isFinite(limit) && limitIndex !== -1) {
  console.error('--limit needs a number.');
  process.exit(1);
}

const storage = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
}).storage.from(SUPABASE_BUCKET);

async function listAll(prefix) {
  const entries = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await storage.list(prefix, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw error;
    entries.push(...data);
    if (data.length < PAGE_SIZE) return entries;
  }
}

// Folders come back with a null id; files have one.
const isFolder = (entry) => entry.id === null;

async function* photoFolders(prefix, folderMarker) {
  const entries = await listAll(prefix);
  const files = entries.filter((e) => !isFolder(e));
  if (files.length > 0 && prefix.includes(folderMarker)) yield { prefix, files };
  for (const folder of entries.filter(isFolder)) {
    yield* photoFolders(`${prefix}/${folder.name}`, folderMarker);
  }
}

async function buildThumbnail(input, { maxSide, targetBytes }) {
  const resized = sharp(input).rotate().resize(maxSide, maxSide, { fit: 'inside', withoutEnlargement: true });
  let quality = INITIAL_QUALITY;
  let output = await resized.clone().webp({ quality }).toBuffer();
  while (output.length > targetBytes && quality > MIN_QUALITY) {
    quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
    output = await resized.clone().webp({ quality }).toBuffer();
  }
  return output;
}

const stats = { created: 0, skipped: 0, failed: 0 };

outer: for (const target of TARGETS) {
  for await (const { prefix, files } of photoFolders(target.root, target.folderMarker)) {
    const names = new Set(files.map((f) => f.name));
    for (const file of files) {
      if (file.name.endsWith(THUMBNAIL_SUFFIX) || !UPLOADED_NAME.test(file.name)) continue;
      if (names.has(`${file.name}${THUMBNAIL_SUFFIX}`)) {
        stats.skipped++;
        continue;
      }
      if (stats.created + stats.failed >= limit) break outer;

      const key = `${prefix}/${file.name}`;
      const thumbnailKey = `${key}${THUMBNAIL_SUFFIX}`;
      try {
        if (dryRun) {
          console.log(`[dry-run] would create ${thumbnailKey}`);
        } else {
          const { data, error } = await storage.download(key);
          if (error) throw error;
          const thumbnail = await buildThumbnail(Buffer.from(await data.arrayBuffer()), target);
          const { error: uploadError } = await storage.upload(thumbnailKey, thumbnail, {
            contentType: 'image/webp',
            cacheControl: '31536000',
            upsert: false,
          });
          if (uploadError) throw uploadError;
          console.log(`created ${thumbnailKey} (${Math.round(thumbnail.length / 1024)} KB)`);
        }
        stats.created++;
      } catch (error) {
        stats.failed++;
        console.error(`failed ${key}:`, error.message ?? error);
      }
    }
  }
}

console.log(
  `${dryRun ? '[dry-run] ' : ''}created: ${stats.created}, already had one: ${stats.skipped}, failed: ${stats.failed}`
);
process.exitCode = stats.failed > 0 ? 1 : 0;
