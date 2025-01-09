// routes/user.js
const express = require('express');
const studentsRoutes = express.Router();
const bodyParser = require('body-parser');
const pool = require('../db');


studentsRoutes.use(bodyParser.urlencoded({ extended: false }));
studentsRoutes.use(bodyParser.json());


// 获取所有用户
studentsRoutes.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json({
            data: rows,
            message: 'success',
            status: 200,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//获取单个用户
studentsRoutes.get('/usersInformation', async (req, res) => {
    const { id } = req.query;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        res.json({
            data: rows[0],
            message: 'success',
            status: 200,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加新用户
studentsRoutes.post('/add/users', async (req, res) => {
    const { name, gender, teacher, address, classes, createTime } = req.body;
    const currentTime = createTime || new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
        const [result] = await pool.query(
            'INSERT INTO users (name, gender, classes, teacher, address, createTime) VALUES (?, ?, ?, ?, ?, ?)',
            [name, gender, classes, teacher, address, currentTime]
        );
        console.log(result);
        res.status(200).json({
            message: 'success',
            status: 200,
            id: result.insertId,
            result: '创建成功'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 更新用户
studentsRoutes.post('/update/users/data', async (req, res) => {
    const { name, gender, teacher, address, classes, createTime, id } = req.body;
    if (!id || !name || !gender || !teacher || !address || !classes || !createTime) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const [result] = await pool.query(
            'UPDATE users SET name = ?, gender = ?, teacher = ?, address = ?, classes = ?, createTime = ? WHERE id = ?',
            [name, gender, teacher, address, classes, createTime, id]
        );
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({
                message: 'success',
                status: 200,
                result: '修改成功',
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除用户
studentsRoutes.delete('/delete/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({ 
                message: 'success',
                status: 200,
                result: '删除成功', });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = studentsRoutes;