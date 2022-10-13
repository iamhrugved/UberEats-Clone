var express = require('express');
var app = express();
app.use(express.json(({ limit: '10MB' })));
var session = require('express-session');
const {cloudinary} = require('../cloudinary');
var jwt = require('jsonwebtoken');
const mongoDB = require('../config/mongoconfig.json');
var mongo = mongoDB.mongoURI;
const mongoose = require('mongoose');
const JWT_KEY = 'UberEatsSP#07'

app.use(session({
  secret              : 'ubereats',
  resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
  duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration      :  5 * 60 * 1000,
}));

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 500,
    // bufferMaxEntries: 0
}


const users = require('../models/user');
const restaurants = require('../models/restaurant');
const menus = require('../models/menu');
const favourites = require('../models/favourite');
const carts = require('../models/cart');
const orders = require('../models/order');

exports.handle_request = function restaurant(msg, callback) {
    console.log("restaurant path:", msg.path);
    switch (msg.path) {
        case "reslogin":
            reslogin(msg, callback);
            break;
        case "resProfile":
            resProfile(msg, callback);
            break;
        case "resupdateProfile":
            resupdateProfile(msg, callback);
            break;
        case "resAddItems":
            resAddItems(msg,callback);
            break;
        case "addMenu":
            addMenu(msg,callback);
            break;
        case "editmenu":
            editmenu(msg,callback);
            break;
        case "resEditMenu":
            resEditMenu(msg,callback);
            break;
        case "resupdateMenu":
            resupdateMenu(msg,callback);
            break;
        case "resorderstatus":
            resorderstatus(msg, callback);
            break;
        case "filteresorders":
            filteresorders(msg, callback);
            break;
        case "rorderdeets":
            rorderdeets(msg, callback);
            break;
        case "rorderdeets":
            rorderdeets(msg, callback);
            break;
        case "rorderdeets_g":
            rorderdeets_g(msg, callback);
            break;
        case "resorderactions":
            resorderactions(msg, callback);
            break;
        case "userorderprof_p":
            userorderprof_p(msg, callback);
            break;
        case "userorderprof_g":
            userorderprof_g(msg, callback);
            break;
    }
};

function reslogin(msg, callback){
   
    console.log("Inside restaurantlogin kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            const useremail = msg.body.email;
            const userpassword = msg.body.password;
            console.log(useremail);
            console.log(userpassword);
            console.log("Rest Login here");
            restaurants.findOne({ email: useremail, password: userpassword }, function(err, results) {
                if(err) {
                    // res.send({err: err});
                    // console.log(err);
                    callback(null,{err: err})
                    // console.log("Error");
                }
                if (results) {
                    // res.cookie('cookie',useremail,{maxAge: 900000, httpOnly: false, path : '/'});
                    // console.log(results.email);
                    session.remail = results.email;
                    session.isLoggedIn = true;
                    console.log(session.remail);
                    console.log(session.isLoggedIn);
                    // console.log(results);
                    // session.save();   
                    const payload = { _id: results._id, username: results.email};
                    // console.log(payload);
                    const tokenr = jwt.sign(payload, JWT_KEY, {
                        expiresIn: 1008000
                    })
                    let token = jwt.sign({useremail: useremail}, JWT_KEY);
                    // res.json({
                    //     "status": 200,
                    //     "token": token,
                    //     "JWT": "JWT" + " " + tokenus
                    // });
                    callback(null,{"status": 200, "token": token, "JWT": "JWT" + " " + tokenr});
                    // res.end("Successful Login!");
                    // return;
                    }
                else {
                    // res.json({
                    //     "status": 403
                    // })
                    callback(null,{"status": 403});
                    console.log(results);
                }
            });
            }})
};


function resProfile(msg, callback){
   
    console.log("Inside resprofile kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("Rest Profile here");
            restaurants.findOne({ email: msg.body}, function(err, results) {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find user for profile page!");
                }
            });
            }})
};


function resupdateProfile(msg, callback){
   
    console.log("Inside resprofile update kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            restaurants.findOneAndUpdate({ email: session.remail }, 
                        { $set : 
                            {   name: msg.body.name,
                                location: msg.body.location,
                                description: msg.body.description,
                                contact: msg.body.contact,
                                timings: msg.body.timing,
                                delivery: msg.body.delivery,
                                pickup: msg.body.pickup,
                                uploadPublicID: msg.uploadPublicID,
                                uploadURL: msg.uploadURL }
                        }, function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Updated Profile Successfully!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};


function resAddItems(msg, callback){
   
    console.log("Inside resAddItems kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("Rest Menu");
            menus.find({ email: msg.body}, function(err, results) {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find menu for rest page!");
                }
            });
            }})
};


function addMenu(msg, callback){
   
    console.log("Inside addmenu kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log('Connected to mongodb');
            var newItem = new menus({
                p_name: msg.body.p_name,
                p_ingredients: msg.body.p_ingredients,
                p_description: msg.body.p_description,
                p_category: msg.body.p_category,
                p_type: msg.body.p_type,
                p_price: msg.body.p_price,
                email: session.remail,
                uploadPublicID: msg.uploadPublicID,
                uploadURL: msg.uploadURL,
            })
                        console.log("Rest menu here");
                        newItem.save(function (err, results){
                            if (err) {
                                callback(null,{err: err})
                                 console.log(err);
                            }
                            else {
                                callback(null, results);
                                console.log(results);
                                }
                            })
        }
    })
};


function editmenu(msg, callback){
   
    console.log("Inside editmenu kafka backend");
    console.log(msg);
    // console.log(msg.body.p_id);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("Rest Edit Menu");
            menus.find({email: session.remail, p_id: msg.body.p_id}, function(err, results) {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                if (results) {
                    session.p_id = results[0].p_id;
                    callback(null, results);
                    }
                else {
                    console.log("Can't find edit menu from rest page!");
                }
            });
            }})
};

