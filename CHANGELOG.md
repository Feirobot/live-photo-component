# Changelog / 更新日志

All notable changes to this project will be documented in this file. / 本项目的所有重大变更都将记录在此文件中。

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.2] - 2026-09-04

### Changed / 调整
- Made the npm README a direct two-version download guide: `1.0.0` for existing image + video URLs, `1.1.2` for browser-side Android and Apple Live Photo recognition / README 改为直接的双版本下载指引：`1.0.0` 用于已有图片+视频地址，`1.1.2` 用于浏览器识别 Android 与 Apple 原生实况照片

---

## [1.1.1] - 2026-09-04

### Changed / 调整
- Reworked the README with a clear `1.0.0` manual-workflow versus `1.1.x` native-recognition guide / 重写 README，清晰说明 `1.0.0` 手动图片+视频流程与 `1.1.x` 原生识别流程的差异
- Documented the maintained native, manual, and WordPress branches / 说明原生识别、手动图片+视频与 WordPress 三条维护分支

---

## [1.1.0] - 2026-09-04

### Added / 新增
- Native browser-side recognition for Apple image + video Live Photo pairs / 原生识别 Apple 图片与视频双文件实况照片
- Native extraction of Android and vendor single-file Motion Photos / 原生识别并提取 Android 及厂商单文件动态照片
- `LivePhotoElement.detect()`, `detectAll()` and `load()` APIs / 新增识别、批量识别与直接加载 API
- Detection metadata for protocol, confidence, pairing method, and Apple Content Identifier / 返回协议、置信度、配对方式及 Apple 标识信息

### Fixed / 修复
- Android playback reliability with true muted-by-default behavior and a direct LIVE badge tap fallback / 默认静音并支持点击 LIVE 徽章，提升 Android 播放可靠性
- Empty components no longer attempt to load the current page as a video / 空组件不再把当前页面误作视频加载
- Playback and media loading failures now emit actionable `live-photo:error` codes / 播放与媒体加载失败提供明确错误码

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

[1.1.2]: https://github.com/Feirobot/live-photo-component/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Feirobot/live-photo-component/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Feirobot/live-photo-component/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Feirobot/live-photo-component/releases/tag/v1.0.0
