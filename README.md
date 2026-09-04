# live-photo-component

**A small Web Component for playing and recognizing Live Photos.**

`live-photo-component` renders an Apple-style Live Photo from a cover image and
video, then adds browser-side detection for original files:

- Android and vendor Motion Photos stored as one file
- Apple Live Photos exported as an image plus a paired MOV/MP4
- Conventional image/video pairs with matching file names

It has no runtime dependencies, works with plain HTML or any framework, and
keeps detection and video extraction in the browser.

> 中文：一个零运行时依赖的实况照片 Web Component。支持播放现有图片 +
> 视频，也支持在浏览器中识别安卓单文件动态照片与 Apple 双文件实况照片。

![Live Photo preview](demo.gif)

## What it does

| Use case | Result |
| --- | --- |
| Existing `photo` + `video` URLs | Renders an interactive `<live-photo>` element |
| Android Motion Photo | Extracts the cover and embedded MP4/MOV locally |
| Apple image + MOV/MP4 | Pairs files using `ContentIdentifier`, then filename as a fallback |
| Multiple source files | Finds every complete Live Photo with `detectAll()` |
| Touch devices | Long-press to play; tap the LIVE badge when long-press is unreliable |

Desktop users can hover the LIVE badge. Video is muted by default, uses
`playsinline`, and the component emits explicit events when detection or
playback fails.

## Install

The native-detection work currently lives on the `feature/native-live-photo-detection`
branch. Install that branch to use the APIs documented below:

```bash
npm install github:Feirobot/live-photo-component#feature/native-live-photo-detection
```

Then import the element and its stylesheet:

```js
import 'live-photo-component';
import 'live-photo-component/styles.css';
```

The released npm package is also available as
[`live-photo-component`](https://www.npmjs.com/package/live-photo-component),
but it does not yet include the native-detection branch.

## Play a Live Photo

```html
<live-photo
  photo="/images/cover.jpg"
  video="/videos/moment.mp4"
  width="720"
  radius="12"
  muted>
</live-photo>
```

| Attribute | Default | Description |
| --- | --- | --- |
| `photo` | — | Cover image URL |
| `video` | — | Video URL |
| `width` | `600` | Maximum width; numbers are pixels and CSS lengths also work |
| `muted` | `true` | Mutes the video unless set to `"false"` |
| `autoplay` | `false` | Plays once after the element enters the viewport |
| `radius` | `8` | Corner radius in pixels |
| `loop` | `false` | Loops playback instead of returning to the cover |

```js
const livePhoto = document.querySelector('live-photo');

livePhoto.play();
livePhoto.pause();
console.log(livePhoto.isPlaying());

livePhoto.addEventListener('live-photo:error', ({ detail }) => {
  console.error(detail.code, detail.error);
});
```

## Recognize original files

Use one multiple-file picker. An Android Motion Photo normally needs only one
selected file; an Apple export normally needs both the image and its paired
MOV/MP4 selected together.

```html
<input id="live-input" type="file" multiple
  accept="image/jpeg,image/heic,image/heif,image/avif,video/mp4,video/quicktime,.mov,.heic,.heif,.avif">

<live-photo id="preview" width="720" muted></live-photo>

<script type="module">
  import 'live-photo-component';
  import 'live-photo-component/styles.css';

  const input = document.querySelector('#live-input');
  const preview = document.querySelector('#preview');

  input.addEventListener('change', async () => {
    try {
      const result = await preview.load(input.files);
      console.log(result.protocol, result.confidence, result.match);
    } catch (error) {
      console.error(error.code, error.message);
    }
  });
</script>
```

`load()` detects exactly one Live Photo, assigns temporary object URLs to the
element, and revokes its previous URLs when a new selection is loaded.

For a batch picker, import the class and inspect results without changing a
preview element:

```js
import LivePhotoElement from 'live-photo-component';

const results = await LivePhotoElement.detectAll(fileInput.files);
for (const result of results) {
  console.log(result.protocol, result.photo, result.video);
}
```

### Detection result

```js
{
  kind: 'live-photo',
  protocol: 'google-motion-photo', // or apple-live-photo, samsung-motion-photo…
  photo: Blob,
  video: Blob,
  confidence: 'high',              // high | medium | low
  match: 'embedded-video',         // content-identifier | filename | only-pair
  contentIdentifier: '...',
  sourceFiles: [File]
}
```

## Detection support and limits

| Source format | Detection | Notes |
| --- | --- | --- |
| Google / Android Motion Photo | Yes | Reads the video embedded in the original image file |
| Samsung, HUAWEI, OPPO variants | Yes | Detected from their embedded media and metadata markers |
| Apple HEIC/JPG + MOV | Yes | Prefers a shared `ContentIdentifier` |
| Apple exports renamed after transfer | Usually | Falls back to matching base names |
| A single flattened iOS still image | No | The paired video is absent and cannot be recovered |

Detection is not transcoding. Original Apple HEIC and HEVC/MOV media may not
decode in Chrome on Windows or Android. For a universal published preview,
retain the originals if you need them, but generate a JPEG/WebP cover and an
H.264 MP4 playback derivative on your server.

## Events

| Event | When it fires |
| --- | --- |
| `live-photo:ready` | The element has initialized |
| `live-photo:play` | Video playback starts |
| `live-photo:pause` | Video playback stops |
| `live-photo:detected` | `load()` successfully recognizes a Live Photo |
| `live-photo:error` | Detection, video loading, or playback fails |

`live-photo:error` includes an actionable `detail.code`, such as
`LIVE_PHOTO_NOT_DETECTED`, `PLAYBACK_FAILED`, or `VIDEO_LOAD_FAILED`.

## Frameworks

The component is a standard Custom Element. Import it once in your client
entry point, then use `<live-photo>` in React, Vue, Astro, WordPress, Hugo, or
plain HTML.

```jsx
import 'live-photo-component';
import 'live-photo-component/styles.css';

export function Moment({ photo, video }) {
  return <live-photo photo={photo} video={video} width="100%" muted="true" />;
}
```

For server-rendered React frameworks, import the package only from a client
component or client-side entry point.

## Development

```bash
npm install
npm test
npm run build
npm run demo
```

The demo is served at `http://localhost:3000` by default.

## Project layout

```text
src/
  live-photo.js            Custom Element and public API
  live-photo-detector.js   Apple and Android file recognition
  styles.css               Component styles
test/
  live-photo-detector.test.js
demo/
  index.html
```

## Links

- [GitHub repository](https://github.com/Feirobot/live-photo-component)
- [Chinese introduction](https://openfilm.cc/zh/posts/live-photos-introduction-zh/)
- [English introduction](https://openfilm.cc/en/posts/live-photos-introduction-en/)
- [Changelog](CHANGELOG.md)

## License

[GPL-2.0-or-later](LICENSE)
