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



// Mongo Test Api
app.get('/test_api', async function (req, res){
    console.log("Test Api");
    console.log(req.body);
    test.find({}, {username:1, password: 1, _id:0},async function (error, results){
      console.log("Andr");
    if (error){
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(error.code);
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(results));
    }
  })
})




app.post('/userReg', async function (req, res) {
    
    var newUser = new users({
        name: req.body.username,
        contact: req.body.contact,
        email: req.body.email,
        password: req.body.password
    })
    console.log("User Reg here");
    users.findOne({ email: req.body.email }).then((user) => {
        if(user) {
            res.json({
                "status": 1062
              });
            console.log("Email Exists.");
        }
        else {
            newUser.save(function (err, results){
                if (err) {
                    console.log(err);
                    console.log("error");
                }
                else {
                    res.send(results);
                    console.log(results);
                }
            })
            }
        });
  });


  app.post('/login', (req, res) => {
    const useremail = req.body.email;
    const userpassword = req.body.password;
    console.log(useremail);
    console.log(userpassword);
    const dbUser = (useremail, userpassword)
    console.log("User Login here");
    users.findOne({ email: useremail, password: userpassword }, function(err, results) {
        if(err) {
            res.send({err: err});
            console.log(err);
            // console.log("Error");
        }
        if (results) {
            res.cookie('cookie',useremail,{maxAge: 900000, httpOnly: false, path : '/'});
            // console.log(results.email);
            req.session.uemail = results.email;
            req.session.isLoggedIn = true;
            console.log(req.session.uemail);
            console.log(req.session.isLoggedIn);
            // console.log(results);
            req.session.save();   
            const payload = { _id: results._id, username: results.email};
            // console.log(payload);
            const tokenus = jwt.sign(payload, JWT_KEY, {
                expiresIn: 1008000
            })
            let token = jwt.sign({useremail: useremail}, JWT_KEY);
            res.json({
                "status": 200,
                "token": token,
                "JWT": "JWT" + " " + tokenus
            });
            res.end("Successful Login!");
            return;
            }
        else {
            res.json({
                "status": 403
            })
            console.log(results);
        }
    });
});


app.post('/resReg', async function (req, res) {
    
    var newUser = new restaurants({
        name: req.body.username,
        location: req.body.location,
        email: req.body.email,
        password: req.body.password
    })
    console.log("Rest Reg here");
    restaurants.findOne({ email: req.body.email }).then((user) => {
        if(user) {
            res.json({
                "status": 1062
              });
            console.log("Email Exists.");
        }
        else {
            newUser.save(function (err, results){
                if (err) {
                    console.log(err);
                    console.log("error");
                }
                else {
                    res.send(results);
                    console.log(results);
                }
            })
            }
        });
  });

  app.post('/reslogin', (req, res) => {
    const useremail = req.body.email;
    const userpassword = req.body.password;
    console.log(useremail);
    console.log(userpassword);
    const dbUser = (useremail, userpassword)
    console.log("User Login here");
    restaurants.findOne({ email: useremail, password: userpassword }, function(err, results) {
        if(err) {
            res.send({err: err});
            console.log(err);
            // console.log("Error");
        }
        if (results) {
            res.cookie('cookie',useremail,{maxAge: 900000, httpOnly: false, path : '/'});
            // console.log(results.email);
            req.session.remail = results.email;
            req.session.isLoggedIn = true;
            console.log(req.session.remail);
            console.log(req.session.isLoggedIn);
            req.session.save();   
            const payload = { _id: results._id, username: results.email};
            // console.log(payload);
            const tokenr = jwt.sign(payload, JWT_KEY, {
                expiresIn: 1008000
            })
            let token = jwt.sign({useremail: useremail}, JWT_KEY);
            res.json({
                "status": 200,
                "token": token,
                "JWT": "JWT" + " " + tokenr
            });
            res.end("Successful Login!");
            return;
            }
        else {
            res.json({
                "status": 403
            })
            console.log(results);
        }
    });
});


app.get('/resProfile', checkAuthR, (req, res) => {
    console.log('Res Profile')
    console.log(req.session);
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
        console.log("Not Logged In");
    } else {
    restaurants.findOne({ email: req.session.remail}, function(err, results) {
        if(err) {
            res.send({err: err});
            console.log(err);
            // console.log("Error");
        }
        if (results) {
            res.status(200).send(results);
            }
        else {
            console.log("Can't find user for profile page!");
        }
    });
    }
});


