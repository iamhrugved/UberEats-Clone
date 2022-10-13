const mongoDB = require('../config/mongoconfig.json');
var mongo = mongoDB.mongoURI;
const mongoose = require('mongoose');
var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 500,
    // bufferMaxEntries: 0
}

const users = require('../models/user');



function handle_request(msg, callback){
   
    console.log("Inside user_reg kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log('Connected to mongodb');
                  var newUser = new users({
                            name: msg.username,
                            contact: msg.contact,
                            email: msg.email,
                            password: msg.password
                        })
                        console.log("User Reg here");
                        users.findOne({ email: msg.email }).then((user) => {
                            if(user) {
                                console.log("Email Exists.");
                                callback(null,{"status": 1062});
                            }
                            else {
                                newUser.save(function (err, results){
                                    if (err) {
                                        console.log(err);
                                        console.log("error");
                                    }
                                    else {
                                        // res.send(results);
                                        console.log(results);
                                        callback(null,results);
                                    }
                                })
                                }
                            });
        }
    })
};

exports.handle_request = handle_request;
