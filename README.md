# enterprise-data-hub

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

.
├── src/
│ ├── assets/
│ │ ├── fonts/ # 新建
│ │ ├── icons/ # 新建
│ │ └── images/ # 新建
│ │
│ ├── components/
│ │ ├── base/ # 新建 (用于二次封装 Element Plus 组件)
│ │ ├── common/ # 新建 (用于通用、业务无关的组件)
│ │ └── index.ts # 新建 (统一导出通用组件)
│ │
│ ├── constants/ # 新建 (用于项目常量定义)
│ │ ├── api.ts # 新建 (API 相关常量)
│ │ └── enums.ts # 新建 (枚举定义)
│ │
│ ├── layouts/ # 新建 (用于页面布局组件)
│ │ ├── MainLayout.vue # 新建
│ │ └── AuthLayout.vue # 新建 (登录/注册页面的布局)
│ │
│ ├── router/
│ │ └── routes/ # 新建 (用于模块化路由定义)
│ │
│ ├── services/ # **重命名原 api/ 目录为 services/**，并新建子文件
│ │ ├── auth.ts # 新建 (认证相关 API)
│ │ ├── user.ts # 新建 (用户管理 API)
│ │ ├── product.ts # 新建 (商品管理 API)
│ │ ├── order.ts # 新建 (订单管理 API)
│ │ ├── role.ts # 新建 (角色管理 API)
│ │ └── index.ts # 新建 (统一导出 services)
│ │
│ ├── stores/ # Pinia Store 目录 (已存在 auth.ts)
│ │ ├── auth.ts # (已存在)
│ │ ├── user.ts # 新建 (用户相关状态，如果复杂)
│ │ ├── settings.ts # 新建 (应用设置相关状态)
│ │ └── index.ts # 新建 (统一导出 Pinia store)
│ │
│ ├── utils/ # 新建 (通用工具函数)
│ │ ├── auth.ts # 新建 (权限判断工具函数)
│ │ ├── helpers.ts # 新建 (通用辅助函数)
│ │ ├── validators.ts # 新建 (表单校验工具函数)
│ │ └── request.ts # 新建 (Axios 封装，从原 api/instance.ts 迁移)
│ │
│ ├── views/ # 视图层：按业务模块细分
│ │ ├── auth/ # 新建 (认证相关页面)
│ │ ├── dashboard/ # 新建 (仪表盘页面)
│ │ ├── user-management/ # 新建 (用户管理模块页面)
│ │ ├── role-management/ # 新建 (角色管理模块页面)
│ │ ├── product-management/ # 新建 (商品管理模块页面)
│ │ ├── order-management/ # 新建 (订单管理模块页面)
│ │ ├── about/ # 新建 (关于页面)
│ │ ├── not-found/ # 新建 (404页面)
│ │ └── ... # 其他业务模块页面
│ │
│ ├── App.vue
│ └── main.ts
│
├── public/ # 新建 (存放 favicon.ico, index.html 等)
├── .env # 新建 (环境变量)
├── .env.development # 新建 (开发环境变量)
├── .env.production # 新建 (生产环境变量)
├── .eslintrc.cjs # 新建 (ESLint 配置)
├── .prettierrc.json # 新建 (Prettier 配置)
├── components.d.ts # (可能需要手动生成或配置 auto-import)
├── vite.config.ts # 新建 (如果你用的是 Vite)
└── tsconfig.json # (已存在)
