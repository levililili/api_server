// 抽离用户路由模块中的处理函数

/**
 * 在这里定义和用户相关的路由处理函数，供 /router
 */

exports.regUser = (req, res) => {
    res.send('reguser OK!')
}
exports.login = (req, res) => {
    res.send('login OK!')
}