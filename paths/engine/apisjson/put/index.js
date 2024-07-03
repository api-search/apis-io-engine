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

    var aid = event.aid;
    var apis_json_url = event.url;
    var node = event.tags[0].toLowerCase();
    var search_node_url = "https://" + node + ".apis.io/apis/" + aid + "/apis/";

    var provider_insert = "INSERT INTO providers(aid,name,description,tags,score,apis_json_url,search_node_url) VALUES(" + connection.escape(event.aid) + "," + connection.escape(event.name) + "," + connection.escape(event.description) + "," + connection.escape(event.tags.join(", ")) + "," + connection.escape(event.score) + "," + connection.escape(apis_json_url) + "," + connection.escape(search_node_url) + ")";

    // APIS
    var api_insert = "INSERT INTO apis(aid,name,description,tags,score,apis_json_url,search_node_url) VALUES";
    for (let i = 0; i < event.apis.length; i++) {
      var human_url = event.apis[i].humanUrl;
      api_insert += "(" + connection.escape(event.apis[i].aid) + "," + connection.escape(event.apis[i].name) + "," + connection.escape(event.apis[i].description) + "," + connection.escape(event.apis[i].tags.join(", ")) + "," + connection.escape(event.apis[i].score) + "," + connection.escape(apis_json_url) + "," + connection.escape(search_node_url) + "," + connection.escape(human_url) + "),";
    }
    api_insert = api_insert.substring(0, api_insert.length - 1);

    // Properties
    var property_insert = "INSERT INTO properties(aid,property) VALUES";
    for (let i = 0; i < event.apis.length; i++) {
      for (let j = 0; j < event.apis[i].properties.length; j++) {
        property_insert += "(" + connection.escape(event.apis[i].aid) + "," + connection.escape(event.apis[i].properties[j].type) + "),";
      }
    }
    if(event.common){
      for (let i = 0; i < event.common.length; i++) {
        property_insert += "(" + connection.escape(aid) + "," + connection.escape(event.common[i].type) + "),";
      }    
    }
    property_insert = property_insert.substring(0, property_insert.length - 1);    

    // Tags
    var tag_insert = "INSERT INTO tags(aid,tag) VALUES";
    for (let i = 0; i < event.apis.length; i++) {
      for (let j = 0; j < event.apis[i].tags.length; j++) {
        tag_insert += "(" + connection.escape(event.apis[i].aid) + "," + connection.escape(event.apis[i].tags[j]) + "),";
      }
    }
    if(event.common){
      for (let i = 0; i < event.tags.length; i++) {
        tag_insert += "(" + connection.escape(aid) + "," + connection.escape(event.tags[i]) + "),";
      }    
    }
    tag_insert = tag_insert.substring(0, tag_insert.length - 1);    


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

              // INSERT apis
              connection.query(api_insert, function (error, results, fields) { 

                // INSERT properties
                connection.query(property_insert, function (error, results, fields) { 

                  // INSERT tags
                  connection.query(tag_insert, function (error, results, fields) { 

                    var response = {};
                    response.results = "Successfully Processed!";
                    callback( null, response );

                    }).on('error', err => {
                      callback( null, err );
                    }); // end tags    

                  }).on('error', err => {
                    callback( null, err );
                  }); // end properties     

                }).on('error', err => {
                  callback( null, err );
                }); // end apis       

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