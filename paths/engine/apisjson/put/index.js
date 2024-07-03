const vandium = require('vandium');
const mysql  = require('mysql');
const https  = require('https');
const Ajv = require("ajv")
const ajv = new Ajv({allErrors: true,strict: false}) // options can be passed, e.g. {allErrors: true}
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.key,
  secretAccessKey: process.env.secret, 
  Bucket: "kinlane-productions2"
});

exports.handler = vandium.generic()
  .handler( (event, context, callback) => {

    var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
    });

    let currentDate = new Date();
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
     
    const weekNumber = Math.ceil(days / 7);    

    var provider_insert = "INSERT INTO providers(aid,name,description,tags) VALUES(" + connection.escape(event.aid) + "," + connection.escape(event.name) + "," + connection.escape(event.description) + "," + connection.escape(event.tags.join(", ")) + ")";
    var aid = event.aid;

    var api_insert = "INSERT INTO providers(aid,name,description,tags) VALUES";
    for (let i = 0; i < event.apis.length; i++) {
      api_insert += "(" + connection.escape(event.apis[i].aid) + "," + connection.escape(event.apis[i].name) + "," + connection.escape(event.apis[i].description) + "," + connection.escape(event.apis[i].tags.join(", ")) + "),";
    }
    api_insert = api_insert.substring(0, api_insert.length - 1);
    console.log("HERE: " + api_insert);

    // DELETE providers
    var sql = "DELETE FROM providers WHERE aid = '" + aid + "'";
    connection.query(sql, function (error, results, fields) { 

      // DELETE apis
      var sql = "DELETE FROM apis WHERE aid = '" + aid + "'";
      connection.query(sql, function (error, results, fields) { 

        // DELETE properties
        var sql = "DELETE FROM properties WHERE aid = '" + aid + "'";
        connection.query(sql, function (error, results, fields) { 

          // DELETE tags
          var sql = "DELETE FROM tags WHERE aid = '" + aid + "'";
          connection.query(sql, function (error, results, fields) { 

            // INSERTS

            // INSERT providers
            connection.query(provider_insert, function (error, results, fields) { 

              // INSERT providers
              connection.query(api_insert, function (error, results, fields) { 

                callback( null, api_insert );

                }).on('error', err => {
                  callback( null, err );
                }); // end providers       

              }).on('error', err => {
                callback( null, err );
              }); // end providers            

            // INSERTS

          }).on('error', err => {
            callback( null, err )
          }); // end properties

        }).on('error', err => {
          callback( null, err )
        }); // end properties

      }).on('error', err => {
        callback( null, err )
      });  // end apis     

    }).on('error', err => {
      callback( null, err )
    });  // end providers    
 
  
});