// 导入数据库模块
const db = require('../db/index')

// 获取文章分类信息
exports.getArticleCates = (req, res) => {
    // 根据分类的状态，获取所有未被删除的分类列表数据
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    db.query(sql, (err, results) => {
        if (err)
            return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results,
        })
    })

}

// 新增文章分类
exports.updateArticleCates = (req, res) => {
    // 查询分类名称和别名是否被占用
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err)
            return res.cc(err)
        // 分类名称 和 分类别名 都被占用
        // --分类名称 和 分类别名 分别被两行占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        // --分类名称 和 分类别名 同时被一行占用
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // 新增文章分类
        const sql = 'insert into ev_article_cate set ?'
        db.query(sql, req.body, (err, results) => {
            if (err)
                return res.cc(err)
            if (results.affectedRows !== 1)
                return res.cc('新增文章分类失败!')
            res.cc('新建文章分类成功!', 0)
        })

    })
}

// 根据id删除文章分类
exports.deleteCateById = (req, res) => {
    const sql = 'update ev_article_cate set is_delete=1 where id=?'
    db.query(sql, req.params.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows !== 1)
            return res.cc('删除文章分类失败!')
        res.cc('删除文章分类成功!', 0)
    })
}

// 根据id获取文章分类数据
exports.getCateById = (req, res) => {
    const sql = 'select * from ev_article_cate where id=?'
    db.query(sql, req.params.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length !== 1)
            return res.cc('获取文章分类数据失败!')
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results[0],
        })
    })
}
