const express = require('express')
const router = express.Router()
// 导入文章分类的路由处理函数模块
const artcate_handler = require('../router_handler/artcate')
// 导入验证规则的中间件
const expressJoi = require('@escook/express-joi')
// 导入验证规则模块
const { add_cate_schema } = require('../schema/article')

// 挂载路由
// 获取文章分类信息
router.get('/cates', artcate_handler.getArticleCates)
// 新增文章分类
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.updateArticleCates)

module.exports = router