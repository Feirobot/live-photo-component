const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'heic', 'heif', 'avif']);
const VIDEO_EXTENSIONS = new Set(['mov', 'mp4', 'm4v']);

export class LivePhotoDetectionError extends Error {
  constructor(message, code = 'LIVE_PHOTO_NOT_DETECTED') {
    super(message);
    this.name = 'LivePhotoDetectionError';
    this.code = code;
  }
}

function extensionOf(file) {
  const name = file?.name || '';
  const dot = name.lastIndexOf('.');
  return dot < 0 ? '' : name.slice(dot + 1).toLowerCase();
}

function baseNameOf(file) {
  const name = (file?.name || '').replace(/\.[^.]+$/, '');
  return name
    .toLowerCase()
    .replace(/^img_e(?=\d)/, 'img_')
    .replace(/[-_ ]?(live|motion|photo|video|vid)$/i, '')
    .replace(/[^a-z0-9]+/g, '');
}

function normalizeInput(input) {
  if (!input) return [];
  if (typeof FileList !== 'undefined' && input instanceof FileList) return [...input];
  if (Array.isArray(input)) return input.flatMap(normalizeInput);
  if (typeof input[Symbol.iterator] === 'function' && !(input instanceof Blob)) return [...input];
  if (input instanceof Blob) return [input];
  throw new TypeError('Expected a File, Blob, FileList, or iterable of files.');
}

function ascii(bytes, start = 0, end = bytes.length) {
  return new TextDecoder('latin1').decode(bytes.subarray(start, end));
}

function isImage(file, head) {
  const ext = extensionOf(file);
  if (file.type?.startsWith('image/') || IMAGE_EXTENSIONS.has(ext)) return true;
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return true;
  const brand = ascii(head, 4, 12).toLowerCase();
  return brand.includes('ftyp') && /(heic|heix|hevc|hevx|mif1|avif)/.test(ascii(head, 8, 32).toLowerCase());
}

function isVideo(file, head) {
  const ext = extensionOf(file);
  if (file.type?.startsWith('video/') || VIDEO_EXTENSIONS.has(ext)) return true;
  return ascii(head, 4, 8) === 'ftyp' && !isImage(file, head);
}

function readUint32(bytes, offset) {
  if (offset < 0 || offset + 4 > bytes.length) return 0;
  return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
}

function findEmbeddedVideo(bytes) {
  // ISO BMFF video begins with a size field followed by an `ftyp` box. Search
  // backwards so an HEIC file's own leading `ftyp` box is never mistaken for
  // the appended Motion Photo video.
  for (let i = bytes.length - 4; i >= 12; i -= 1) {
    if (bytes[i] !== 0x66 || bytes[i + 1] !== 0x74 || bytes[i + 2] !== 0x79 || bytes[i + 3] !== 0x70) continue;
    const start = i - 4;
    const boxSize = readUint32(bytes, start);
    if (boxSize >= 8 && start + boxSize <= bytes.length) return start;
  }
  return -1;
}

function detectMotionProtocol(bytes, videoOffset) {
  const leadingMetadata = ascii(bytes, 0, Math.min(videoOffset, 1024 * 1024));
  const trailerMetadata = ascii(bytes, Math.max(0, videoOffset - 64 * 1024), videoOffset);
  const metadata = `${leadingMetadata}\n${trailerMetadata}`.toLowerCase();
  if (metadata.includes('motionphoto') || metadata.includes('gcontainer:directory')) return 'google-motion-photo';
  if (metadata.includes('microvideo')) return 'google-micro-video';
  if (metadata.includes('samsung') || metadata.includes('motionphoto_data')) return 'samsung-motion-photo';
  if (metadata.includes('huawei')) return 'huawei-moving-photo';
  if (metadata.includes('oppo') || metadata.includes('o-live')) return 'oppo-live-photo';
  return 'embedded-motion-photo';
}

function findExplicitContentIdentifier(bytes) {
  const text = ascii(bytes).replace(/\0/g, '');
  const lower = text.toLowerCase();
  const markers = [
    'contentidentifier',
    'content.identifier',
    'assetidentifier',
    'asset.identifier'
  ];

  for (const marker of markers) {
    let from = 0;
    while ((from = lower.indexOf(marker, from)) !== -1) {
      const nearby = text.slice(from, from + 512);
      const uuid = nearby.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
      if (uuid) return uuid[0].toLowerCase();
      from += marker.length;
    }
  }
  return null;
}

function findContentIdentifiers(bytes) {
  const text = ascii(bytes).replace(/\0/g, '');
  const explicit = findExplicitContentIdentifier(bytes);
  const identifiers = new Set(explicit ? [explicit] : []);
  for (const match of text.matchAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi)) {
    identifiers.add(match[0].toLowerCase());
  }
  return { explicit, all: [...identifiers] };
}

