const path = require('path')
const db = require('../db/index')
exports.addArticle = (req, res) => {
    // 判断是否上传了文章封面

    if (!req.file)
        return res.cc('文章封面是必选参数')

    // TODO: 表单数据合法,继续后面的处理流程
    // 整理需要插入数据库的文章信息对象
    const articleInfo = {
        // 标题 内容 状态 所属的分类ID
        ...req.body,
        // 文章封面在服务端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的id
        author_id: req.user.id,
    }

    // 定义发布文章的sql语句
    const sql = 'insert into ev_articles set ?'
    // 调用 db.query()执行发布文章的sql语句
    db.query(sql, articleInfo, (err, results) => {
        // 执行sql语句失败
        if (err)
            return res.cc(err)
        // 执行sql语句成功,但影响行数不等于1
        if (results.affectedRows !== 1)
            return res.cc('发布文章失败')
        // 发布文章成功
        res.cc('发布文章成功', 0)
    })

}