app.post('/resupdateProfile', checkAuthR, async function (req, res) {
    console.log("Rest Update Prof");
    // console.log(req.body.preview);
    try {
        const fileStr = req.body.preview;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
        // console.log(uploadResponse);
        req.session.uploadPublicID = uploadResponse.public_id;
        req.session.uploadURL = uploadResponse.url;
       } catch (err) {
        console.log(err);
       }

    if (!req.session.isLoggedIn) {
        console.log("User has to be logged in to update profile...");
    } else {
    restaurants.findOneAndUpdate({ email: req.session.remail }, 
        { $set : 
            {   name: req.body.name,
                location: req.body.location,
                description: req.body.description,
                contact: req.body.contact,
                timings: req.body.timing,
                delivery: req.body.delivery,
                pickup: req.body.pickup,
                uploadPublicID: req.session.uploadPublicID,
                uploadURL: req.session.uploadURL }
        }, function(err, results) {
        if(err) {
            res.send({err: err});
            console.log(err);
            // console.log("Error");
        }
        if (results) {
            console.log('Updated Profile Successfully!');
            res.send(results);
        }
        else {
            console.log("No results found");
            }
        });
    }
  });


  app.get('/userProfile', checkAuth, (req, res) => {
    console.log('User Profile')
    console.log(req.session);
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
        console.log("Not Logged In");
    } else {
    users.findOne({ email: req.session.uemail}, function(err, results) {
        if(err) {
            res.send({err: err});
            console.log(err);
            // console.log("Error");
        }
        if (results) {
            res.status(200).send(results);
            }
        else {
            console.log("Can't find user for profile page!");
        }
    });
    }
});


app.post('/updateProfile', checkAuth, async function (req, res) {
    console.log("Update Profile");
    // console.log(req.body.preview);
    try {
        const fileStr = req.body.preview;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
        // console.log(uploadResponse);
        req.session.uploadPublicID = uploadResponse.public_id;
        req.session.uploadURL = uploadResponse.url;
       } catch (err) {
        console.log(err);
       }

    if (!req.session.isLoggedIn) {
        console.log("User has to be logged in to update profile...");
    } else {
    users.findOneAndUpdate({ email: req.session.uemail }, 
        { $set : 
            {   name: req.body.name,
                add1: req.body.add1,
                add2: req.body.add2,
                location: req.body.location,
                state: req.body.state,
                country: req.body.country,
                nickname: req.body.nickname,
                dob: req.body.dob,
                about: req.body.about,
                email: req.body.email,
                contact: req.body.contact,
                uploadPublicID: req.session.uploadPublicID,
                uploadURL: req.session.uploadURL }
        }, function(err, results) {
        if(err) {
            res.send({err: err});
            console.log(err);
            // console.log("Error");
        }
        if (results) {
            console.log('Updated Profile Successfully!');
            res.send(results);
        }
        else {
            console.log("No results found");
            }
        });
    }
  });


app.post('/updateordProfile', checkAuth, (req, res) => {
    console.log('Update profile')
    console.log(req.body);
    const {name, add1, add2, email, contact } = req.body;
    if (!req.session.isLoggedIn) {
        console.log("User has to be logged in to update profile...");
    } else {
            users.findOneAndUpdate({ email: req.session.uemail }, 
                { $set : 
                    {   name: req.body.name,
                        add1: req.body.add1,
                        add2: req.body.add2,
                        email: req.body.email,
                        contact: req.body.contact }
                }, 
            (err, results) => {
            if (err) {
                throw err;
            } else {
                console.log('Updated Profile Successfully!');
                res.send(results);
            }
        });
    }
  });

app.get('/resAddItems', checkAuthR, (req,res) => {
  console.log("Res Menu")
  if (req.session.isLoggedIn) {
      menus.find({email: req.session.remail}, function (err, results) {
          if (err) {
              throw err;
          } else if (results) {
              res.send(results);
          } else {
              console.log("Can't find owner's menu!");
          }
      });
  } else {
      console.log("Log in to add menu!");
  }
})


