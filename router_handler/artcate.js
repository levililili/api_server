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

