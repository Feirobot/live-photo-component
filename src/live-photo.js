// LivePhoto Web Component
// A standalone custom element for Apple-style Live Photos

class LivePhotoElement extends HTMLElement {
  static get observedAttributes() {
    return ['photo', 'video', 'width', 'muted'];
  }

  constructor() {
    super();
    this._isPlaying = false;
    this._longPressTimer = null;
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

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal && this.isConnected) {
      this._updateAttribute(name, newVal);
    }
  }

  get photo() { return this.getAttribute('photo') || ''; }
  set photo(val) { this.setAttribute('photo', val); }

  get video() { return this.getAttribute('video') || ''; }
  set video(val) { this.setAttribute('video', val); }

  get width() { return this.getAttribute('width') || '600'; }
  set width(val) { this.setAttribute('width', val); }

  get muted() { return this.hasAttribute('muted') && this.getAttribute('muted') !== 'false'; }
  set muted(val) {
    if (val === false || val === 'false') {
      this.removeAttribute('muted');
    } else {
      this.setAttribute('muted', 'true');
    }
  }

  _render() {
    const width = this.width;
    const muted = this.muted;

    this.innerHTML = `
      <div class="live-photo" style="max-width: ${width}px;" data-muted="${muted}">
        <div class="container">
          <div class="photo-bg"></div>
          <video playsinline preload="metadata" ${muted ? 'muted' : ''}></video>
          <div class="overlay"></div>
        </div>
        <div class="icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
          </svg>
          <span>LIVE</span>
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

    // Set video src
    video.src = this.video;

    // Set background image
    const photoUrl = this.photo;
    if (photoUrl) {
      photoBg.style.backgroundImage = `url(${photoUrl})`;

      // Detect image aspect ratio
      const tempImg = new Image();
      tempImg.onload = () => {
        el.style.aspectRatio = `${tempImg.naturalWidth} / ${tempImg.naturalHeight}`;
      };
      tempImg.src = photoUrl;
    }

    const playVideo = async () => {
      try {
        if (navigator.vibrate) navigator.vibrate(50);
        video.currentTime = 0;
        await video.play();
        el.classList.add('zoom');
        this._isPlaying = true;
      } catch (e) {
        console.log('[live-photo] Playback error:', e);
      }
    };

    const stopVideo = () => {
      el.classList.remove('zoom');
      video.pause();
      this._isPlaying = false;
    };

    // Desktop: hover on icon
    icon.addEventListener('mouseenter', () => playVideo());
    icon.addEventListener('mouseleave', () => stopVideo());

    // Mobile: long-press on overlay
    overlay.addEventListener('touchstart', () => {
      this._longPressTimer = setTimeout(() => {
        playVideo();
      }, 300);
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
      if (this._isPlaying) {
        stopVideo();
      }
    }, { passive: true });

    overlay.addEventListener('touchcancel', () => {
      if (this._longPressTimer) {
        clearTimeout(this._longPressTimer);
        this._longPressTimer = null;
      }
      stopVideo();
    }, { passive: true });

    // WeChat browser: tap icon
    const isWeixin = /MicroMessenger/i.test(navigator.userAgent);
    if (isWeixin) {
      icon.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        playVideo();
      }, { passive: true });

      icon.addEventListener('touchend', (e) => {
        e.stopPropagation();
        setTimeout(stopVideo, 2000);
      }, { passive: true });
    }

    video.addEventListener('ended', () => {
      stopVideo();
    });
  }

  _updateAttribute(name, value) {
    const el = this.querySelector('.live-photo');
    if (!el) return;

    switch (name) {
      case 'photo':
        const photoBg = el.querySelector('.photo-bg');
        if (photoBg) {
          photoBg.style.backgroundImage = `url(${value})`;
          const tempImg = new Image();
          tempImg.onload = () => {
            el.style.aspectRatio = `${tempImg.naturalWidth} / ${tempImg.naturalHeight}`;
          };
          tempImg.src = value;
        }
        break;
      case 'video':
        const video = el.querySelector('video');
        if (video) video.src = value;
        break;
      case 'width':
        el.style.maxWidth = `${value}px`;
        break;
      case 'muted':
        const vid = el.querySelector('video');
        if (vid) {
          vid.muted = value !== 'false';
          el.dataset.muted = value;
        }
        break;
    }
  }

  _cleanup() {
    if (this._longPressTimer) {
      clearTimeout(this._longPressTimer);
    }
  }
}

// Auto-register if not already defined
if (!customElements.get('live-photo')) {
  customElements.define('live-photo', LivePhotoElement);
}

// Auto-initialize existing elements
function initExisting() {
  document.querySelectorAll('live-photo:not(:defined)').forEach(el => {
    if (!el._initialized) {
      el._render();
      el._init();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExisting);
} else {
  initExisting();
}

// Observe DOM changes for dynamically added elements
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    let shouldInit = false;
    mutations.forEach((m) => {
      if (m.addedNodes && m.addedNodes.length > 0) shouldInit = true;
    });
    if (shouldInit) {
      setTimeout(initExisting, 100);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

export { LivePhotoElement };
