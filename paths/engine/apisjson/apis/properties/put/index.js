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
    
    var sql = "SELECT type,url FROM properties WHERE pulled <> " + weekNumber + ' LIMIT 1';
    connection.query(sql, function (error, results, fields) { 
      
        if(results && results.length > 0){
          
        // Pull any new ones.
        var property_type = results[0].type;
        var property_url = results[0].url;

        var property_slug = property_url.replace('http://','http-');
        property_slug = property_slug.replace('.json','');
        property_slug = property_slug.replace('.yaml','');
        property_slug = property_slug.replace('https://','https-');
        property_slug = property_slug.replace(/\//g, '-');
        property_slug = property_slug.replace('.','-');

        var save_apisjson_path = 'apis-io/api/apis-json/properties/' + property_slug + "/" + weekNumber + "/apis.json";
        console.log(property_url);
          https.get(property_url, function (error, res) {
            
            let data = [];
            //const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
            
            console.log('Status Code:', res.statusCode);
            //console.log('Date in Response header:', headerDate);
          
            res.on('data', chunk => {
              data.push(chunk);
            });
          
            res.on('end', () => {
              
              console.log('Response ended: ');

              if(!error && res.statusCode == 200){
                
                const property_content = Buffer.concat(data).toString();

                var outcome = {};
                outcome.status = res.statusCode;
                outcome.property_content = property_content;
                outcome.save_apisjson_path = save_apisjson_path;

                callback( null, outcome );

              }
              else{

                var outcome = {};
                outcome.status = res.statusCode;
                outcome.property_content = '';
                outcome.save_apisjson_path = '';

                callback( null, outcome );

              }

            });

          });

        }
        else{

          callback( null, error );

        }

    });
}); 