app.post('/addMenu', checkAuthR, async function (req, res) {

    try {
        const fileStr = req.body.preview;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
        // console.log(uploadResponse);
        req.session.uploadPublicID = uploadResponse.public_id;
        req.session.uploadURL = uploadResponse.url;
       } catch (err) {
        console.log(err);
       }
    
    var newItem = new menus({
        p_name: req.body.p_name,
        p_ingredients: req.body.p_ingredients,
        p_description: req.body.p_description,
        p_category: req.body.p_category,
        p_type: req.body.p_type,
        p_price: req.body.p_price,
        email: req.session.remail,
        uploadPublicID: req.session.uploadPublicID,
        uploadURL: req.session.uploadURL,
    })

    console.log("Rest Add items");
    if (!req.session.isLoggedIn) {
              console.log("Please log in first!");
    } else { 
        newItem.save(function (err, results){
            if (err) {
                console.log(err);
                console.log("error");
            }
            else {
                res.send(results);
                console.log(results);
                }
            })
            }
});


app.post('/editmenu', checkAuthR, (req, res) => {
  console.log('Res Edit Item')
  const {p_id} = req.body;
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      menus.find({email: req.session.remail, p_id: p_id}, (err, results) => {
          if (err) {
              throw err;
          } else {
                  console.log(results);
                  req.session.p_id = results[0].p_id;
                  console.log(req.session.p_id);
                  res.sendStatus(200);
              };
          });
  }
})

app.get('/resEditMenu', checkAuthR, (req, res) => {
  console.log('Res Edit Item')
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      menus.find({email: req.session.remail, p_id: req.session.p_id}, (err, results) => {
          if (err) {
              throw err;
          } else {
                  console.log(results);
                  res.status(200).send(results);
              };
          });
  }
})


app.post('/resupdateMenu', checkAuthR, async function (req, res) {
    console.log("Update Menu");
    try {
        const fileStr = req.body.preview;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
        // console.log(uploadResponse);
        req.session.uploadPublicID = uploadResponse.public_id;
        req.session.uploadURL = uploadResponse.url;
       } catch (err) {
        console.log(err);
       }

    if (!req.session.isLoggedIn) {
        console.log("User has to be logged in to update profile...");
    } else {
        menus.findOneAndUpdate({ email: req.session.remail, p_id: req.session.p_id }, 
          { $set : 
            {   p_name: req.body.p_name,
                p_ingredients: req.body.p_ingredients,
                p_description: req.body.p_description,
                p_category: req.body.p_category,
                p_type: req.body.p_type,
                p_price: req.body.p_price,
                uploadPublicID: req.session.uploadPublicID,
                uploadURL: req.session.uploadURL }
        }, function (err, results) {
        if(err) {
            res.send({err: err});
            console.log(err);
            // console.log("Error");
        }
        if (results) {
            console.log('Updated Menu Successfully!');
            res.send(results);
        }
        else {
            console.log("No results found");
            }
        });
    }
  });


app.get('/allrest', (req, res) => {
  console.log('User Homepage')
    restaurants.find({}, (err, results) => {
      if (err) {
          throw err;
      } else if (results) {
        //   console.log(results);
            res.send(results);
      } else {
          console.log("Can't find restaurants!");
        }
      });
  })

app.post('/searchItem', async (req, res) => {
//   console.log(req.body);
  console.log("INSIDE SEARCH")
    restaurants.aggregate([{"$lookup": {
        "from": "menus",
        "localField": "email",
        "foreignField": "email",
        as: "Search"
    }},
    {"$unwind": "$Search"},
    {"$match": {$and: [{"$or": [{location: req.body.inSearch}, {name: req.body.inSearch}, {"Search.p_name": req.body.inSearch}, {"Search.p_category": req.body.inSearch}]}, {"$or": [{delivery: req.body.inDelivery}, {pickup: req.body.inDelivery}]}, {"Search.p_type": req.body.inV}]}}, 
    {"$project": {"_id": 0, "name": 1, "location": 1, "description": 1, "contact": 1, "timings": 1, "uploadURL": 1, "email": 1, "Search.email": 1}},
    {"$group": {_id: {name: "$name", location: "$location",  description: "$description", contact: "$contact", timings: "$timings", uploadURL: "$uploadURL", email: "$Search.email"}}},
    {"$replaceRoot": {newRoot: '$_id'}}],
    (err, results) => {
        if(err) {
            console.log(err);
        }
        else if(results) {
        // console.log(results);
        res.send(results);
        }
        else {
        console.log("Can't find any menus for this item!");
        }
    });
});

