var express = require('express');
var app = express();
app.use(express.json(({ limit: '10MB' })));
const passport = require("passport");
app.use(passport.initialize());
var session = require('express-session');
const {cloudinary} = require('./cloudinary');
const mongoDB = require('./mongoconfig.json');
var mongo = mongoDB.mongoURI;
const mongoose = require('mongoose');
// var mysql = require('mysql');
var constants = require('./config.json');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var kafka = require('./kafka/client');
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

// var ipAdd='localhost';
// `http://${ipAdd}:3000`

const JWT_KEY = 'UberEatsSP#07'

app.use(session({
  secret              : 'ubereats',
  resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
  duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration      :  5 * 60 * 1000,
}));



const users = require('./models/user');
const test = require('./models/test');
const restaurants = require('./models/restaurant');
const menus = require('./models/menu');
const favourites = require('./models/favourite');
const carts = require('./models/cart');
const orders = require('./models/order');
const { auth } = require('./passport');
auth();
const { checkAuth } = require('./passport');
const { checkAuthR } = require('./passport');


var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 500,
    // bufferMaxEntries: 0
}

mongoose.connect(mongo, options, (err, res) => {
    if (err) {
        console.log(err);
        console.log("MongoDB connection failed.");
    } else {
        console.log("MongoDB Connected");
    }
})


// var connection = mysql.createConnection({})
// var connection = mysql.createPool({
//   host: constants.DB.host,
//   user: constants.DB.username,
//   password: constants.DB.password,
//   port: constants.DB.port,
//   database: constants.DB.database,
//   // connectionLimit: 99
// });


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// connection.getConnection((err) => {
//   if(err) {
//     throw 'Error Occured: ' + err;
//   }
//   console.log("Pool Created.")
// });

// Kafka Test Api
app.get('/test_api', function(req, res){

    kafka.make_request('test',{}, function(err,results){
        console.log('test Api');
        console.log(results);
        if (err){
            console.log("Inside err");
            // res.json({
            //     status:"error",
            //     msg:"System Error, Try Again."
            // })
        }else{
            console.log("Inside else");
            console.log(results);
            res.writeHead(200, {
                        'Content-Type': 'text/plain'
                      });
                      res.end(JSON.stringify(results));
            }
        
    });
});


app.post('/userReg', function(req, res){

    kafka.make_request('userReg',req.body, function(err,results){
        console.log('User Reg');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.send(results);
        }
    });
});


app.post('/login', function(req, res){

    kafka.make_request('user',{"path": "login", "body": req.body}, function(err,results){
        console.log('User Login');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            // console.log(results);
            if (results.status === 200) {
            res.cookie('cookie',req.body.email,{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.uemail = req.body.email;
            req.session.isLoggedIn = true;
            console.log(req.session.uemail);
            console.log(req.session.isLoggedIn);
            // console.log(results);
            req.session.save();   
            res.send(results);
            }
            else {
                res.send(results);
            }
        }
    });
});


app.post('/resReg', function(req, res){

    kafka.make_request('resReg',req.body, function(err,results){
        console.log('Res Reg');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.send(results);
        }
    });
});


app.post('/reslogin', function(req, res){

    kafka.make_request('restaurant',{"path": "reslogin", "body": req.body}, function(err,results){
        console.log('Res Login');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            // console.log(results);
            if (results.status === 200) {
            res.cookie('cookie',req.body.email,{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.remail = req.body.email;
            req.session.isLoggedIn = true;
            console.log(req.session.remail);
            console.log(req.session.isLoggedIn);
            // console.log(results);
            req.session.save();   
            res.send(results);
            }
            else {
                res.send(results);
            }
        }
    });
});


app.get('/resProfile', checkAuthR, (req, res) => {

    kafka.make_request('restaurant',{"path": "resProfile", "body": req.session.remail}, function(err,results){
        console.log('Res Profile');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.status(200).send(results);
        }
    });
});


app.post('/resupdateProfile', checkAuthR, async function(req, res) {
    try {
                const fileStr = req.body.preview;
                const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
                // console.log(uploadResponse);
                req.session.uploadPublicID = uploadResponse.public_id;
                req.session.uploadURL = uploadResponse.url;
               } catch (err) {
                console.log(err);
               }
    kafka.make_request('restaurant',{"path": "resupdateProfile", "body": req.body, "uploadPublicID": req.session.uploadPublicID, "uploadURL": req.session.uploadURL}, function(err,results){
        console.log('Res Update Profile');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.send(results);
        }
    });
});


