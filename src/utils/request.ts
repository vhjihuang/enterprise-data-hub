// 兼容层：请逐步迁移到 services/api-client.ts 的 apiClient/http
// 这里继续导出 axios 实例以保持现有代码可运行
import apiClient, { http } from '@/services/api-client'

export default apiClient
export { http }