async function inspect(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const head = bytes.subarray(0, Math.min(bytes.length, 64));
  const kind = isImage(file, head) ? 'image' : isVideo(file, head) ? 'video' : 'unknown';
  const identifiers = findContentIdentifiers(bytes);
  return {
    file,
    bytes,
    kind,
    baseName: baseNameOf(file),
    contentIdentifier: identifiers.explicit,
    contentIdentifiers: identifiers.all
  };
}

function sharedIdentifier(first, second) {
  return first.contentIdentifiers.find(identifier => second.contentIdentifiers.includes(identifier)) || null;
}

function pairResult(image, video, match, identifier = null) {
  return {
    kind: 'live-photo',
    protocol: 'apple-live-photo',
    photo: image.file,
    video: video.file,
    confidence: match === 'content-identifier' ? 'high' : match === 'filename' ? 'medium' : 'low',
    match,
    contentIdentifier: identifier || image.contentIdentifier || video.contentIdentifier || null,
    sourceFiles: [image.file, video.file]
  };
}

function identifiersConflict(image, video) {
  return Boolean(
    image.contentIdentifier &&
    video.contentIdentifier &&
    image.contentIdentifier !== video.contentIdentifier
  );
}

export async function detectLivePhotos(input) {
  const files = normalizeInput(input);
  if (!files.length) throw new LivePhotoDetectionError('No files were provided.', 'NO_FILES');

  const inspected = await Promise.all(files.map(inspect));
  const images = inspected.filter(item => item.kind === 'image');
  const videos = inspected.filter(item => item.kind === 'video');
  const results = [];
  const usedImages = new Set();
  const usedVideos = new Set();

  // Android and vendor Motion Photos keep a playable ISO BMFF video appended
  // to the still image. Return slices so callers can preview without uploading.
  for (const image of images) {
    const videoOffset = findEmbeddedVideo(image.bytes);
    if (videoOffset < 0) continue;
    const videoType = ascii(image.bytes, videoOffset + 8, videoOffset + 12) === 'qt  '
      ? 'video/quicktime'
      : 'video/mp4';
    results.push({
      kind: 'live-photo',
      protocol: detectMotionProtocol(image.bytes, videoOffset),
      photo: image.file.slice(0, videoOffset, image.file.type || 'image/jpeg'),
      video: image.file.slice(videoOffset, image.file.size, videoType),
      confidence: 'high',
      match: 'embedded-video',
      contentIdentifier: image.contentIdentifier,
      sourceFiles: [image.file]
    });
    usedImages.add(image);
  }

  // Prefer Apple's shared identifier. It remains stable even after renaming.
  for (const image of images) {
    if (usedImages.has(image) || !image.contentIdentifiers.length) continue;
    const video = videos.find(item => !usedVideos.has(item) && sharedIdentifier(image, item));
    if (!video) continue;
    results.push(pairResult(image, video, 'content-identifier', sharedIdentifier(image, video)));
    usedImages.add(image);
    usedVideos.add(video);
  }

  // Fall back to the conventional matching basename used by camera exports.
  for (const image of images) {
    if (usedImages.has(image) || !image.baseName) continue;
    const video = videos.find(item =>
      !usedVideos.has(item) &&
      item.baseName === image.baseName &&
      !identifiersConflict(image, item)
    );
    if (!video) continue;
    results.push(pairResult(image, video, 'filename'));
    usedImages.add(image);
    usedVideos.add(video);
  }

  // A single image + video selection is useful on iOS/Windows even when the
  // browser stripped metadata. Be explicit that this is only a low-confidence pair.
  const remainingImages = images.filter(item => !usedImages.has(item));
  const remainingVideos = videos.filter(item => !usedVideos.has(item));
  if (
    remainingImages.length === 1 &&
    remainingVideos.length === 1 &&
    !identifiersConflict(remainingImages[0], remainingVideos[0])
  ) {
    results.push(pairResult(remainingImages[0], remainingVideos[0], 'only-pair'));
  }

  return results;
}

export async function detectLivePhoto(input) {
  const results = await detectLivePhotos(input);
  if (!results.length) {
    throw new LivePhotoDetectionError(
      'No complete Live Photo was detected. Apple Live Photos require both the image and paired video.',
      'LIVE_PHOTO_NOT_DETECTED'
    );
  }
  if (results.length > 1) {
    throw new LivePhotoDetectionError(
      'Multiple Live Photos were detected. Use detectLivePhotos() for batch input.',
      'MULTIPLE_LIVE_PHOTOS'
    );
  }
  return results[0];
}
