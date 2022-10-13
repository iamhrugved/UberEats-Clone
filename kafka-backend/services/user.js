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

exports.handle_request = function user(msg, callback) {
    console.log("user path:", msg.path);
    switch (msg.path) {
        case "login":
            login(msg, callback);
            break;
        case "userProfile":
            userProfile(msg, callback);
            break;
        case "updateProfile":
            updateProfile(msg, callback);
            break;
        case "allrest":
            allrest(msg,callback);
            break;
        case "searchItem":
            searchItem(msg, callback);
            break;
        case "searchOI":
            searchOI(msg, callback);
            break;
        case "sr":
            sr(msg, callback);
            break;
        case "markfavourite":
            markfavourite(msg, callback);
            break;
        case "getFavourites":
            getFavourites(msg, callback);
            break;
        case "sr_g":
            sr_g(msg, callback);
            break;
        case "deletefromfav":
            deletefromfav(msg, callback);
            break;
        case "sr1":
            sr1(msg, callback);
            break;
        case "addToCart":
            addToCart(msg, callback);
            break;
        case "updatequantity":
            updatequantity(msg, callback);
            break;
        case "getCart":
            getCart(msg, callback);
            break;
        case "getPrice":
            getPrice(msg, callback);
            break;
        case "getUserDeets":
            getUserDeets(msg, callback);
            break;
        case "updateordProfile":
            updateordProfile(msg, callback);
            break;
        case "deletefromcart":
            deletefromcart(msg, callback);
            break;
        case "order":
            order(msg, callback);
            break;
        case "orderIns":
            orderIns(msg, callback);
            break;
        case "cartorder":
            cartorder(msg, callback);
            break;
        case "orderstatus":
            orderstatus(msg, callback);
            break;
        case "filteruorders":
            filteruorders(msg, callback);
            break;
        case "uorderdeets":
            uorderdeets(msg, callback);
            break;
        case "uorderdeets_g":
            uorderdeets_g(msg, callback);
            break;
        case "updateordercan":
            updateordercan(msg, callback);
            break;
    }
};

