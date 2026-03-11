# 代码质量工具配置说明

本文档说明项目中使用的代码质量工具及其使用方法。

---

## 🛠️ 工具列表

- **ESLint**: JavaScript/TypeScript 代码检查
- **Prettier**: 代码格式化工具
- **Husky**: Git hooks 管理
- **lint-staged**: Git 提交前文件检查

---

## 📝 使用方法

### 1. TypeScript 类型检查

检查代码中的类型错误：

```bash
pnpm type-check
```

这会运行 `tsc --noEmit`，检查所有 TypeScript 类型错误。

### 2. ESLint 代码检查

检查代码中的潜在问题和风格问题：

```bash
pnpm lint
```

自动修复可以修复的问题：

```bash
pnpm lint:fix
```

### 3. Prettier 代码格式化

格式化所有代码文件：

```bash
pnpm format
```

检查代码格式是否符合规范：

```bash
pnpm format:check
```

### 4. 组合使用

在提交代码前，建议按以下顺序运行：

```bash
# 1. 类型检查
pnpm type-check

# 2. 代码检查和修复
pnpm lint:fix

# 3. 代码格式化
pnpm format
```

---

## 🔧 Git Hooks

项目已配置 Git hooks，会在提交代码前自动运行：

### Pre-commit Hook

每次执行 `git commit` 时，会自动：

1. 对暂存的文件运行 ESLint 并自动修复
2. 对暂存的文件运行 Prettier 并自动格式化
3. 如果有错误，会阻止提交

### 配置文件

- `.husky/pre-commit` - Git hook 脚本
- `.lintstagedrc.json` - lint-staged 配置

---

## 📋 配置文件

### ESLint 配置

文件：`.eslintrc.json`

主要规则：

- React Hooks 规则
- TypeScript 类型检查
- 代码风格一致性
- 未使用变量检测

### Prettier 配置

文件：`.prettierrc`

格式规则：

- 使用单引号
- 末尾分号
- 尾随逗号（ES5）
- 缩进：2 空格
- 行宽：80 字符

### lint-staged 配置

文件：`.lintstagedrc.json`

处理的文件类型：

- `*.{js,jsx,ts,tsx}` - ESLint + Prettier
- `*.{json,md,yml,yaml}` - Prettier
- `*.{css,scss,less}` - Prettier

---

## 🚀 快速开始

### 首次使用

1. 安装依赖：

```bash
pnpm install
```

2. Git hooks 会自动初始化（通过 `prepare` 脚本）

### 日常开发

1. 编写代码
2. 运行类型检查：

```bash
pnpm type-check
```

3. 自动格式化和修复：

```bash
pnpm lint:fix && pnpm format
```

4. 提交代码：

```bash
git add .
git commit -m "feat: 添加新功能"
```

5. Git hooks 会自动运行检查

---

## ⚠️ 常见问题

### 1. Pre-commit hook 失败

**问题**: 提交时 hook 失败

**解决方案**:

```bash
# 手动运行检查
pnpm lint:fix && pnpm format

# 添加修改的文件
git add .

# 再次提交
git commit -m "..."
```

### 2. 类型检查失败

**问题**: `pnpm type-check` 报错

**解决方案**: 修复所有类型错误后再提交

### 3. Prettier 格式不符合预期

**问题**: 代码格式与预期不符

**解决方案**: 检查 `.prettierrc` 配置，或运行：

```bash
pnpm format
```

---

## 📚 相关文档

- [代码规范文档](./docs/CODING_STANDARDS.md)
- [ESLint 文档](https://eslint.org/docs/latest/)
- [Prettier 文档](https://prettier.io/docs/en/)
- [Husky 文档](https://typicode.github.io/husky/)

---

**配置版本**: 1.0.0
**最后更新**: 2026-03-11
