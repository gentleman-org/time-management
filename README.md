# 时间管理 - 四象限法则

一个基于Vue3的时间管理应用，实现了著名的艾森豪威尔四象限法则，帮助您更好地管理时间和任务优先级。

## 功能特性

### 🎯 四象限管理
- **第一象限**：重要且紧急的任务（红色）
- **第二象限**：重要但不紧急的任务（绿色）  
- **第三象限**：不重要且不紧急的任务（黄色）
- **第四象限**：不重要但紧急的任务（蓝色）

### ✨ 核心功能
- ✅ **拖拽功能**：使用 `vuedraggable` 实现任务在象限间的自由拖拽
- ✅ **智能通知**：基于截止时间的浏览器和应用内通知
- ✅ **任务管理**：添加、删除、编辑任务信息
- ✅ **本地存储**：数据自动保存到浏览器本地存储
- ✅ **优先级管理**：支持高、中、低三个优先级别
- ✅ **截止时间追踪**：实时显示任务剩余时间

### 🔔 通知系统
- **1小时前提醒**：任务即将到期提醒
- **30分钟前提醒**：紧急提醒  
- **到期提醒**：任务已过期通知
- **浏览器原生通知**：支持系统级通知（需要用户授权）

## 技术栈

- **前端框架**：Vue 3 (Composition API)
- **UI组件库**：Element Plus
- **拖拽库**：vuedraggable
- **构建工具**：Vite
- **开发语言**：TypeScript

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 使用指南

### 1. 添加任务
- 点击右上角 "添加任务" 按钮
- 填写任务名称（必填）
- 选择所在象限（必填）
- 设置截止时间（可选）
- 选择优先级（可选）

### 2. 拖拽任务
- 任务可以在同一象限内调整顺序
- 任务可以拖拽到其他象限
- 拖拽后数据自动保存

### 3. 删除任务
- 鼠标悬停在任务上会显示删除按钮
- 点击红色删除按钮确认删除

### 4. 通知设置
- 首次使用时浏览器会请求通知权限
- 建议允许通知以获得最佳体验
- 通知会在任务临近截止时间时自动触发

## 四象限法则说明

### 第一象限：重要且紧急
- **特点**：需要立即处理的重要事务
- **建议**：优先处理，但要努力减少此类任务
- **例子**：紧急会议、重要项目截止日

### 第二象限：重要但不紧急  
- **特点**：对长期目标有重要影响的事务
- **建议**：重点投入时间，这是成功的关键象限
- **例子**：学习、规划、预防性维护

### 第三象限：不重要但紧急
- **特点**：紧急但对目标贡献不大的事务
- **建议**：尽量委托他人或减少此类任务
- **例子**：某些会议、电话、邮件

### 第四象限：不重要且不紧急
- **特点**：既不重要也不紧急的事务
- **建议**：尽量避免或减少时间投入
- **例子**：闲聊、娱乐、无意义的活动

## 项目结构

```
time-management/
├── src/
│   ├── components/
│   │   ├── FourQuadrants.vue    # 四象限主组件
│   │   └── TaskItem.vue         # 任务项组件
│   ├── App.vue                  # 根组件
│   └── main.ts                  # 应用入口
├── index.html                   # HTML模板
├── vite.config.js              # Vite配置
└── package.json                # 项目配置
```

## 浏览器兼容性

- Chrome/Edge ≥ 80
- Firefox ≥ 78  
- Safari ≥ 14

## 许可证

ISC License

---

**Made with ❤️ for better time management** 