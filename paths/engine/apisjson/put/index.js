const vandium = require('vandium');
const mysql  = require('mysql');

exports.handler = vandium.generic()
  .handler( (event, context, callback) => {

    var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
    });
     
    var sql = "SELECT url FROM openapi WHERE pulled IS NULL LIMIT 1";
    connection.query(sql, function (error, results, fields) { 
      
      callback(null,results);

    });  
  
});