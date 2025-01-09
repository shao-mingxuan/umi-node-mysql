// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',       // 数据库主机地址
    user: 'root',            // 数据库用户名
    password: 'smxbb5658', // 数据库密码
    database: 'students'   // 使用的数据库名
});

// 测试连接
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('成功连接到数据库');
        connection.release(); // 释放连接回连接池
    } catch (error) {
        console.error('连接数据库失败:', error);
    }
}

// 调用测试连接函数
testConnection();



// 导出连接池

module.exports = pool;