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

    var sql = "SELECT a.name,a.slug,a.description,a.image,a.url,ao.name AS name2,ao.slug AS slug2,ao.description AS description2,ao.image AS image2  FROM apisjson a INNER JOIN apisjson_overlay ao ON a.url = ao.apisjson_url ORDER BY name";

    connection.query(sql, function (error, results, fields) {                                
      callback( null, results );     
    });      
});