app.post('/searchOI', async (req, res) => {
  console.log("INSIDE SEARCH ITEM OI")
  restaurants.aggregate([{"$lookup": {
    "from": "menus",
    "localField": "email",
    "foreignField": "email",
    as: "Search"
    }},
    {"$unwind": "$Search"},
    {"$match": {"$or": [{location: req.body.inSer}, {name: req.body.inSer}, {"Search.p_name": req.body.inSer}, {"Search.p_category": req.body.inSer}]}}, 
    {"$project": {"_id": 0, "name": 1, "location": 1, "description": 1, "contact": 1, "timings": 1, "uploadURL": 1, "email": 1, "Search.email": 1}},
    {"$group": {_id: {name: "$name", location: "$location",  description: "$description", contact: "$contact", timings: "$timings", uploadURL: "$uploadURL", email: "$Search.email"}}},
    {"$replaceRoot": {newRoot: '$_id'}}], (err, results) => {
          if (err) {
              throw err;
          } else if (results) {
             res.send(results);
          } else {
              res.sendStatus(404);
              console.log("Can't find any menus for this item!");
          }
      });
  });

app.post('/sr', (req, res) => {
  console.log(req.body.email);
  req.session.remail = req.body.email;
  console.log("INSIDE Rest")
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      res.sendStatus(200);
  }
})

app.post('/markfavourite', checkAuth, (req, res) => {
  console.log("Favourite")
  var newFav = new favourites({
    user_email: req.session.uemail,
    owner_email: req.body.email
})
  console.log(req.body);
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      newFav.save((err, results) => {
          if (err) {
              res.sendStatus(201);
          } else {
              res.sendStatus(200);
              console.log("Added to Favourites!");
          }
      });
  }
})

app.get('/getFavourites', checkAuth, (req, res) => {
  console.log('Get Favourites');
  console.log(req.session.uemail);
  if (!req.session.isLoggedIn) {
      res.sendStatus(404);
  } else {
    restaurants.aggregate([{"$lookup": {
        "from": "favourites",
        "localField": "email",
        "foreignField": "owner_email",
        as: "Search"
        }},
        {"$unwind": "$Search"},
        {"$match": {"Search.user_email": req.session.uemail}},
        {"$project": {"_id": 0, "name": 1, "location": 1, "description": 1, "contact": 1, "timings": 1, "uploadURL": 1, "email": 1, "Search.owner_email": 1}},
        {"$group": {_id: {name: "$name", location: "$location",  description: "$description", contact: "$contact", timings: "$timings", uploadURL: "$uploadURL", email: "$Search.owner_email"}}},
        {"$replaceRoot": {newRoot: '$_id'}}], 
        (err, results) => {
          if (err) {
              throw err;
          } else if (results) {
              console.log(results);
              res.status(200).send(results);
          } else {
              console.log("No Favourites");
          }
      });
  }
});

app.get('/getOwnerID', (req,res) => {
  res.send(req.session.remail);
})

app.get('/sr', (req,res) => {
  console.log("Res Menu")
  if (req.session.isLoggedIn) {
      menus.find({email: req.session.remail}, (err, results) => {
          if (err) {
              throw err;
          } else if (results) {
              res.send(results);
          } else {
              console.log("Can't find Res menu!");
          }
      });
  } else {
      console.log("Log in to see menu!");
  }
})

app.post('/deletefromfav', checkAuth, (req, res) => {
  console.log("Delete from fav")
  const {email} = req.body;
  console.log(req.body);
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      favourites.findOneAndDelete({owner_email: email}, {user_email: req.session.uemail}, (err, results) => {
          if (err) {
              throw err;
          } else {
              res.sendStatus(200);
              console.log("Deleted from cart!");
          }
      });
  }
})

app.get('/sr1', (req,res) => {
  console.log("Res 1")
  if (req.session.isLoggedIn) {
      restaurants.find({email: req.session.remail}, (err, results) => {
          if (err) {
              throw err;
          } else if (results) {
              res.send(results);
          } else {
              console.log("Can't find Res menu!");
          }
      });
  } else {
      console.log("Log in to add menu!");
  }
})


