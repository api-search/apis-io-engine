import * as mysql from "mysql";
import * as https from "https";
import Ajv from 'ajv';

const ajv = new Ajv.default({allErrors: true,strict: false});

export function handler(event, context, callback) {

    var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
    });
    
    var sql = "SELECT url FROM openapi WHERE pulled IS NULL LIMIT 1";
    connection.query(sql, function (error, results, fields) { 
      
    });  
  
};