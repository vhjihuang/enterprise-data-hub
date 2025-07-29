// src/utils/helpers.ts
import dayjs from 'dayjs' // 如果你使用 dayjs
import 'dayjs/locale/zh-cn' // 导入中文语言包

dayjs.locale('zh-cn') // 设置默认语言为中文

/**
 * 格式化日期。
 * @param date 日期对象或日期字符串。
 * @param format 格式字符串，如 'YYYY-MM-DD HH:mm:ss'。
 */
export function formatDateTime(
  date: string | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  return dayjs(date).format(format)
}

/**
 * 将数字转换为货币格式。
 * @param amount 金额。
 * @param currency 货币符号，如 '¥'。
 */
export function formatCurrency(amount: number, currency: string = '¥'): string {
  return `${currency} ${amount.toFixed(2)}`
}

// ... 其他辅助函数
