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

    var sql = "SELECT a.name,a.slug,a.description,a.image,a.humanURL,a.tags,ao.name AS name2,ao.slug AS slug2,ao.description AS description2,ao.image AS image2,ao.tags AS tags2 FROM apis a LEFT JOIN apis_overlay ao ON a.humanURL = ao.humanURL ORDER BY name";

    connection.query(sql, function (error, results, fields) {                                
      callback( null, results );     
    });      
});