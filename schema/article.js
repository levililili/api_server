// 导入joi定义验证规则
const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 * allow() 允许内容
 * valid() 指定允许的合法值
 */

// 定义 分类名称 和 分类别名的校验规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()

// 定义 分类id 的校验规则
const id = joi.number().min(1).integer().required()

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()


// 定义验证规则对象---文章分类
exports.add_cate_schema = {
    body: {
        name,
        alias,
    }
}


// 定义验证规则对象---删除分类
exports.delete_cate_schema = {
    params: {
        id,
    }
}

// 校验规则对象 - 根据 Id 获取分类
exports.get_cate_schema = {
    params: {
        id,
    },
}

// 校验规则对象 - 更新分类
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias
    }
}

// 校验规则对象 - 发布文章
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state,
    }

}