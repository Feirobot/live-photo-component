/**
 * @openfilm/live-photo
 * Apple-style Live Photo Web Component
 * 
 * @usage
 * <live-photo
 *   photo="image.jpg"
 *   video="video.mp4"
 *   width="600"
 *   muted
 *   autoplay>
 * </live-photo>
 *
 * @attributes
 * - photo: URL of the cover image (required)
 * - video: URL of the video (required)
 * - width: Max width in pixels or percentage (default: "600")
 * - muted: Mute video audio (default: true)
 * - autoplay: Auto-play on first view (default: false)
 * - radius: Border radius in pixels (default: "8")
 * - loop: Loop video playback (default: false)
 *
 * @events
 * - live-photo:play - Fired when video starts playing
 * - live-photo:pause - Fired when video stops
 * - live-photo:ready - Fired when component is initialized
 */

class LivePhotoElement extends HTMLElement {
  static get observedAttributes() {
    return ['photo', 'video', 'width', 'muted', 'autoplay', 'radius', 'loop'];
  }

  constructor() {
    super();
    this._isPlaying = false;
    this._longPressTimer = null;
    this._initialized = false;
    this._hasAutoplayed = false;
  }

  // Property getters/setters
  get photo() { return this.getAttribute('photo') || ''; }
  set photo(val) { this.setAttribute('photo', val); }

  get video() { return this.getAttribute('video') || ''; }
  set video(val) { this.setAttribute('video', val); }

  get width() { return this.getAttribute('width') || '600'; }
  set width(val) { this.setAttribute('width', val); }

  get muted() { return this.hasAttribute('muted') && this.getAttribute('muted') !== 'false'; }
  set muted(val) {
    if (val === false || val === 'false') this.removeAttribute('muted');
    else this.setAttribute('muted', 'true');
  }

  get autoplay() { return this.hasAttribute('autoplay'); }
  set autoplay(val) {
    if (val === false || val === 'false') this.removeAttribute('autoplay');
    else this.setAttribute('autoplay', '');
  }

  get radius() { return this.getAttribute('radius') || '8'; }
  set radius(val) { this.setAttribute('radius', val); }

  get loop() { return this.hasAttribute('loop'); }
  set loop(val) {
    if (val === false || val === 'false') this.removeAttribute('loop');
    else this.setAttribute('loop', '');
  }

  connectedCallback() {
    if (!this.innerHTML.trim()) {
      this._render();
    }
    this._init();
  }

  disconnectedCallback() {
    this._cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._initialized) return;

    const el = this.querySelector('.live-photo');
    if (!el) return;