app.get('/userProfile', checkAuth, (req, res) => {

    kafka.make_request('user',{"path": "userProfile", "body": req.session.uemail}, function(err,results){
        console.log('User Profile');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.status(200).send(results);
        }
    });
});


app.post('/updateProfile', checkAuth, async function(req, res) {
    try {
                const fileStr = req.body.preview;
                const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
                // console.log(uploadResponse);
                req.session.uploadPublicID = uploadResponse.public_id;
                req.session.uploadURL = uploadResponse.url;
               } catch (err) {
                console.log(err);
               }
    kafka.make_request('user',{"path": "updateProfile", "body": req.body, "uploadPublicID": req.session.uploadPublicID, "uploadURL": req.session.uploadURL}, function(err,results){
        console.log('Cust Update Profile');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.send(results);
        }
    });
});


app.post('/updateordProfile', checkAuth, async function(req, res) {

    kafka.make_request('user',{"path": "updateordProfile", "body": req.body}, function(err,results){
        console.log('Cust Order Update Profile');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.send(results);
        }
    });
});


app.get('/resAddItems', checkAuthR, (req, res) => {

    kafka.make_request('restaurant',{"path": "resAddItems", "body": req.session.remail}, function(err,results){
        console.log('Rest Menu');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.send(results);
        }
    });
});


app.post('/addMenu', checkAuthR, async function(req, res) {
    try {
                const fileStr = req.body.preview;
                const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
                // console.log(uploadResponse);
                req.session.uploadPublicID = uploadResponse.public_id;
                req.session.uploadURL = uploadResponse.url;
               } catch (err) {
                console.log(err);
               }
    let body = {
        p_name: req.body.p_name,
        p_ingredients: req.body.p_ingredients,
        p_description: req.body.p_description,
        p_category: req.body.p_category,
        p_type: req.body.p_type,
        p_price: req.body.p_price,
    }
    console.log(body);
    kafka.make_request('restaurant',{"path": "addMenu", "body": body, "uploadPublicID": req.session.uploadPublicID, "uploadURL": req.session.uploadURL}, function(err,results){
        console.log('Menu Add');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.send(results);
        }
    });
});


app.post('/editmenu', checkAuthR, async function(req, res) {
    
    kafka.make_request('restaurant',{"path": "editmenu", "body": req.body}, function(err,results){
        console.log('Menu Edit');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            req.session.p_id = results[0].p_id;
            res.sendStatus(200);
        }
    });
});


app.get('/resEditMenu', checkAuthR, async function(req, res) {
    
    kafka.make_request('restaurant',{"path": "resEditMenu", "body": {email: req.session.remail, p_id: req.session.p_id}}, function(err,results){
        console.log('Menu Edit');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.status(200).send(results);
        }
    });
});


app.post('/resupdateMenu', checkAuthR, async function(req, res) {
    try {
                const fileStr = req.body.preview;
                const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
                // console.log(uploadResponse);
                req.session.uploadPublicID = uploadResponse.public_id;
                req.session.uploadURL = uploadResponse.url;
               } catch (err) {
                console.log(err);
               }
    let body = {
        p_name: req.body.p_name,
        p_ingredients: req.body.p_ingredients,
        p_description: req.body.p_description,
        p_category: req.body.p_category,
        p_type: req.body.p_type,
        p_price: req.body.p_price,
    }
    kafka.make_request('restaurant',{"path": "resupdateMenu", "body": body, "uploadPublicID": req.session.uploadPublicID, "uploadURL": req.session.uploadURL}, function(err,results){
        console.log('Menu Edit');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Updated Menu results");
            console.log(results);
            res.send(results);
        }
    });
});


app.get('/allrest', (req, res) => {
    
    kafka.make_request('user',{"path": "allrest"}, function(err,results){
        console.log('User Homepage');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside User Homepage results");
            // console.log(results);
            res.send(results);
        }
    });
});


app.post('/searchItem', (req, res) => {
    
    kafka.make_request('user',{"path": "searchItem", "body": req.body}, function(err,results){
        console.log('User Search');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside User Homepage results");
            // console.log(results);
            res.send(results);
        }
    });
});


app.post('/searchOI', (req, res) => {
    
    kafka.make_request('user',{"path": "searchOI", "body": req.body}, function(err,results){
        console.log('User Search OI');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside User Homepage results");
            // console.log(results);
            res.send(results);
        }
    });
});


