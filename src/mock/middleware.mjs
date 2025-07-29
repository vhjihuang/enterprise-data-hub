import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// 单例数据库对象
let _db
const getDB = () => {
  if (!_db) {
    try {
      const __dirname = dirname(fileURLToPath(import.meta.url))
      _db = JSON.parse(readFileSync(join(__dirname, '../../db.json'), 'utf-8'))
    } catch (err) {
      console.error('数据库加载失败:', err)
      throw new Error('DB_INIT_FAILED')
    }
  }
  return _db
}

export default function loginMiddleware(req, res, next) {
  if (req.method !== 'POST' || req.path !== '/login') {
    return next()
  }

  try {
    const { username, password } = req.body || {}

    // 验证请求体
    if (!username || !password) {
      return res.status(400).json({
        error: '参数缺失',
        details: {
          username: !username ? '必填' : '有效',
          password: !password ? '必填' : '有效',
        },
      })
    }

    // 认证逻辑
    const user = getDB().login.find((u) => u.username === username && u.password === password)

    return user
      ? res.json({
          id: user.id,
          username: user.username,
          role: user.role,
          token: user.token,
        })
      : res.status(401).json({
          error: '认证失败',
          detail: '用户名或密码错误',
        })
  } catch (err) {
    console.error('登录处理错误:', err)
    return res.status(500).json({
      error: '系统内部错误',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
      }),
    })
  }
}
