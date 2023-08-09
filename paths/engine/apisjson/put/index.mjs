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
     
    callback(null,connection); 
  
};