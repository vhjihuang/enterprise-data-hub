import type { AxiosResponse } from 'axios'

/**
 * 从 Axios 响应中解包数据
 *
 * @template T 响应数据的类型
 * @param {Promise<AxiosResponse<T>>} promise Axios 响应的 Promise
 * @returns {Promise<T>} 包含响应数据的 Promise
 */
export const unwrap = <T>(promise: Promise<AxiosResponse<T>>): Promise<T> =>
  promise.then((response) => response.data)
