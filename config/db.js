const mysql = require('mysql');

// Update this to match your actual database credentials
const dbConfig = {
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_ONID',
    password: 'password',
    database: 'cs340_ONID'
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Helper function to execute queries with Promises
function query(sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

// Test database connection
function testConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Database connection error:', err);
                if (err.code === 'ECONNREFUSED') {
                    console.error('Cannot connect to MySQL server. Make sure it is running.');
                }
                if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                    console.error('Access denied. Check your username and password.');
                }
                reject(err);
                return;
            }
            console.log('Successfully connected to MySQL database');
            connection.release();
            resolve();
        });
    });
}

module.exports = {
    query,
    testConnection
};