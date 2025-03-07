# 金融管理系统 API

这是一个基于 Cloudflare Workers 和 D1 数据库构建的金融管理系统 API。该 API 提供了用户、交易记录、预算、发票、账户、分类和系统设置等数据的访问接口。

## API 端点

所有 API 端点都以 `/api/` 开头，并返回 JSON 格式的数据。

### 用户

```
GET /api/users
```

返回所有用户的列表，包括用户 ID、用户名、姓名、电子邮件、角色、头像、状态、创建时间和最后登录时间。

### 交易记录

```
GET /api/transactions?limit=20&offset=0
```

返回交易记录列表，包括交易 ID、交易日期、金额、类型、分类名称、账户名称、描述和状态。

查询参数：
- `limit`: 每页记录数（默认 20）
- `offset`: 偏移量（默认 0）

### 预算

```
GET /api/budgets
```

返回预算列表，包括预算 ID、名称、金额、开始日期、结束日期和分类名称。

### 发票

```
GET /api/invoices
```

返回发票列表，包括发票 ID、发票编号、金额、开具日期、到期日期、状态、描述和类型。

### 账户

```
GET /api/accounts
```

返回账户列表，包括账户 ID、名称、类型、余额、货币、状态和描述。

### 分类

```
GET /api/categories
```

返回分类列表，包括分类 ID、名称、类型和描述。

### 系统设置

```
GET /api/settings
```

返回系统设置，以键值对的形式提供所有系统设置项。

## 开发

### 本地开发

1. 克隆仓库
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`

### 部署

使用 Wrangler 部署到 Cloudflare Workers：

```bash
npm run deploy
```

## 技术栈

- Cloudflare Workers
- Cloudflare D1 数据库
- TypeScript

## CORS 支持

API 支持跨域资源共享 (CORS)，允许从任何源访问 API。

## 错误处理

所有 API 端点都会返回统一的错误格式：

```json
{
  "success": false,
  "error": "错误信息"
}
```

成功响应的格式为：

```json
{
  "success": true,
  "data": [...]
}
``` 