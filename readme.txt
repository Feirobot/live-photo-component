=== Live Photos for WordPress ===
Contributors: feirobot
Tags: live photos, motion photos, livephoto, apple live photo, iphone, gutenberg, media
Requires at least: 5.0
Tested up to: 6.6
Requires PHP: 7.4
Stable tag: 1.4.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Display Apple-style Live Photos on your WordPress site with a Gutenberg block.

== Description ==

Live Photos for WordPress renders an Apple-style Live Photo from a cover image and a video, directly in a post or page.

Features:

* Gutenberg block: choose a cover image and a video, and set the width.
* Long-press (300 ms) playback on mobile, hover playback on desktop where supported.
* Haptic feedback on playback on supported devices.
* Keeps the media behind a background image so the effect is preserved.
* Lightweight, no external services, works with media you host in WordPress.

The block plays media you host in WordPress. It does not convert or process files on a server.

== Installation ==

1. Upload the plugin folder to /wp-content/plugins/, or install it from the WordPress plugin directory.
2. Activate the plugin through the Plugins screen.
3. Edit a post, add the "Live Photos" block, and provide the cover image and video.

== Frequently Asked Questions ==

= Do I need the original iPhone Live Photo file? =
No. The block works with any cover image plus a paired video (MP4/MOV). Export the still and the video from a Live Photo and upload both.

= Does it support Android Motion Photos? =
The WordPress block plays a cover-image plus video pair. For in-browser detection of original Android Motion Photo files, see the companion JavaScript component linked below.

= Does it work with the classic editor? =
The current version focuses on the Gutenberg block.

== Screenshots ==

1. The Live Photos block in the editor.

== Changelog ==

= 1.4.1 =
* Added haptic feedback on playback (Vibration API).
* Unified desktop and mobile playback logic.

= 1.4.0 =
* Gutenberg block only; removed the shortcode.
* Background-image architecture and overlay layer.
* Long-press playback on mobile; tap-to-play via the LIVE badge in WeChat.

== Upgrade Notice ==

= 1.4.1 =
Adds haptic feedback and unified playback.

== External resources ==

* JavaScript component on npm: https://www.npmjs.com/package/live-photo-component
* Live demo and field notes: https://openfilm.cc/en/posts/live-photos-introduction-en/