    switch (name) {
      case 'photo':
        if (newValue) this._updatePhoto(el, newValue);
        break;
      case 'video':
        if (newValue) this._updateVideo(el, newValue);
        break;
      case 'width':
        el.style.maxWidth = newValue || '600px';
        break;
      case 'muted':
        const video = el.querySelector('video');
        if (video) video.muted = this.muted;
        break;
      case 'radius':
        el.style.borderRadius = `${newValue || 8}px`;
        break;
      case 'loop':
        const video2 = el.querySelector('video');
        if (video2) video2.loop = this.loop;
        break;
    }
  }

  // Public API
  play() {
    const el = this.querySelector('.live-photo');
    if (el) this._playVideo(el);
  }

  pause() {
    const el = this.querySelector('.live-photo');
    if (el) this._stopVideo(el);
  }

  isPlaying() {
    return this._isPlaying;
  }

  _render() {
    const width = this.width;
    const muted = this.muted;
    const radius = this.radius;
    const loop = this.loop;

    this.innerHTML = `
      <div class="live-photo" 
           style="max-width: ${width}px; border-radius: ${radius}px;" 
           data-muted="${muted}">
        <div class="container">
          <div class="photo-bg"></div>
          <video 
            playsinline 
            preload="metadata" 
            ${muted ? 'muted' : ''}
            ${loop ? 'loop' : ''}></video>
          <div class="overlay"></div>
        </div>
        <div class="icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
          </svg>
          <span>LIVE</span>
        </div>
        <div class="loading">
          <div class="spinner"></div>
        </div>
      </div>
    `;
  }

  _init() {
    if (this._initialized) return;
    this._initialized = true;

    const el = this.querySelector('.live-photo');
    if (!el) return;

    const container = el.querySelector('.container');
    const icon = el.querySelector('.icon');
    const video = container.querySelector('video');
    const overlay = container.querySelector('.overlay');
    const photoBg = container.querySelector('.photo-bg');
    const loading = el.querySelector('.loading');

    // Set video source
    video.src = this.video;

    // Set photo background
    const photoUrl = this.photo;
    if (photoUrl) {
      photoBg.style.backgroundImage = `url(${photoUrl})`;
      
      // Detect aspect ratio
      const tempImg = new Image();
      tempImg.onload = () => {
        el.style.aspectRatio = `${tempImg.naturalWidth} / ${tempImg.naturalHeight}`;
        if (loading) loading.classList.add('hidden');
      };
      tempImg.onerror = () => {
        el.style.aspectRatio = '4 / 3';
        if (loading) loading.classList.add('hidden');
      };
      tempImg.src = photoUrl;
    } else {
      if (loading) loading.classList.add('hidden');
    }

    // Video events
    video.addEventListener('play', () => this._dispatchEvent('play'));
    video.addEventListener('pause', () => this._dispatchEvent('pause'));
    video.addEventListener('ended', () => this._stopVideo(el));
    video.addEventListener('error', (e) => this._handleError(e));

    // Desktop: hover on icon
    icon.addEventListener('mouseenter', () => this._playVideo(el));
    icon.addEventListener('mouseleave', () => this._stopVideo(el));

    // Mobile: long press
    overlay.addEventListener('touchstart', (e) => {
      this._longPressTimer = setTimeout(() => this._playVideo(el), 300);
    }, { passive: true });

    overlay.addEventListener('touchmove', () => {
      if (this._longPressTimer) {
        clearTimeout(this._longPressTimer);
        this._longPressTimer = null;
      }
    }, { passive: true });

    overlay.addEventListener('touchend', () => {
      if (this._longPressTimer) {
        clearTimeout(this._longPressTimer);
        this._longPressTimer = null;
      }
      if (this._isPlaying) this._stopVideo(el);
    }, { passive: true });

    overlay.addEventListener('touchcancel', () => {
      if (this._longPressTimer) {
        clearTimeout(this._longPressTimer);
        this._longPressTimer = null;
      }
      this._stopVideo(el);
    }, { passive: true });

    // WeChat browser compatibility
    const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
    if (isWeChat) {
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        this._isPlaying ? this._stopVideo(el) : this._playVideo(el);
      });
    }

    // Autoplay on first view
    if (this.autoplay && !this._hasAutoplayed) {
      this._observeVisibility(el);
    }

    // Dispatch ready event
    this._dispatchEvent('ready');
  }

  _playVideo(el) {
    const video = el.querySelector('video');
    if (!video || this._isPlaying) return;

    video.play().then(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      el.classList.add('playing');
      this._isPlaying = true;
    }).catch((err) => {
      console.warn('[live-photo] Playback failed:', err);
    });
  }

  _stopVideo(el) {
    const video = el.querySelector('video');
    if (!video) return;

    el.classList.remove('playing');
    video.pause();
    video.currentTime = 0;
    this._isPlaying = false;
  }

  _updatePhoto(el, url) {
    const photoBg = el.querySelector('.photo-bg');
    if (photoBg) {
      photoBg.style.backgroundImage = `url(${url})`;
      const tempImg = new Image();
      tempImg.onload = () => {
        el.style.aspectRatio = `${tempImg.naturalWidth} / ${tempImg.naturalHeight}`;
      };
      tempImg.src = url;
    }
  }

  _updateVideo(el, url) {
    const video = el.querySelector('video');
    if (video) {
      video.src = url;
      video.load();
    }
  }

  _observeVisibility(el) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this._hasAutoplayed) {
          this._hasAutoplayed = true;
          this._playVideo(el);
          observer.unobserve(this);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this);
  }

  _handleError(event) {
    console.error('[live-photo] Video error:', event);
    const loading = this.querySelector('.loading');
    if (loading) {
      loading.classList.add('error');
      loading.querySelector('.spinner').textContent = '⚠️';
    }
  }

  _dispatchEvent(name) {
    this.dispatchEvent(new CustomEvent(`live-photo:${name}`, {
      bubbles: true,
      composed: true,
      detail: { isPlaying: this._isPlaying }
    }));
  }

  _cleanup() {
    if (this._longPressTimer) {
      clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
    }
  }
}

// Auto-register if not already defined
if (!customElements.get('live-photo')) {
  customElements.define('live-photo', LivePhotoElement);
}

// Auto-initialize existing elements
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('live-photo').forEach(el => {
    if (!el._initialized) el._init();
  });
});

// Auto-initialize dynamically added elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        if (node.tagName === 'LIVE-PHOTO' && !node._initialized) {
          node._init();
        }
        node.querySelectorAll('live-photo').forEach(el => {
          if (!el._initialized) el._init();
        });
      }
    });
  });
});

observer.observe(document.documentElement, { childList: true, subtree: true });

export default LivePhotoElement;
