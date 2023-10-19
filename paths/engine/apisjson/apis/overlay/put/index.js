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

    if(event.humanURL != ''){

      let humanURL = event.humanURL;
      let apisjson_name = event.name;
      let apisjson_slug = event.slug;
      let apisjson_description = event.description;
      let apisjson_image = event.image;
            
      var sql = "SELECT * FROM apis_overlay";
      sql += " WHERE humanURL = " + connection.escape(humanURL);
      connection.query(sql, function (error, results, fields) {                
                
        if(!results){

          var sql2 = "INSERT INTO apis_overlay(name,slug,description,image,humanURL)";
          sql2 += " VALUES(" + connection.escape(apisjson_name) + "," + connection.escape(apisjson_slug) + "," + connection.escape(apisjson_description) + "," + connection.escape(apisjson_image) + "," + connection.escape(humanURL) + ")";
          connection.query(sql2, function (error, results, fields) {                                  
    
            outcome = {};
            outcome.message = "3) Added the overlay for the " + apisjson_slug + " APIs.json file.";
            //outcome.sql = sql2;
            //outcome.error = error;
            //outcome.results = results;
    
            callback( null, outcome );     
    
          });  

        }
        else if(results.length == 0){

          var sql3 = "INSERT INTO apis_overlay(name,slug,description,image,humanURL)";
          sql3 += " VALUES(" + connection.escape(apisjson_name) + "," + connection.escape(apisjson_slug) + "," + connection.escape(apisjson_description) + "," + connection.escape(apisjson_image) + "," + connection.escape(humanURL) + ")";
          connection.query(sql3, function (error, results, fields) {                                  
    
            outcome = {};
            outcome.message = "2) Added the overlay for the " + apisjson_slug + " APIs.json file.";
            //outcome.sql = sql3;
            //outcome.error = error;
            //outcome.results = results;            
    
            callback( null, outcome );     
    
          });  

        }        
        else{

          var sql4 = "UPDATE apis_overlay SET ";

          sql4 += "name=" + connection.escape(apisjson_name);
          sql4 += ",slug=" + connection.escape(apisjson_slug);
          sql4 += ",description=" + connection.escape(apisjson_description);
          sql4 += ",image=" + connection.escape(apisjson_image);
          sql4 += " WHERE humanURL = " + connection.escape(humanURL);
    
          connection.query(sql4, function (error, results, fields) {                
                    
            outcome = {};
            outcome.message = "Updated the overlay for the " + humanURL + " APIs.json file.";
            //outcome.sql = sql4;
    
            callback( null, outcome );     
    
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