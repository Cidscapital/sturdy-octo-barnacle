const mysql = require('mysql2');

const dbConnection = mysql.createPool({
    host: 'nodejs.c13ntv3apmow.us-east-1.rds.amazonaws.com',//'localhost'
    user: 'root',
    password: 'theeslumgod',
    database: 'nodejs_login'
});

module.exports = dbConnection.promise();