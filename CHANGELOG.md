# Changelog / 更新日志

All notable changes to this project will be documented in this file. / 本项目的所有重大变更都将记录在此文件中。

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-09-04

### Added / 新增
- Native browser-side recognition for Apple image + video Live Photo pairs / 原生识别 Apple 图片与视频双文件实况照片
- Native extraction of Android and vendor single-file Motion Photos / 原生识别并提取 Android 及厂商单文件动态照片
- `LivePhotoElement.detect()`, `detectAll()` and `load()` APIs / 新增识别、批量识别与直接加载 API
- Detection metadata for protocol, confidence, pairing method, and Apple Content Identifier / 返回协议、置信度、配对方式及 Apple 标识信息

---

## [1.0.0] - 2026-04-08

### Added / 新增
- Initial release of `live-photo-component` / `live-photo-component` 首个正式版本
- Apple-style Live Photo Web Component with zero dependencies / 零依赖的 Apple 风格实况照片 Web 组件
- `photo` + `video` attributes, hover (desktop) and long-press (mobile) playback / 支持 photo/video 属性，桌面悬停、移动端长按播放
- LIVE badge with rotating icon animation / LIVE 徽章旋转图标动画
- Options: `width`, `muted`, `autoplay`, `radius`, `loop` / 可选属性：width、muted、autoplay、radius、loop
- JavaScript API: `play()`, `pause()`, `isPlaying()` and custom events / 提供 play()、pause()、isPlaying() API 与自定义事件
- Haptic feedback on supported devices / 支持设备上的震动反馈
- UMD + ES Module builds via Rollup / 通过 Rollup 输出 UMD 与 ES Module 两种产物

---

[1.1.0]: https://github.com/Feirobot/live-photo-component/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Feirobot/live-photo-component/releases/tag/v1.0.0
