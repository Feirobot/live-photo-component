# Changelog / 更新日志

All notable changes to this project will be documented in this file. / 本项目的所有重大变更都将记录在此文件中。

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.1] - 2025-04-09

### Added / 新增
- **Haptic feedback on playback**: Uses Vibration API to trigger a 50ms short vibration when playing a Live Photo / 播放时添加震动反馈，使用 Vibration API 触发 50ms 短震动
- Tactile feedback on mobile long-press playback / 移动端长按播放时有触觉反馈
- Desktop hover playback also attempts to trigger (supported on some devices) / 桌面端悬停播放也尝试触发（部分设备支持）

### Changed / 变更
- Unified desktop and mobile playback logic / 统一桌面端和移动端播放逻辑
- Simplified code structure / 简化代码结构

### Compatibility / 兼容性
- Android: Chrome, WeChat browser both support vibration / 支持 Chrome、微信浏览器震动
- iOS: Safari iOS 13+ (requires user interaction) / 支持 Safari iOS 13+（需用户交互）
- Desktop: Some laptops with vibration motor supported / 部分带震动马达的笔记本支持

---

## [1.4.0] - 2025-04-08

### Removed / 移除
- Dropped `[live_photo]` shortcode support / 删除 `[live_photo]` 短代码支持
- Now only supports Gutenberg block insertion / 现在仅支持古腾堡区块方式插入
- Simplified content detection logic / 简化内容检测逻辑

### Changed / 变更
- **Background image architecture**: Static images now use CSS background-image to hide real media assets / 静态图片改用 CSS background-image，隐藏真实媒体资源
- **Overlay layer**: Transparent overlay handles touch events, prevents WeChat long-press menu / 透明遮罩层处理触摸事件，阻止微信长按菜单
- **Long-press playback**: Mobile long-press (300ms) plays Live Photo; scrolling is not affected / 移动端长按 300ms 播放，滑动不影响页面滚动
- **WeChat browser**: Additional tap-to-play via LIVE badge icon / 微信浏览器额外支持点击 LIVE 图标轻触播放

### Fixed / 修复
- Fixed issue where only the first Live Photo worked when multiple were present / 修复多张 Live Photo 只有第一张有效的问题
- Fixed page not scrolling on mobile swipe / 修复移动端滑动时页面不滚动的问题
- Fixed desktop playback anomaly / 修复桌面端播放异常问题

### Tested Platforms / 测试平台
- Windows (Edge / Chrome)
- Android (Chrome / WeChat)
- iOS (Safari via Sauce Labs)

---

## [1.3.0] - 2025-04-08

### Added / 新增
- Redesigned backend UI with modern card-style layout / 重构后端 UI：现代化卡片式布局设计
- Gradient backgrounds, shadows, and rounded corners / 添加渐变背景、阴影和圆角效果
- Side-by-side image and video cards / 并排显示图片和视频卡片
- Optimized settings panel layout / 优化设置面板布局
- Added emoji icons and status indicators / 添加 emoji 图标和状态提示
- Improved README documentation / 完善 README 文档

### Changed / 变更
- Removed frontend video loading warning bubble / 删除前端视频加载时的警告气泡
- Simplified error handling logic / 简化错误处理逻辑

### Documentation / 文档
- Brand new README with comprehensive guide / 全新 README 文档
- Detailed usage tutorial / 添加详细使用教程
- Shortcode documentation / 添加短代码说明
- Changelog added / 添加更新日志

---

## [1.2.0] - 2025-04-08

### Added / 新增
- Initial release / 初始版本发布
- Gutenberg block support / 古腾堡区块支持
- Responsive design / 响应式设计

---

[1.4.1]: https://github.com/Feirobot/Live-Photos-for-WordPress/releases/tag/v1.4.1
[1.4.0]: https://github.com/Feirobot/Live-Photos-for-WordPress/releases/tag/v1.4
[1.3.0]: https://github.com/Feirobot/Live-Photos-for-WordPress/releases/tag/v1.3
[1.2.0]: https://github.com/Feirobot/Live-Photos-for-WordPress/releases/tag/v1.2
