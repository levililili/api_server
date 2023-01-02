// 整个项目的入口文件

// 导入express模块;
const express = require('express');
// 创建express的服务器实例;
const app = express();
// 导入路由模块
const userRouter = require('./router/user')

// 导入cors中间件
const cors = require('cors')
// 全局注册cors中间件
app.use(cors())
// 全局注册解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 注册路由模块
app.use('/api', userRouter)

// 调用app.listen方法，在指定的3000端口启动web服务器;
app.listen(3000, () => {
    console.log('Express server running at http://127.0.0.1:3000');
})