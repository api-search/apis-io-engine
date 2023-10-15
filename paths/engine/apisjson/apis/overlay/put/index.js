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

    if(event.humanUrl != ''){

      let api_humanUrl = event.humanUrl;
      let api_name = event.name;
      let api_slug = event.slug;
      let api_description = event.description;
      let api_image = event.image;
            
      var sql = "UPDATE apis SET";

      sql += "name2=" + connection.escape(api_name);
      sql += ",slug=" + connection.escape(api_slug);
      sql += ",description=" + connection.escape(api_description);
      sql += ",image=" + connection.escape(api_image);
      sql += " WHERE url = " + connection.escape(api_humanUrl);

      connection.query(sql, function (error, results, fields) {                
                
        outcome = {};
        outcome.message = "Updated the overlay for the " + api_name + " APIs."

        callback( null, outcome );     

      });   
    }                               
    else{
      
      var response = {};
      response['pulling'] = "That did not seem to be an Human URL.";            
      callback( null, response );          
      
    }      
});