function login(msg, callback){
   
    console.log("Inside userlogin kafka backend");
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
            console.log("User Login here");
            users.findOne({ email: useremail, password: userpassword }, function(err, results) {
                if(err) {
                    // res.send({err: err});
                    // console.log(err);
                    callback(null,{err: err})
                    // console.log("Error");
                }
                if (results) {
                    // res.cookie('cookie',useremail,{maxAge: 900000, httpOnly: false, path : '/'});
                    // console.log(results.email);
                    session.uemail = results.email;
                    session.isLoggedIn = true;
                    console.log(session.uemail);
                    console.log(session.isLoggedIn);
                    // console.log(results);
                    // session.save();   
                    const payload = { _id: results._id, username: results.email};
                    // console.log(payload);
                    const tokenus = jwt.sign(payload, JWT_KEY, {
                        expiresIn: 1008000
                    })
                    let token = jwt.sign({useremail: useremail}, JWT_KEY);
                    // res.json({
                    //     "status": 200,
                    //     "token": token,
                    //     "JWT": "JWT" + " " + tokenus
                    // });
                    callback(null,{"status": 200, "token": token, "JWT": "JWT" + " " + tokenus});
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


function userProfile(msg, callback){
   
    console.log("Inside profile kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("Cust Profile here");
            users.findOne({ email: msg.body}, function(err, results) {
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


function updateProfile(msg, callback){
   
    console.log("Inside profile update kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            users.findOneAndUpdate({ email: session.uemail }, 
                { $set : 
                    {   name: msg.body.name,
                        add1: msg.body.add1,
                        add2: msg.body.add2,
                        location: msg.body.location,
                        state: msg.body.state,
                        country: msg.body.country,
                        nickname: msg.body.nickname,
                        dob: msg.body.dob,
                        about: msg.body.about,
                        email: msg.body.email,
                        contact: msg.body.contact,
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


function allrest(msg, callback){
   
    console.log("Inside allrest kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User Home Page");
            restaurants.find({}, (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find any restaurants!");
                }
            });
            }})
};


function searchItem(msg, callback){
   
    console.log("Inside searchItem kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User Home Page");
            restaurants.aggregate([{"$lookup": {
                "from": "menus",
                "localField": "email",
                "foreignField": "email",
                as: "Search"
            }},
            {"$unwind": "$Search"},
            {"$match": {$and: [{"$or": [{location: msg.body.inSearch}, {name: msg.body.inSearch}, {"Search.p_name": msg.body.inSearch}, {"Search.p_category": msg.body.inSearch}]}, {"$or": [{delivery: msg.body.inDelivery}, {pickup: msg.body.inDelivery}]}, {"Search.p_type": msg.body.inV}]}}, 
            {"$project": {"_id": 0, "name": 1, "location": 1, "description": 1, "contact": 1, "timings": 1, "uploadURL": 1, "email": 1, "Search.email": 1}},
            {"$group": {_id: {name: "$name", location: "$location",  description: "$description", contact: "$contact", timings: "$timings", uploadURL: "$uploadURL", email: "$Search.email"}}},
            {"$replaceRoot": {newRoot: '$_id'}}], (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                else if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find any items from selected rest!");
                }
            });
            }})
};


function searchOI(msg, callback){
   
    console.log("Inside searchOI kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User Home Page");
            restaurants.aggregate([{"$lookup": {
                "from": "menus",
                "localField": "email",
                "foreignField": "email",
                as: "Search"
                }},
                {"$unwind": "$Search"},
                {"$match": {"$or": [{location: msg.body.inSer}, {name: msg.body.inSer}, {"Search.p_name": msg.body.inSer}, {"Search.p_category": msg.body.inSer}]}}, 
                {"$project": {"_id": 0, "name": 1, "location": 1, "description": 1, "contact": 1, "timings": 1, "uploadURL": 1, "email": 1, "Search.email": 1}},
                {"$group": {_id: {name: "$name", location: "$location",  description: "$description", contact: "$contact", timings: "$timings", uploadURL: "$uploadURL", email: "$Search.email"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                else if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find any items from selected rest!");
                }
            });
            }})
};



function sr(msg, callback){
   
    console.log("Inside sr kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    session.remail = msg.body.email;
    console.log(session.remail);
    results= session.remail;
    callback(null, results);
};


function markfavourite(msg, callback){
   
    console.log("Inside markfavourite kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log('Connected to mongodb');
            var newFav = new favourites({
                user_email: session.uemail,
                owner_email: msg.body.email
            })
                        console.log("User Fav here");
                        newFav.save(function (err, results){
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


function getFavourites(msg, callback){
   
    console.log("Inside getFavourites kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User Favourites Page");
            restaurants.aggregate([{"$lookup": {
                "from": "favourites",
                "localField": "email",
                "foreignField": "owner_email",
                as: "Search"
                }},
                {"$unwind": "$Search"},
                {"$match": {"Search.user_email": session.uemail}},
                {"$project": {"_id": 0, "name": 1, "location": 1, "description": 1, "contact": 1, "timings": 1, "uploadURL": 1, "email": 1, "Search.owner_email": 1}},
                {"$group": {_id: {name: "$name", location: "$location",  description: "$description", contact: "$contact", timings: "$timings", uploadURL: "$uploadURL", email: "$Search.owner_email"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                else if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find any favs!");
                }
            });
            }})
};


function sr_g(msg, callback){
   
    console.log("Inside sr_g kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User Rest menu Page");
            menus.find({email: session.remail}, (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                else if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find any favs!");
                }
            });
            }})
};


function deletefromfav(msg, callback){
   
    console.log("Inside deletefromfav kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User Fav Del");
            favourites.findOneAndDelete({owner_email: msg.body.email}, {user_email: session.uemail}, 
                (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                else if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find any favs!");
                }
            });
            }})
};


function sr1(msg, callback){
   
    console.log("Inside sr1 kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User Rest menu Page");
            restaurants.find({email: session.remail}, (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                else if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find any menu!");
                }
            });
            }})
};

function addToCart(msg, callback){
   
    console.log("Inside addToCart kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User addToCart Page");
            var newCart = new carts({
                po_id: msg.body.p_id,
                price: msg.body.price,
                user_email: session.uemail,
                owner_email: session.remail,
            })
            newCart.save((err, results) => {
                if (err) {
                    callback(null,{err: err})
                    console.log(err);
                } else {
                    console.log("Added to cart!");
                    callback(null, results);
                }
            });
            }})
};


function updatequantity(msg, callback){
   
    console.log("Inside updatequantity kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User Rest menu Page");
            carts.findOneAndUpdate({ user_email: session.uemail, po_id:  msg.body.po_id},
                { $set : 
                    {quantity: msg.body.quantity}
                }, (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                else if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Quantity not updated!");
                }
            });
            }})
};


function getCart(msg, callback){
   
    console.log("Inside getCart kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User getCart Page");
            carts.aggregate([
                {"$lookup": {
                "from": "menus",
                "localField": "po_id",
                "foreignField": "p_id",
                as: "Search"
                }},
                {"$unwind": "$Search"},
                {"$lookup": {
                    "from": "restaurants",
                    "localField": "owner_email",
                    "foreignField": "email",
                    as: "Search1"
                    }},
                {"$unwind": "$Search1"},
                {"$match": {"user_email": session.uemail}},
                {"$project": {"_id": 0, "po_id": 1, "Search1.name": 1, "quantity": 1, "Search.p_name": 1, "Search.p_category": 1, "Search.p_price": 1}},
                {"$group": {_id: {po_id: "$po_id", name: "$Search1.name",  quantity: "$quantity", p_name: "$Search.p_name", p_category: "$Search.p_category", p_price: "$Search.p_price"}}},
                {"$replaceRoot": {newRoot: '$_id'}}],
                (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                else if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find any cart items!");
                }
            });
            }})
};