app.post('/addToCart',  checkAuth, (req, res) => {
  console.log("Add Cart")
  const {p_id, price} = req.body;
  console.log(req.body);
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
    var newCart = new carts({
        po_id: p_id,
        price: price,
        user_email: req.session.uemail,
        owner_email: req.session.remail,
    })
    newCart.save((err, results) => {
        if (err) {
            throw err;
        } else {
            res.sendStatus(200);
            console.log("Added to cart!");
        }
    });
  }
})

app.post('/updatequantity',  checkAuth, (req, res) => {
  console.log("Update Quantity")
  const {po_id, quantity} = req.body;
  console.log(req.body);
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
    carts.findOneAndUpdate({ user_email: req.session.uemail, po_id:  po_id}, 
        { $set : 
            {quantity: req.body.quantity}
        }, function(err, results) {
          if (err) {
              throw err;
          } else {
              res.sendStatus(200);
              console.log("Updated Quantity!");
          }
      });
  }
})

app.get('/getCart',  checkAuth, async (req, res) => {
  console.log('Get Cart')
  if (!req.session.isLoggedIn) {
      res.sendStatus(404);
  } else {
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
        {"$match": {"user_email": req.session.uemail}},
        {"$project": {"_id": 0, "po_id": 1, "Search1.name": 1, "quantity": 1, "Search.p_name": 1, "Search.p_category": 1, "Search.p_price": 1}},
        {"$group": {_id: {po_id: "$po_id", name: "$Search1.name",  quantity: "$quantity", p_name: "$Search.p_name", p_category: "$Search.p_category", p_price: "$Search.p_price"}}},
        {"$replaceRoot": {newRoot: '$_id'}}], 
        (err, results) => 
        {
          if (err) {
              throw err;
          } else if (results) {
            // console.log(results);
            res.send(results);
          } else {
              console.log("No Cart Items");
            //   res.send(results);
          }
      });
  }
});

app.get('/getPrice', checkAuth, (req, res) => {
  console.log('Find Price')
  if (!req.session.isLoggedIn) {
      res.sendStatus(404);
  } else {
        carts.find({user_email: req.session.uemail},(err, results) => {
          if (err) {
              throw err;
          } else if (results) {
            //   console.log(results);
            // console.log(results.quantity);
            // console.log(results[0].quantity);
            // console.log(results.length);
            fr = 0;
            for (let i=0; i<results.length; i++){
                fp = parseFloat(results[i].quantity) * parseFloat(results[i].price);
                // console.log(fp);
                fr += fp;
                // console.log(fr);
            }
            // results = fr;
            senRes = {total_price: fr};
            // console.log(senRes);
            res.status(200).send(senRes);
          } else {
              console.log("Nothing's added to cart!");
          }
      });
  }
});

app.get('/getUserDeets', checkAuth, (req, res) => {
  console.log('Get User Details');
  console.log(req.session.uemail);
  if (!req.session.isLoggedIn) {
      res.sendStatus(404);
  } else {
      users.findOne({email: req.session.uemail},
        (err, results) => {
          if (err) {
              throw err;
          } else if (results) {
              console.log(results);
              res.status(200).send(results);
          } else {
              console.log("No User Found!");
          }
      });
  }
});

app.post('/deletefromcart', (req, res) => {
  console.log("Delete from cart")
//   const {po_id} = req.body;
  console.log(req.body);
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      carts.findOneAndDelete({po_id: req.body.po_id, user_email: req.session.uemail},
        (err, results) => {
          if (err) {
              throw err;
          } else {
              res.sendStatus(200);
              console.log("Deleted from cart!");
          }
      });
  }
})

