以下是一个中英双语的企业数据中台README.md设计方案，采用分段对照的格式，可直接复制使用：

````markdown
# Enterprise Data Hub / 企业数据中台

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-%23FFD859.svg?style=for-the-badge&logo=pinia&logoColor=black)

## Overview / 项目概述

Modern enterprise data management platform with user, product and order management modules.  
基于Vue 3 + TypeScript的现代化企业级数据管理平台，提供用户、产品和订单等核心业务模块管理功能。

## ✨ Features / 核心特性

- **Modular Architecture** - Feature-based code organization  
  **模块化架构** - 基于业务功能组织代码
- **Type Safety** - Full TypeScript support  
  **类型安全** - 完整的TypeScript支持
- **API Layering** - Clear service calling hierarchy  
  **API分层** - 清晰的服务调用层次
- **Dev Experience** - Vite + pnpm toolchain  
  **开发体验** - Vite + pnpm工具链

## 📁 Structure / 项目结构

```text
├── build/                      # Build configurations / 构建配置
├── src/features/               # Feature modules / 功能模块
│   ├── auth/                   # Authentication / 认证模块
│   └── product/                # Product management / 产品模块
├── src/components/             # Shared components / 公共组件
│   ├── ui/                     # Base UI components / 基础UI组件
│   └── domain/                 # Business components / 业务组件
└── tests/                      # Test cases / 测试用例
```
````

## 🚀 Quick Start / 快速开始

### Prerequisites / 环境要求

- Node.js 18+
- pnpm 8+

```bash
# Installation / 安装
pnpm install

# Development / 开发模式
pnpm dev

# Production Build / 生产构建
pnpm build
```

## 🔧 Development Guide / 开发指南

### Adding Modules / 添加模块

```text
features/
└── new-module/
    ├── api/          # API calls / API调用
    └── stores/       # Pinia stores / 状态管理
```

### API Calling / API调用规范

```typescript
// Standard API call example / 标准API调用示例
export async function getUsers() {
  return apiClient.get<User[]>('/users')
}
```

## 🤝 Contributing / 贡献指南

Please follow [Conventional Commits](https://www.conventionalcommits.org/)  
请遵循[约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/)规范

## 📄 License / 许可证

MIT © 2023 Enterprise Data Hub

---

**Maintainer / 维护者**  
[Your Name](mailto:your.email@example.com)  
[项目官网](https://example.com) (Optional)
