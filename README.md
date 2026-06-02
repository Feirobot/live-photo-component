# live-photo-component

Apple-style Live Photo Web Component for any website.

[![npm version](https://img.shields.io/npm/v/live-photo-component.svg)](https://www.npmjs.com/package/live-photo-component)
[![License: GPL-2.0](https://img.shields.io/badge/License-GPL%202.0-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

## Features

✨ **Zero Dependencies** — Pure vanilla JavaScript, no framework required  
🎬 **Native HTML5** — Uses `<video>` and CSS for smooth playback  
🌍 **Universal** — Works with WordPress, Hugo, Astro, React, Vue, or plain HTML  
📱 **Touch-friendly** — Long-press on mobile, hover on desktop  
💬 **WeChat Compatible** — Tap-to-play support for WeChat browser  
📳 **Haptic Feedback** — Vibration on supported devices  
📐 **Auto Aspect Ratio** — Automatically detects photo dimensions  
📐 **Responsive** — Adapts to any screen size  
♿ **Accessible** — Keyboard navigation and screen reader support  
⚡ **Autoplay** — Optional auto-play when component enters viewport  
🎯 **LIVE Icon Animation** — Rotating icon when video plays (matching Apple's Live Photos)  

## Installation

### Via npm

```bash
npm install live-photo-component
```

### Via CDN

```html
<script src="https://unpkg.com/live-photo-component/dist/live-photo.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/live-photo-component/dist/styles.css">
```

### Import as ES Module

```javascript
import 'live-photo-component';
import 'live-photo-component/dist/styles.css';
```

## Usage

### Basic

```html
<live-photo 
  photo="image.jpg" 
  video="video.mp4">
</live-photo>
```

### With Options

```html
<live-photo 
  photo="image.jpg" 
  video="video.mp4" 
  width="600" 
  muted 
  autoplay
  radius="12"
  loop>
</live-photo>
```

### JavaScript API

```javascript
const lp = document.querySelector('live-photo');

// Play
lp.play();

// Pause
lp.pause();

// Check if playing
if (lp.isPlaying()) {
  console.log('Video is playing');
}

// Listen to events
lp.addEventListener('live-photo:play', () => {
  console.log('Started playing');
});

lp.addEventListener('live-photo:pause', () => {
  console.log('Stopped playing');
});

lp.addEventListener('live-photo:ready', () => {
  console.log('Component initialized');
});
```

### Dynamic Updates

```javascript
const lp = document.querySelector('live-photo');

// Change photo
lp.photo = 'new-image.jpg';

// Change video
lp.video = 'new-video.mp4';

// Toggle mute
lp.muted = !lp.muted;
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `photo` | string | required | Cover image URL |
| `video` | string | required | Video URL |
| `width` | string | `"600"` | Max width (px or %) |
| `muted` | boolean | `true` | Mute video audio |
| `autoplay` | boolean | `false` | Auto-play on first view |
| `radius` | string | `"8"` | Border radius (px) |
| `loop` | boolean | `false` | Loop video playback |

## Events

| Event | Description |
|-------|-------------|
| `live-photo:ready` | Fired when component is initialized |
| `live-photo:play` | Fired when video starts playing |
| `live-photo:pause` | Fired when video stops |

## LIVE Icon Animation

The component features an Apple-style LIVE badge with a concentric circle icon. When the video plays:

- **Icon Rotation**: The LIVE icon rotates 360° every 5 seconds
- **Smooth Transition**: Video fades in while photo fades out
- **Visual Feedback**: Provides clear indication that the Live Photo is playing

The animation is triggered automatically when you interact with the component:
- **Desktop**: Hover over the LIVE badge
- **Mobile**: Long-press the photo

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 60+ |
| Firefox | 60+ |
| Safari | 11+ |
| Edge | 79+ |
| WeChat | All versions |
| iOS Safari | 11+ |
| Android Chrome | 60+ |

## Development

### Install dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Start demo

```bash
npm run demo
```

Then open `http://localhost:8080/demo/index.html`

## Project Structure

```
├── src/
│   ├── live-photo.js      # Web Component source
│   └── styles.css         # Component styles
├── dist/                   # Built files (auto-generated)
├── demo/
│   └── index.html         # Demo page
├── package.json
├── rollup.config.js
└── README.md
```

## License

GPL-2.0-or-later

## Author

Made with ❤️ by [Feiro](https://github.com/Feirobot)

## Related

- [Live Photos for WordPress](https://github.com/Feirobot/Live-Photos-for-WordPress) - WordPress plugin version
