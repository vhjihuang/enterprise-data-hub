const { pathToFileURL } = require('node:url')

// 使用立即执行函数确保线程安全
let middleware
;(async () => {
  try {
    const module = await import(pathToFileURL(require.resolve('./middleware.mjs')))
    middleware = module.default
  } catch (err) {
    console.error('❌ ESM 加载失败:', err.stack || err)
    middleware = (req, res) =>
      res.status(500).json({
        error: '系统初始化失败',
        ...(process.env.NODE_ENV === 'development' && {
          detail: err.message,
        }),
      })
  }
})()

module.exports = function wrappedMiddleware(req, res, next) {
  return middleware
    ? middleware(req, res, next)
    : res.status(503).json({
        error: '服务启动中',
        message: '请等待2秒后重试',
        timestamp: Date.now(),
      })
}
