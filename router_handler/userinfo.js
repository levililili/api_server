// 导入数据库模块
const db = require('../db/index')
// 导入bcryptjs
const bcrypt = require('bcryptjs')

// 获取用户的基本信息
exports.getUserInfo = (req, res) => {
    // 获取用户的基本信息
    // 根据用户的 id，查询用户的基本信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = 'select id,username,nickname,email,user_pic from ev_user where id=?'
    // 注意：只要配置成功了 express-jwt 这个中间件，就可以把解析出来的用户信息，挂载到 req.user 属性上
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql语句失败
        if (err)
            return res.cc(err)
        // 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        // 注意，不对数据表进行修改(查询)——length,对数据表修改——affectedRows
        if (results.length !== 1)
            return res.cc('获取用户信息失败')
        // 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0],
        })
    })
}

//更新用户的基本信息
exports.updateUserInfo = (req, res) => {
    // 定义sql语句
    const sql = 'update ev_user set ? where id=?'
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows !== 1)
            return res.cc('修改用户基本信息失败！')
        // 修改用户信息成功
        res.cc('修改用户基本信息成功！', 0)
    })
}

// 重置密码
exports.updatePassword = (req, res) => {
    // 根据id查询用户是否存在
    const sql = 'select * from ev_user where id=?'
    db.query(sql, req.user.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length !== 1)
            return res.cc('用户不存在!')
        // 判断提交的旧密码是否正确
        // 判断旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult)
            res.cc('原密码错误')
        // 对新密码进行bcrypt加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        const sql = 'update ev_user set password=? where id=?'
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err)
                return res.cc(err)
            // 
            if (results.affectedRows !== 1)
                return res.cc('更新密码失败!')
            // 更新密码成功
            res.cc('更新密码成功', 0)
        })
    })
}


// 更新头像
exports.updateAvatar = (req, res) => {
    const sql = 'update ev_user set user_pic=? where id=? '
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows !== 1)
            return res.cc('更新头像失败!')
        // 更新头像成功
        res.cc('更新头像成功!', 0)
    })
}



