const mongoDB = require('../config/mongoconfig.json');
var mongo = mongoDB.mongoURI;
const mongoose = require('mongoose');
var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 500,
    // bufferMaxEntries: 0
}

const test = require('../models/test');



function handle_request(msg, callback){
   
    console.log("Inside test_api kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log('Connected to mongodb');
            test.find({}, {username:1, password: 1, _id:0},async function (error, results){
                      console.log("Andr");
                    if (error){
                        callback(error,"Error");
                      res.end(error.code);
                    } else {
                        console.log(results);
                        callback(null,results);
                    }
                  })
        }
    })
};

exports.handle_request = handle_request;
