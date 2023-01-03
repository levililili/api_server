// 抽离用户路由模块中的处理函数

/**
 * 在这里定义和用户相关的路由处理函数，供 /router
 */

// 导入数据库操作模块
const db = require('../db/index')

// 导入bcryptjs模块进行加密
const bcrypt = require('bcryptjs')

// 导入jsonwebtoken模块生成token字符串
const jwt = require('jsonwebtoken')

// 导入配置文件
const config = require('../config')



exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userInfo = req.body
    // 对表单中的数据，进行合法性的校验
    // if (!userInfo.username || !userInfo.password) {
    //     // return res.send({
    //     //     status: 1,
    //     //     message: '用户名或者密码不能为空！'
    //     // })
    //     // 优化后的res.send()
    //     return res.cc('用户名或者密码不能为空！')
    // }



    // 定义sql语句
    const sql = 'select * from ev_user where username=?'
    // 执行sql语句，并根据结果判断用户名是否已经被占用
    db.query(sql, [userInfo.username], (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.cc(err)
        }
        // 用户名被占用
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名')
        }
        // 用户名可用
        // 注意：为了保证密码的安全性，不建议在数据库中用明文的形式保存用户密码，推荐对密码加密存储
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        // console.log(userInfo);

        // 插入新用户信息到ev_user表中
        const sql = 'insert into ev_user set ?'
        // 用户提交的信息可能有别的，但只获取username和password
        db.query(sql, { username: userInfo.username, password: userInfo.password }, (err, results) => {
            if (err) {
                return res.cc(err)
            }
            // SQL语句执行成功，但影响行数不为1
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败，请稍后再试')
            }
            // 注册成功
            res.cc('注册成功！', 0)
        })
    })


}
exports.login = (req, res) => {
    // 根据用户名查询用户的信息
    const userInfo = req.body
    // 定义sql语句
    const sql = 'select * from ev_user where username=?'
    // 执行sql语句，查询用户的数据
    db.query(sql, [userInfo.username], (err, results) => {
        if (err)
            return res.cc(err)
        // 如果sql执行成功，但是影响的数据不止一条
        if (results.length !== 1)
            return res.cc('登录失败')
        // -判断用户输入的登录密码是否与数据库中的密码一致
        // ---bcrypt.compareSync(用户提交的密码, 数据库中的密码)
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
        // 如果比对的结果等于false,则郑梦用户输入的密码错误
        if (!compareResult)
            return res.cc('用户名或者密码错误，请重新输入！')
        // 登录成功，生成token字符串
        // 剔除密码和头像的值
        const user = { ...results[0], password: '', user_pic: '' }
        // 生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        // 将生成的token字符串响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用token，在服务器端直接拼接上Bearer的前缀
            token: 'Bearer ' + tokenStr,
        })

    })

}