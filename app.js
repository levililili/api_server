// 整个项目的入口文件

// 导入express模块;
const express = require('express');
// 创建express的服务器实例;
const app = express();
// 导入路由模块
const userRouter = require('./router/user')
const userinfoRouter = require('./router/userinfo')

// 导入cors中间件
const cors = require('cors')

// 导入joi
const joi = require('joi')

// 导入配置对象
const config = require('./config')

// 导入解析token的中间件
const expressJWT = require('express-jwt')

// 全局注册cors中间件
app.use(cors())
// 全局注册解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 响应数据的中间件
app.use((req, res, next) => {
    // status = 0 为成功；status = 1 为失败，默认把status的值设为1，方便处理失败的情况
    res.cc = function (err, status = 1) {
        res.send({
            // 状态
            status,
            // 状态描述，判断err是 错误对象 还是 字符串(自定义类型)
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

// 注册解析token的中间件(一定要在配置解析路由之前)
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 注册路由模块
app.use('/api', userRouter)
app.use('/my', userinfoRouter)


// 错误中间件
app.use((err, req, res, next) => {
    // 数据验证失败导致的错误
    if (err instanceof joi.ValidationError)
        return res.cc(err)
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError')
        return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
})


// 调用app.listen方法，在指定的3000端口启动web服务器;
app.listen(3000, () => {
    console.log('Express server running at http://127.0.0.1:3000');
})