app.post('/order', checkAuth, (req, res) => {
  console.log("Order Page")
  console.log(req.body);
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = ("0" + date_ob.getHours()).slice(-2);
  let minutes = ("0" + date_ob.getMinutes()).slice(-2);
  let ordertime = year + "-" + month + "-" + date + " " + hours + ":" + minutes;
  console.log(ordertime);
  if (!req.session.isLoggedIn) {
    console.log("Please log in first!");
  } else {
  req.body.forEach(element => {
    console.log(element.po_id);
    var newOrder = new orders({
        po_id: element.po_id,
        quantity: element.quantity,
        user_email: req.session.uemail,
        ordertime: ordertime,
        order_status: 'Ordered',
    });
    newOrder.save( 
    (err, results) => {
        if (err) {
            throw err;
        } else {
            console.log("Order Placed!");
        }
      });
  }) 
  res.sendStatus(200);
  }
    
  })

  app.post('/orderIns', checkAuth, (req, res) => {
    console.log("Sp Ins")
    const {sp_id, SpIns} = req.body[0];
    console.log(req.body);
    console.log(sp_id);
    if (!req.session.isLoggedIn) {
        console.log("Please log in first!");
    } else {
            orders.findOneAndUpdate({ user_email: req.session.uemail, po_id: sp_id}, 
                { $set : 
                    {sp_inst: SpIns}
                },
            (err, results) => {
            if (err) {
                throw err;
            } else {
                res.sendStatus(200);
                console.log("Updated Special Instructions!");
            }
        });
    }

});

  app.post('/cartorder', checkAuth, (req, res) => {
    console.log("Delete Cart after order")
    console.log(req.body);
    if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
    } else {
      carts.deleteMany({user_email: req.session.uemail}, (err, results) => {
          if (err) {
              throw err;
          } else {
              res.sendStatus(200);
              console.log("Deleted from cart, Post order!");
          }
      });
    }
      
    })

  app.get('/orderstatus', checkAuth, (req, res) => {
    console.log('order status')
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
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
                {"$match": {"user_email": req.session.uemail}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "ordertime": 1}},
                {"$group": {_id: {name: "$Search1.name",  location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", ordertime: "$ordertime"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], 
            (err, results) => {
            if (err) {
                throw err;
            } else if (results) {
                // console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered!");
            }
        });
    }
  });

  app.get('/resorderstatus', checkAuthR, (req, res) => {
    console.log('Res order status')
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
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
                {"$match": {"Search.email": req.session.remail}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.email": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "ordertime": 1}},
                {"$group": {_id: {name: "$Search1.name", email: "$Search1.email", location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", ordertime: "$ordertime"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], 
        (err, results) => {
            if (err) {
                throw err;
            } else if (results) {
                // console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.post('/filteresorders', checkAuthR, (req, res) => {
    console.log('Filter Res order status')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
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
            {"$match": {$and: [{"Search.email": req.session.remail}, {"order_status": req.body.inOS}]}},
            {"$project": {"_id": 0, "Search1.name": 1, "Search1.email": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "ordertime": 1}},
            {"$group": {_id: {name: "$Search1.name", email: "$Search1.email", location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", ordertime: "$ordertime"}}},
            {"$replaceRoot": {newRoot: '$_id'}}], 
        (err, results) => {
            if (err) {
                throw err;
            } else if (results) {
                // console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.post('/filteruorders', checkAuth, (req, res) => {
    console.log('Filter order status')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
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
                {"$match": {$and: [{"user_email": req.session.uemail}, {"order_status": req.body.inOS}]}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "ordertime": 1}},
                {"$group": {_id: {name: "$Search1.name",  location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", ordertime: "$ordertime"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], 
        (err, results) => {
            if (err) {
                throw err;
            } else if (results) {
                // console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered yet!");
            }
        });
    }
  });

  app.post('/rorderdeets', checkAuthR, (req, res) => {
    console.log('Res order status')
    console.log(req.body);
    req.session.ordertime = req.body.order_id;
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
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
            {"$match": {$and: [{"Search.email": req.session.remail}, {"ordertime": req.body.order_id}]}},
            {"$project": {"_id": 0, "Search1.name": 1, "Search1.email": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "quantity": 1, "Search.p_name": 1, "Search.p_price": 1, "Search1.add1": 1, "Search1.add2": 1, "sp_inst": 1}},
            {"$group": {_id: {name: "$Search1.name", email: "$Search1.email", location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", quantity: "$quantity", p_name: "$Search.p_name", p_price: "$Search.p_price", add1: "$Search1.add1", add2: "$Search1.add2", sp_inst: "$sp_inst"}}},
            {"$replaceRoot": {newRoot: '$_id'}}], 
        (err, results) => {
            if (err) {
                throw err;
            } else if (results) {
                // console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.get('/rorderdeets', checkAuthR, (req, res) => {
    console.log('Res order status')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
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
            {"$match": {$and: [{"Search.email": req.session.remail}, {"ordertime": req.session.ordertime}]}},
            {"$project": {"_id": 0, "Search1.name": 1, "Search1.email": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "quantity": 1, "Search.p_name": 1, "Search.p_price": 1, "Search1.add1": 1, "Search1.add2": 1, "sp_inst": 1}},
            {"$group": {_id: {name: "$Search1.name", email: "$Search1.email", location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", quantity: "$quantity", p_name: "$Search.p_name", p_price: "$Search.p_price", add1: "$Search1.add1", add2: "$Search1.add2", sp_inst: "$sp_inst"}}},
            {"$replaceRoot": {newRoot: '$_id'}}], 
        (err, results) => {
            if (err) {
                throw err;
            } else if (results) {
                // console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.post('/uorderdeets', checkAuth, (req, res) => {
    console.log('Cust order status')
    console.log(req.body);
    req.session.ordertime = req.body.order_id;
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
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
                {"$match": {$and: [{"user_email": req.session.uemail}, {"ordertime": req.body.order_id}]}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.email": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "quantity": 1, "Search.p_name": 1, "Search.p_price": 1, "Search1.add1": 1, "Search1.add2": 1, "sp_inst": 1}},
                {"$group": {_id: {name: "$Search1.name", email: "$Search1.email", location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", quantity: "$quantity", p_name: "$Search.p_name", p_price: "$Search.p_price", add1: "$Search1.add1", add2: "$Search1.add2", sp_inst: "$sp_inst"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], 
        (err, results) => {
            if (err) {
                throw err;
            } else if (results) {
                // console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.get('/uorderdeets', checkAuth, (req, res) => {
    console.log('Cust order status')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
        // let profileSQL = "SELECT u.email, u.name, u.location, u.contact, o.order_status, o.quantity, m.p_name, u.add1, u.add2, o.sp_inst, m.p_price FROM uber_eats.order as o INNER JOIN uber_eats.menu as m ON o.po_id = m.p_id INNER JOIN uber_eats.user as u ON o.user_email = u.email WHERE ordertime = ? GROUP BY 1,2,3,4,5,6,7,8,9,10;";
        // connection.query(profileSQL, [req.session.ordertime], 
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
                {"$match": {$and: [{"user_email": req.session.uemail}, {"ordertime": req.session.ordertime}]}},
                {"$project": {"_id": 0, "Search1.name": 1, "Search1.email": 1, "Search1.location": 1, "Search1.contact": 1, "order_status": 1, "quantity": 1, "Search.p_name": 1, "Search.p_price": 1, "Search1.add1": 1, "Search1.add2": 1, "sp_inst": 1}},
                {"$group": {_id: {name: "$Search1.name", email: "$Search1.email", location: "$Search1.location", contact: "$Search1.contact", order_status: "$order_status", quantity: "$quantity", p_name: "$Search.p_name", p_price: "$Search.p_price", add1: "$Search1.add1", add2: "$Search1.add2", sp_inst: "$sp_inst"}}},
                {"$replaceRoot": {newRoot: '$_id'}}], 
        (err, results) => {
            if (err) {
                throw err;
            } else if (results) {
                // console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.post('/updateordercan', checkAuth, (req, res) => {
    console.log('updateordercan')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        console.log("Log In");
    } else {
        orders.updateMany({ ordertime: req.body.order_id}, 
            { $set : 
                {order_status: 'Cancelled'}
            },
        (err, results) => {
            if (err) {
                throw err;
            } else {
                console.log('Updated Order Can Stat Successfully!');
                res.send(results);
            }
        });
    }
  });

  app.post('/resorderactions', checkAuthR, (req, res) => {
    console.log('resorderactions')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        console.log("Log In");
    } else {
        orders.updateMany({ ordertime: req.body.order_id}, 
                { $set : 
                    {order_status: req.body.actions}
                },
        (err, results) => {
            if (err) {
                throw err;
            } else {
                console.log('Updated Order Stat Successfully!');
                res.send(results);
            }
        });
    }
  });

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
// app.listen(3001, function () {
//   console.log('Server listening on port 3001!');
// });

app.listen(3001, () => console.log('Server listening on port 3001'));

module.exports = app;