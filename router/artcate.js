const express = require('express')
const router = express.Router()

// 导入文章分类的路由处理函数模块
const artcate_handler = require('../router_handler/artcate')

// 挂载路由
// 获取文章分类信息
router.get('/cates', artcate_handler.getArticleCates)

module.exports = router