function resEditMenu(msg, callback){
   
    console.log("Inside resEditMenu kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("Rest Edit Menu");
            menus.find({email: session.remail, p_id: session.p_id}, function(err, results) {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find edit menu from rest page!");
                }
            });
            }})
};


function resupdateMenu(msg, callback){
   
    console.log("Inside resupdateMenu kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log('Connected to mongodb');
            menus.findOneAndUpdate({ email: session.remail, p_id: session.p_id }, 
                { $set : 
                  {   p_name: msg.body.p_name,
                      p_ingredients: msg.body.p_ingredients,
                      p_description: msg.body.p_description,
                      p_category: msg.body.p_category,
                      p_type: msg.body.p_type,
                      p_price: msg.body.p_price,
                      uploadPublicID: msg.uploadPublicID,
                      uploadURL: msg.uploadURL }
              }, function (err, results) {
              if(err) {
                  callback(null,{err: err});
                  console.log(err);
                  // console.log("Error");
              }
              if (results) {
                  console.log('Updated Menu Successfully!');
                  callback(null, results);
              }
              else {
                  console.log("No results found");
                  }
              });
        }
    })
};


function resorderstatus(msg, callback){
   
    console.log("Inside resorderstatus kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            orders.aggregate([
                {"$lookup": {
                "from": "menus",
                "localField": "po_id",
                "foreignField": "p_id",
                as: "Search"
                }},
                {"$unwind": "$Search"},
                {"$lookup": {
                    "from": "users",
                    "localField": "user_email",
                    "foreignField": "email",
                    as: "Search1"
                    }},
                {"$unwind": "$Search1"},
                {"$match": {"Search.email": session.remail}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.email": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "ordertime": 1}},
                {"$group": {_id: {name: "$Search1.name", email: "$Search1.email", location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", ordertime: "$ordertime"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], 
                 function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Order Stat Successfully!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};


function filteresorders(msg, callback){
   
    console.log("Inside filteresorders kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            orders.aggregate([
                {"$lookup": {
                "from": "menus",
                "localField": "po_id",
                "foreignField": "p_id",
                as: "Search"
                }},
                {"$unwind": "$Search"},
                {"$lookup": {
                    "from": "users",
                    "localField": "user_email",
                    "foreignField": "email",
                    as: "Search1"
                    }},
                {"$unwind": "$Search1"},
                {"$match": {$and: [{"Search.email": session.remail}, {"order_status": msg.body.inOS}]}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.email": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "ordertime": 1}},
                {"$group": {_id: {name: "$Search1.name", email: "$Search1.email", location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", ordertime: "$ordertime"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], 
                 function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Order Filtered Successfully!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};


function rorderdeets(msg, callback){
   
    console.log("Inside rorderdeets kafka backend");
    console.log(msg);
    session.ordertime = msg.body.order_id;
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            orders.aggregate([
                {"$lookup": {
                "from": "menus",
                "localField": "po_id",
                "foreignField": "p_id",
                as: "Search"
                }},
                {"$unwind": "$Search"},
                {"$lookup": {
                    "from": "users",
                    "localField": "user_email",
                    "foreignField": "email",
                    as: "Search1"
                    }},
                {"$unwind": "$Search1"},
                {"$match": {$and: [{"Search.email": session.remail}, {"ordertime": msg.body.order_id}]}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.email": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "quantity": 1, "Search.p_name": 1, "Search.p_price": 1, "Search1.add1": 1, "Search1.add2": 1, "sp_inst": 1}},
                {"$group": {_id: {name: "$Search1.name", email: "$Search1.email", location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", quantity: "$quantity", p_name: "$Search.p_name", p_price: "$Search.p_price", add1: "$Search1.add1", add2: "$Search1.add2", sp_inst: "$sp_inst"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], 
                 function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Rorder deets post!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};


function rorderdeets_g(msg, callback){
   
    console.log("Inside rorderdeets_g kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            orders.aggregate([
                {"$lookup": {
                "from": "menus",
                "localField": "po_id",
                "foreignField": "p_id",
                as: "Search"
                }},
                {"$unwind": "$Search"},
                {"$lookup": {
                    "from": "users",
                    "localField": "user_email",
                    "foreignField": "email",
                    as: "Search1"
                    }},
                {"$unwind": "$Search1"},
                {"$match": {$and: [{"Search.email": session.remail}, {"ordertime": session.ordertime}]}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.email": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "quantity": 1, "Search.p_name": 1, "Search.p_price": 1, "Search1.add1": 1, "Search1.add2": 1, "sp_inst": 1}},
                {"$group": {_id: {name: "$Search1.name", email: "$Search1.email", location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", quantity: "$quantity", p_name: "$Search.p_name", p_price: "$Search.p_price", add1: "$Search1.add1", add2: "$Search1.add2", sp_inst: "$sp_inst"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], 
                 function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Rorder deets get!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};


function resorderactions(msg, callback){
   
    console.log("Inside resorderactions kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            orders.updateMany({ ordertime: msg.body.order_id}, 
                { $set : 
                    {order_status: msg.body.actions}
                },
                 function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Rorder Action!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};

function userorderprof_p(msg, callback){
   
    console.log("Inside userorderprof_p kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    session.prof = msg.body.user_email;
    let results = session.prof;
    callback(null, results)
};

function userorderprof_g(msg, callback){
   
    console.log("Inside userorderprof_g kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("Rest Profile here");
            users.findOne({ email: session.prof}, function(err, results) {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find user for profile page!");
                }
            });
            }})
};