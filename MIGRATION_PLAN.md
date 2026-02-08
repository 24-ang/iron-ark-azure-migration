# Azure OpenAI 迁移计划

## ⏰ 执行时间：2026年2月10日比赛开始后

---

## 📋 迁移前准备（今晚完成）

### 1. 申请 Azure OpenAI 服务

- [ ] 访问 Azure Portal: https://portal.azure.com
- [ ] 创建 Azure OpenAI 资源
- [ ] 等待审批（可能需要几小时）
- [ ] 记录以下信息：
  - Endpoint URL
  - API Key
  - Deployment Name

### 2. 学习 Azure OpenAI API

**关键差异：**

```javascript
// Gemini API
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Azure OpenAI API
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
```

---

## 🔄 迁移步骤（比赛期间执行）

### Step 1: 创建新分支（比赛开始后）

```bash
git checkout -b azure-migration
git push -u origin azure-migration
```

### Step 2: 安装 Azure OpenAI SDK

```bash
npm install @azure/openai
```

### Step 3: 更新环境变量

**文件：** `.env.local`

```env
# 旧的 Gemini 配置（注释掉）
# VITE_GEMINI_API_KEY=xxx

# 新的 Azure 配置
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
VITE_AZURE_OPENAI_KEY=your_key_here
VITE_AZURE_DEPLOYMENT_NAME=gpt-4o
```

### Step 4: 修改 API 调用代码

#### 需要修改的文件清单：

- [ ] `utils/geminiService.ts` → `utils/azureOpenAIService.ts`
- [ ] `hooks/useAI.ts`
- [ ] `components/game/center/GameInput.tsx`
- [ ] 其他调用 AI 的组件

#### 代码对照表：

**Gemini API (旧):**

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent(prompt);
const response = result.response.text();
```

**Azure OpenAI API (新):**

```typescript
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const client = new OpenAIClient(
  import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(import.meta.env.VITE_AZURE_OPENAI_KEY),
);

const result = await client.getChatCompletions(
  import.meta.env.VITE_AZURE_DEPLOYMENT_NAME,
  [{ role: "user", content: prompt }],
);
const response = result.choices[0].message.content;
```

### Step 5: 更新 README.md

**修改技术栈部分：**

```markdown
## 🛠️ Tech Stack

- **Core AI**: Microsoft Azure OpenAI Service (GPT-4o)
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Migration**: From Gemini API to Azure OpenAI
```

**添加迁移说明：**

```markdown
## 🔄 Migration Story

This project was originally built with Gemini API and migrated to Azure OpenAI
during the Microsoft Azure Hackathon 2026. The migration demonstrates:

- Adapting AI integration from one platform to another
- Maintaining functionality while switching providers
- Leveraging Azure's enterprise-grade infrastructure
```

### Step 6: 测试和调试

- [ ] 测试所有 AI 功能
- [ ] 确保游戏逻辑正常
- [ ] 检查错误处理
- [ ] 验证响应质量

### Step 7: 提交代码

```bash
# 每完成一个功能就提交一次
git add .
git commit -m "Migrate API calls to Azure OpenAI"
git push

# 最后合并到 main
git checkout main
git merge azure-migration
git push
```

---

## 📝 迁移记录模板

**在比赛期间记录：**

### 迁移日志

- **开始时间：** 2026-02-10 08:00
- **完成时间：**
- **遇到的问题：**
  1.
  2.
- **解决方案：**
  1.
  2.

### Git 提交记录建议

```
feat: Install Azure OpenAI SDK
feat: Create Azure OpenAI service adapter
feat: Migrate AI calls from Gemini to Azure
fix: Update error handling for Azure API
docs: Update README with Azure migration info
test: Verify all AI features with Azure
```

---

## ⚠️ 注意事项

1. **保留 Gemini 分支**
   - 创建 `gemini-backup` 分支保存原始代码
   - 方便对比和回退

2. **API 配额管理**
   - Azure OpenAI 有请求限制
   - 注意 rate limiting

3. **错误处理**
   - Azure API 错误格式可能不同
   - 更新错误处理逻辑

4. **性能对比**
   - 记录响应时间
   - 对比 Gemini vs Azure 的表现

---

## 🎯 比赛提交要点

**强调以下内容：**

1. **迁移价值**
   - 展示从一个 AI 平台迁移到另一个的能力
   - 证明代码的可移植性

2. **Azure 优势**
   - 企业级稳定性
   - 更好的集成生态
   - 符合微软技术栈

3. **技术深度**
   - API 适配层设计
   - 错误处理和重试机制
   - 性能优化

---

## 📚 参考资源

- [Azure OpenAI 官方文档](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Azure OpenAI SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai)
- [从其他 AI 服务迁移指南](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/migration)

---

**准备好了吗？明天比赛开始后，按照这个计划执行！** 🚀
