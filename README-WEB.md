# @openfilm/live-photo

> A Web Component that brings Apple-style Live Photos to any website. Zero dependencies, native HTML5.

## Features

- **Zero dependencies** — Pure vanilla JS, no framework required
- **Native HTML5** — Uses `<video>` and CSS for smooth playback
- **Universal** — Works with WordPress, Hugo, Astro, React, Vue, or plain HTML
- **Touch-friendly** — Long-press on mobile, hover on desktop
- **WeChat compatible** — Tap-to-play support for WeChat browser
- **Haptic feedback** — Vibration on supported devices
- **Auto aspect ratio** — Automatically detects photo dimensions
- **Responsive** — Adapts to any screen size

## Installation

### Via npm

```bash
npm install @openfilm/live-photo
```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@openfilm/live-photo/dist/live-photo.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@openfilm/live-photo/dist/styles.css">
```

## Usage

### Basic Usage

```html
<live-photo
  photo="https://example.com/photo.jpg"
  video="https://example.com/video.mp4"
  width="600"
  muted>
</live-photo>
```

### With JavaScript

```javascript
import '@openfilm/live-photo';
import '@openfilm/live-photo/styles.css';

// Or dynamically create
const lp = document.createElement('live-photo');
lp.photo = 'photo.jpg';
lp.video = 'video.mp4';
lp.width = 800;
lp.muted = true;
document.body.appendChild(lp);
```

### React

```jsx
import { useEffect } from 'react';
import '@openfilm/live-photo/styles.css';

function LivePhoto({ photo, video, width, muted }) {
  useEffect(() => {
    import('@openfilm/live-photo');
  }, []);

  return (
    <live-photo
      photo={photo}
      video={video}
      width={width}
      muted={muted ? 'true' : 'false'}
    />
  );
}
```

### Vue

```vue
<script setup>
import { onMounted } from 'vue';
import '@openfilm/live-photo/styles.css';

onMounted(() => {
  import('@openfilm/live-photo');
});

defineProps({
  photo: String,
  video: String,
  width: { type: [Number, String], default: 600 },
  muted: { type: Boolean, default: true }
});
</script>

<template>
  <live-photo
    :photo="photo"
    :video="video"
    :width="width"
    :muted="muted ? 'true' : 'false'"
  />
</template>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `photo` | string | required | URL of the static photo |
| `video` | string | required | URL of the motion video |
| `width` | number | `600` | Maximum width in pixels |
| `muted` | boolean | `true` | Whether to mute the video |

## API

### Properties

```javascript
const el = document.querySelector('live-photo');

el.photo = 'new-photo.jpg';
el.video = 'new-video.mp4';
el.width = 800;
el.muted = false;
```

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| WeChat | ✅ Full |
| iOS Safari | ✅ Full (requires `playsinline`) |

## How It Works

The component uses a layered architecture:

1. **Video layer** (bottom) — Hidden by default, plays on interaction
2. **Photo layer** (middle) — Static image shown by default
3. **Overlay** (top) — Captures touch events, prevents unwanted menus
4. **LIVE badge** — Interaction trigger point

When triggered, the photo fades out and video fades in with a 1s transition.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Serve demo
npm run demo
```

## License

GPL-2.0-or-later

## Credits

Originally developed for [Live Photos for WordPress](https://github.com/Feirobot/Live-Photos-for-WordPress) and extracted into a standalone Web Component.

---

Made with ❤️ by [Feiro](https://github.com/Feirobot)