app.post('/sr', (req, res) => {
    
    kafka.make_request('user',{"path": "sr", "body": req.body}, function(err,results){
        console.log('User Search Visit');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside User Homepage rest click");
            req.session.remail = req.body.email;
            // console.log(results);
            res.sendStatus(200);
        }
    });
});


app.post('/markfavourite', checkAuth, (req, res) => {
    
    kafka.make_request('user',{"path": "markfavourite", "body": req.body}, function(err,results){
        console.log('Mark Fav');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Added to fav");
            // console.log(results);
            res.send(results);
        }
    });
});


app.get('/getFavourites', checkAuth, (req, res) => {
    
    kafka.make_request('user',{"path": "getFavourites"}, function(err,results){
        console.log('User Favourites');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside User Favourite results");
            // console.log(results);
            res.send(results);
        }
    });
});


app.get('/getOwnerID', (req,res) => {
  res.send(req.session.remail);
})


app.get('/sr', (req, res) => {
    
    kafka.make_request('user', {"path": "sr_g", "body": req.session.remail}, function(err,results){
        console.log('User Search Visit');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside Res Menu");
            // console.log(results);
            res.send(results);
        }
    });
});


app.post('/deletefromfav', (req, res) => {
    
    kafka.make_request('user', {"path": "deletefromfav", "body": req.body}, function(err,results){
        console.log('Delete from Fav');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside Fav Del");
            // console.log(results);
            res.send(results);
        }
    });
});


app.get('/sr1', (req, res) => {
    
    kafka.make_request('user', {"path": "sr1", "body": req.session.remail}, function(err,results){
        console.log('User Search Visit');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside Res Menu1");
            // console.log(results);
            res.send(results);
        }
    });
});


app.post('/addToCart', checkAuth, (req, res) => {
    
    kafka.make_request('user', {"path": "addToCart", "body": req.body}, function(err,results){
        console.log('Add to Fav');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Add To Cart");
            // console.log(results);
            res.send(results);
        }
    });
});


app.post('/updatequantity', checkAuth, (req, res) => {
    
    kafka.make_request('user', {"path": "updatequantity", "body": req.body}, function(err,results){
        console.log('Add to Fav');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Updated Quantity!");
            // console.log(results);
            res.send(results);
        }
    });
});


app.get('/getCart',  checkAuth, async (req, res) => {
    
    kafka.make_request('user', {"path": "getCart", "body": req.session.uemail}, 
    (err,results) =>{
        console.log('User getCart');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside User getCart");
            // console.log(results);
            res.send(results);
        }
    });
});


app.get('/getPrice',  checkAuth, async (req, res) => {
    
    kafka.make_request('user', {"path": "getPrice", "body": req.session.uemail}, 
    (err,results) =>{
        console.log('User getPrice');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside User getPrice");
            // console.log(results);
            res.status(200).send(results);
        }
    });
});


app.get('/getUserDeets',  checkAuth, async (req, res) => {
    
    kafka.make_request('user', {"path": "getUserDeets", "body": req.session.uemail}, 
    (err,results) =>{
        console.log('User getUserDeets');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside User getUserDeets");
            // console.log(results);
            res.status(200).send(results);
        }
    });
});


app.post('/deletefromcart', checkAuth, (req, res) => {
    
    kafka.make_request('user', {"path": "deletefromcart", "body": req.body}, function(err,results){
        console.log('Delete from Cart');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Deleted from Cart!");
            // console.log(results);
            res.send(results);
        }
    });
});


app.post('/order', checkAuth, (req, res) => {
    let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = ("0" + date_ob.getHours()).slice(-2);
  let minutes = ("0" + date_ob.getMinutes()).slice(-2);
  let seconds = ("0" + date_ob.getSeconds()).slice(-2);
  let ordertime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  console.log(ordertime);

    kafka.make_request('user', {"path": "order", "body": req.body, "ordertime": ordertime}, function(err,results){
        console.log('Order');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Order placed successfully!");
            // console.log(results);
            res.send(results);
        }
    });
});

app.post('/orderIns', checkAuth, (req, res) => {
    console.log(req.body.length);
    if (req.body.length>0){
    kafka.make_request('user', {"path": "orderIns", "body": req.body[0]}, function(err,results){
        console.log('Sp Ins');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Sp Ins Added!");
            // console.log(results);
            res.send(results);
        }
    });}
});


