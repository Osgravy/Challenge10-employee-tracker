const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_tracker',
    password: 'your_password', // Replace with your PostgreSQL password
    port: 5432,
});

client.connect();
module.exports = client;