// Node.js MySQL SELECT FROM query Example
// include mysql module
var mysql2 = require('mysql');
 
// create a connection variable with the required details
var con = mysql2.createConnection({
  host: "nodejs.c13ntv3apmow.us-east-1.rds.amazonaws.com", //"localhost",    // ip address of server running mysql
  user: "root",    // user name to your mysql database
  password: "theeslumgod", // corresponding password
  database: "nodejs_login" // use the specified database
});

con.connect(function(err) {
        if (err) throw err; });
        
module.exports = con;