app.post('/cartorder', checkAuth, (req, res) => {
    
    kafka.make_request('user', {"path": "cartorder", "body": req.body}, function(err,results){
        console.log('Cart Del');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Deleted from cart, Post order!");
            // console.log(results);
            res.send(results);
        }
    });
});


app.get('/orderstatus', checkAuth, (req, res) => {
    
    kafka.make_request('user', {"path": "orderstatus", "body": req.session.uemail}, function(err,results){
        console.log('Order Stat');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Display Order Stat");
            // console.log(results);
            res.status(200).send(results);
        }
    });
});


app.get('/resorderstatus', checkAuthR, (req, res) => {
    
    kafka.make_request('restaurant', {"path": "resorderstatus", "body": req.session.remail}, function(err,results){
        console.log('Res Order Stat');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Display Res Order Stat");
            // console.log(results);
            res.status(200).send(results);
        }
    });
});


app.post('/filteresorders', checkAuthR, (req, res) => {
    
    kafka.make_request('restaurant', {"path": "filteresorders", "body": req.body}, function(err,results){
        console.log('Filter Res Order');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Filter Display Res Order");
            // console.log(results);
            res.status(200).send(results);
        }
    });
});


app.post('/filteruorders', checkAuth, (req, res) => {
    
    kafka.make_request('user', {"path": "filteruorders", "body": req.body}, function(err,results){
        console.log('Filter user Order');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Filter Display User Order");
            // console.log(results);
            res.status(200).send(results);
        }
    });
});


app.post('/userorderprof_p', checkAuthR, (req, res) => {
    console.log(req.body);
    kafka.make_request('restaurant',{"path": "userorderprof_p", "body": req.body}, function(err,results){
        console.log('User Profile Fetch');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            req.session.prof = results;
            res.status(200).send(results);
        }
    });
});

app.get('/userorderprof_g', checkAuthR, (req, res) => {
    console.log(req.session.prof);
    kafka.make_request('restaurant',{"path": "userorderprof_g", "body": req.session.prof}, function(err,results){
        console.log('User Profile Fetch');
        console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Inside results");
            console.log(results);
            res.status(200).send(results);
        }
    });
});


app.post('/rorderdeets', checkAuthR, (req, res) => {
    req.session.ordertime = req.body.order_id;
    kafka.make_request('restaurant', {"path": "rorderdeets", "body": req.body}, function(err,results){
        console.log('Res Order Stat');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Post Rest order stat");
            // console.log(results);
            res.status(200).send(results);
        }
    });
});


app.get('/rorderdeets', checkAuthR, (req, res) => {

    kafka.make_request('restaurant', {"path": "rorderdeets_g", "body": req.body}, function(err,results){
        console.log('Res Order Stat');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Get Rest order stat");
            // console.log(results);
            res.status(200).send(results);
        }
    });
});


app.post('/uorderdeets', checkAuth, (req, res) => {
    req.session.ordertime = req.body.order_id;
    kafka.make_request('user', {"path": "uorderdeets", "body": req.body}, function(err,results){
        console.log('Res Order Stat');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Post Rest order stat");
            // console.log(results);
            res.status(200).send(results);
        }
    });
});


app.get('/uorderdeets', checkAuth, (req, res) => {

    kafka.make_request('user', {"path": "uorderdeets_g", "body": req.body}, function(err,results){
        console.log('Res Order Stat');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Get Rest order stat");
            // console.log(results);
            res.status(200).send(results);
        }
    });
});


app.post('/updateordercan', checkAuth, (req, res) => {
    
    kafka.make_request('user', {"path": "updateordercan", "body": req.body}, function(err,results){
        console.log('Cust Can Order Stat');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Updated Order Can Stat Successfully!");
            // console.log(results);
            res.send(results);
        }
    });
});


app.post('/resorderactions', checkAuthR, (req, res) => {
    
    kafka.make_request('restaurant', {"path": "resorderactions", "body": req.body}, function(err,results){
        console.log('Rest Order Change');
        // console.log(results);
        if (err){
            console.log("Inside err");
        }else{
            console.log("Updated Order Stat Successfully!");
            // console.log(results);
            res.send(results);
        }
    });
});



// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
// app.listen(3001, function () {
//   console.log('Server listening on port 3001!');
// });

app.listen(3001, () => console.log('Server listening on port 3001'));

module.exports = app;