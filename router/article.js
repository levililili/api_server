const express = require('express')
const router = express.Router()
// 导入路由处理函数模块
const article_handler = require('../router_handler/article')
// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
// { dest: path.join(__dirname, '../uploads') } --- 配置对象,指定文件存放到项目下的uploads目录中
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 导入验证规则模块
const expressJoi = require('@escook/express-joi')
// 导入定义校验规则对象
const { add_article_schema } = require('../schema/article')

// TOOD: 在这里挂载路由
// 发布新文章的路由
// upload.single()是一个局部生效的中间件,用来解析FormData格式的表单数据
// .single(filename),接受一个以 filename 命名的文件.
// 将文件类型的数据,解析并挂载到req.file属性中
// 将文本类型的数据,解析并挂载到req.body数组中
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

module.exports = router