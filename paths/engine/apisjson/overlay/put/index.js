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

    if(event.apisjson_url != ''){

      let apisjson_url = event.apisjson_url;
      let apisjson_name = event.name;
      let apisjson_slug = event.slug;
      let apisjson_description = event.description;
      let apisjson_image = event.image;
            
      var sql = "SELECT * FROM apisjson_overlay";
      sql += " WHERE apisjson_url = " + connection.escape(apisjson_url);
      connection.query(sql, function (error, results, fields) {                
                
        if(results.length == 0){

          var sql = "INSERT INTO apisjson_overlay(name,slug,description,image,apisjson_url)";
          sql += " VALUES(" + connection.escape(apisjson_name) + "," + connection.escape(apisjson_slug) + "," + connection.escape(apisjson_description) + "," + connection.escape(apisjson_image) + "," + connection.escape(apisjson_url) + ")";
          connection.query(sql, function (error, results, fields) {                                  
    
            outcome = {};
            outcome.message = "Added the overlay for the " + apisjson_slug + " APIs.json file."
    
            callback( null, outcome );     
    
          });  

        }
        else{

          var sql = "UPDATE apisjson_overlay SET";

          sql += "name=" + connection.escape(apisjson_name);
          sql += ",slug=" + connection.escape(apisjson_slug);
          sql += ",description=" + connection.escape(apisjson_description);
          sql += ",image=" + connection.escape(apisjson_image);
          sql += " WHERE apisjson_url = " + connection.escape(apisjson_url);
    
          connection.query(sql, function (error, results, fields) {                
                    
            outcome = {};
            outcome.message = "Updated the overlay for the " + apisjson_url + " APIs.json file."
    
            callback( null, sql );     
    
          }); 

        }

      });   
    }                               
    else{
      
      var response = {};
      response['pulling'] = "That did not seem to be an APIs.json URL.";            
      callback( null, response );          
      
    }      
});