// app.js
const express = require('express');
const cors = require('cors');
const studentsRoutes = require('./ routes/students');
const usersRoutes = require('./ routes/users');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// 测试路由
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/students', studentsRoutes);
app.use('/users', usersRoutes);

// 启动服务器
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});