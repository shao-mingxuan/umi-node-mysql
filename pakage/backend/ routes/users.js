// routes/user.js
const express = require('express');
const usersRoutes = express.Router();
const bodyParser = require('body-parser');
const pool = require('../db');
const bcrypt = require('bcrypt');

usersRoutes.use(bodyParser.urlencoded({ extended: false }));
usersRoutes.use(bodyParser.json());

//注册
usersRoutes.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const addSql = 'INSERT INTO userInfo (userName, userPwd) VALUES (?, ?)';
    //密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    const addSqlParams = [username, hashedPassword];

    if (!username || !password) {
        return res.status(400).json({ error: '请输入用户名和密码' });
    }
    try {
        const [result] = await pool.query(addSql, addSqlParams);
        res.json({
            data: '注册成功',
            message: 'success',
            status: 200,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//登陆查询
usersRoutes.post('/query', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: '请输入用户名和密码' });
    }
    try {
        // 查询数据库
        const [rows] = await pool.query('SELECT * FROM userInfo WHERE userName = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).json({ error: '用户不存在' });
        }
        //密码解密
        const user = rows[0];
        console.log(user,'user');
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: '密码错误' });
        }
        // 生成JWT
        const token = jwt.sign({ userId: user.id }, 'secret-key', { expiresIn: '1h' });
        res.json({
            status: 200,
            message: 'success',
            data:'登陆成功',
            token: token,
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = usersRoutes;