function getPrice(msg, callback){
   
    console.log("Inside getPrice kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User getPrice Page");
            carts.find({user_email: session.uemail},
                (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                else if (results) {
                    fr = 0;
                    for (let i=0; i<results.length; i++){
                    fp = parseFloat(results[i].quantity) * parseFloat(results[i].price);
                    fr += fp;
                   }
                 senRes = {total_price: fr};
                    callback(null, senRes);
                    }
                else {
                    console.log("Can't find any cart items!");
                }
            });
            }})
};

function getUserDeets(msg, callback){
   
    console.log("Inside getUserDeets kafka backend");
    console.log(session.uemail);
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            console.log("User getUserDeets Page");
            users.findOne({email: session.uemail},
                (err, results) => {
                if(err) {
                    callback(null,{err: err})
                    console.log(err);
                    // console.log("Error");
                }
                else if (results) {
                    callback(null, results);
                    }
                else {
                    console.log("Can't find any cart name!");
                }
            });
            }})
};


function updateordProfile(msg, callback){
   
    console.log("Inside updateordProfile kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            users.findOneAndUpdate({ email: session.uemail }, 
                { $set : 
                    {   name: msg.body.name,
                        add1: msg.body.add1,
                        add2: msg.body.add2,
                        email: msg.body.email,
                        contact: msg.body.contact}
                    }, function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Updated Order Profile Successfully!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};


function deletefromcart(msg, callback){
   
    console.log("Inside deletefromcart kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            carts.findOneAndDelete({po_id: msg.body.po_id, user_email: session.uemail},
                 function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Deleted cart Successfully!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};

function order(msg, callback){
   
    console.log("Inside order kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            msg.body.forEach(element => {
                console.log(element.po_id);
                var newOrder = new orders({
                    po_id: element.po_id,
                    quantity: element.quantity,
                    user_email: session.uemail,
                    ordertime: msg.ordertime,
                    order_status: 'Ordered',
                });
                newOrder.save( 
                (err, results) => {
                    if (err) {
                        callback(null,{err: err})
                    } else {
                        console.log("Order Placed!");
                    }
                  });
              }) 
              callback(null, results);
            }})
};


function orderIns(msg, callback){
   
    console.log("Inside orderIns kafka backend");
    // console.log(msg.body.sp_id);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            orders.findOneAndUpdate({ user_email: session.uemail, po_id: msg.body.sp_id}, 
                { $set : 
                    {sp_inst: msg.body.SpIns}
                }, function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Updated SP Ins Successfully!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};


function cartorder(msg, callback){
   
    console.log("Inside cartorder kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            carts.deleteMany({user_email: session.uemail},
                 function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Deleted cart Successfully!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};


function orderstatus(msg, callback){
   
    console.log("Inside orderstatus kafka backend");
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
                    "from": "restaurants",
                    "localField": "Search.email",
                    "foreignField": "email",
                    as: "Search1"
                    }},
                {"$unwind": "$Search1"},
                {"$match": {"user_email": session.uemail}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "ordertime": 1}},
                {"$group": {_id: {name: "$Search1.name",  location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", ordertime: "$ordertime"}}},
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


function filteruorders(msg, callback){
   
    console.log("Inside filteruorders kafka backend");
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
                    "from": "restaurants",
                    "localField": "Search.email",
                    "foreignField": "email",
                    as: "Search1"
                    }},
                {"$unwind": "$Search1"},
                {"$match": {$and: [{"user_email": session.uemail}, {"order_status": msg.body.inOS}]}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "ordertime": 1}},
                {"$group": {_id: {name: "$Search1.name",  location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", ordertime: "$ordertime"}}},
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


function uorderdeets(msg, callback){
   
    console.log("Inside uorderdeets kafka backend");
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
                {"$match": {$and: [{"user_email": session.uemail}, {"ordertime": msg.body.order_id}]}},
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
                            console.log('uorder deets post!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};


function uorderdeets_g(msg, callback){
   
    console.log("Inside uorderdeets_g kafka backend");
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
                {"$match": {$and: [{"user_email": session.uemail}, {"ordertime": session.ordertime}]}},
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
                            console.log('Uorder deets get!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};


function updateordercan(msg, callback){
   
    console.log("Inside updateordercan kafka backend");
    console.log(msg);
    console.log("In handle request:"+ JSON.stringify(msg));
    mongoose.connect(mongo, options, function(err,db){
        if(err){
            callback(null,"Cannot connect to db");
        }
        else{
            orders.updateMany({ ordertime: msg.body.order_id}, 
                { $set : 
                    {order_status: 'Cancelled'}
                },
                 function(err, results) {
                        if(err) {
                            callback(null,{err: err})
                            console.log(err);
                            // console.log("Error");
                        }
                        if (results) {
                            console.log('Uorder can!');
                            // res.send(results);
                            callback(null, results)
                        }
                        else {
                            console.log("No results found");
                            }
                        });
            }})
};