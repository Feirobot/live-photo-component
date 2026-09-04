import test from 'node:test';
import assert from 'node:assert/strict';
import { detectLivePhoto, detectLivePhotos } from '../src/live-photo-detector.js';

const encoder = new TextEncoder();

function namedBlob(parts, name, type) {
  const blob = new Blob(parts, { type });
  Object.defineProperty(blob, 'name', { value: name });
  return blob;
}

function mp4Bytes(brand = 'isom') {
  return new Uint8Array([0, 0, 0, 16, ...encoder.encode('ftyp'), ...encoder.encode(brand), 0, 0, 0, 0]);
}

test('detects an Android Motion Photo with an appended MP4', async () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, ...encoder.encode('Camera:MotionPhoto="1"'), 0xff, 0xd9]);
  const file = namedBlob([jpeg, mp4Bytes()], 'PXL_001.MP.jpg', 'image/jpeg');
  const result = await detectLivePhoto(file);

  assert.equal(result.protocol, 'google-motion-photo');
  assert.equal(result.match, 'embedded-video');
  assert.equal(result.video.size, 16);
  assert.equal(result.photo.size, jpeg.length);
});

test('pairs Apple image and video by ContentIdentifier', async () => {
  const id = '123e4567-e89b-42d3-a456-426614174000';
  const photo = namedBlob([
    new Uint8Array([0xff, 0xd8, 0xff]),
    encoder.encode(`apple-fi:ContentIdentifier="${id}"`)
  ], 'renamed-photo.jpg', 'image/jpeg');
  const video = namedBlob([
    mp4Bytes('qt  '),
    encoder.encode(`com.apple.quicktime.content.identifier ${id}`)
  ], 'different-name.mov', 'video/quicktime');

  const result = await detectLivePhoto([photo, video]);
  assert.equal(result.protocol, 'apple-live-photo');
  assert.equal(result.match, 'content-identifier');
  assert.equal(result.confidence, 'high');
});

test('pairs conventional Apple exports by filename', async () => {
  const photo = namedBlob([new Uint8Array([0xff, 0xd8, 0xff, 0xff, 0xd9])], 'IMG_0001.HEIC', 'image/heic');
  const video = namedBlob([mp4Bytes('qt  ')], 'IMG_0001.MOV', 'video/quicktime');
  const results = await detectLivePhotos([photo, video]);

  assert.equal(results.length, 1);
  assert.equal(results[0].match, 'filename');
});

test('does not label a normal image as a Live Photo', async () => {
  const photo = namedBlob([new Uint8Array([0xff, 0xd8, 0xff, 0xff, 0xd9])], 'still.jpg', 'image/jpeg');
  await assert.rejects(() => detectLivePhoto(photo), { code: 'LIVE_PHOTO_NOT_DETECTED' });
});

test('rejects files with conflicting Apple identifiers', async () => {
  const firstId = '123e4567-e89b-42d3-a456-426614174000';
  const secondId = '223e4567-e89b-42d3-a456-426614174000';
  const photo = namedBlob([
    new Uint8Array([0xff, 0xd8, 0xff]),
    encoder.encode(`ContentIdentifier="${firstId}"`)
  ], 'IMG_0002.jpg', 'image/jpeg');
  const video = namedBlob([
    mp4Bytes('qt  '),
    encoder.encode(`content.identifier ${secondId}`)
  ], 'IMG_0002.mov', 'video/quicktime');

  await assert.rejects(() => detectLivePhoto([photo, video]), { code: 'LIVE_PHOTO_NOT_DETECTED' });
});
