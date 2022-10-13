var express = require('express');
var app = express();
app.use(express.json(({ limit: '10MB' })));
var session = require('express-session');
const {cloudinary} = require('./cloudinary')
var mysql = require('mysql');
var constants = require('./config.json');
var cors = require('cors');
var jwt = require('jsonwebtoken');
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


// var connection = mysql.createConnection({})
var connection = mysql.createPool({
  host: constants.DB.host,
  user: constants.DB.username,
  password: constants.DB.password,
  port: constants.DB.port,
  database: constants.DB.database,
  // connectionLimit: 99
});


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

connection.getConnection((err) => {
  if(err) {
    throw 'Error Occured: ' + err;
  }
  console.log("Pool Created.")
});

app.get('/test_api', async function (req, res){
  await connection.query(`SELECT * FROM test`, async function (error, results){
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

app.post('/userReg', (req, res)=> {
  const username = req.body.username
  const usercontact = req.body.contact
  const useremail = req.body.email
  const userpassword = req.body.password
  console.log("Reg here");
  console.log(username)
  if(username != '' && usercontact != '' && useremail != '' && userpassword != ''){
  connection.query("INSERT INTO uber_eats.user(name, contact, email, password) VALUES (?,?,?,?)", [username, usercontact, useremail, userpassword], 
  (err, results) => {
    if(err){
      console.log(err);
      console.log("email")
      res.json({
        "status": 1062
      });
    }
    else {
      console.log(results);
    res.send(results);
  }
  });
}
})

app.post('/login', (req, res)=> {
  const useremail = req.body.email
  const userpassword = req.body.password
  const dbUser = (useremail, userpassword)
  console.log("here");
  connection.query("SELECT email,password FROM uber_eats.user WHERE email = ? AND password = ?", [useremail, userpassword], 
  (err, results) => {
    if (err) {
      res.send({err: err});
      console.log(err);
    } 
    if (results.length > 0) {
      res.cookie('cookie',constants.DB.username,{maxAge: 900000, httpOnly: false, path : '/'});
      req.session.uemail = results[0].email;
      req.session.isLoggedIn = true;
      console.log(req.session.uemail);
      console.log(req.session.isLoggedIn);
      req.session.save();   
      let token = jwt.sign({useremail: useremail}, JWT_KEY);
      res.json({
        "status": 200,
        "token": token
      });
      res.end("Successful Login!");
      // res.send(results);
      // console.log("Idhar?")
      // req.session.dbUser = dbUser;
      // console.log(req.session.dbUser);
      // console.log(results);
      return;
    } else {
      res.json({
        "status": 403
      })
      console.log(results);
    }
  })
})

app.post('/resReg', (req, res)=> {
  const username = req.body.username
  const userlocation = req.body.location
  const useremail = req.body.email
  const userpassword = req.body.password
  console.log("Reg here");
  console.log(username)
  if(username != '' && userlocation != '' && useremail != '' && userpassword != ''){
  connection.query("INSERT INTO uber_eats.restaurant(name, email, password, location) VALUES (?,?,?,?)", [username, useremail, userpassword, userlocation], 
  (err, results) => {
    if(err){
      console.log(err);
      console.log("email")
      res.json({
        "status": 1062
      });
    }
    else {
      console.log(results);
    res.send(results);
  }
  });
}
})

app.post('/reslogin', (req, res)=> {
  const useremail = req.body.email
  const userpassword = req.body.password
  const dbUser = (useremail, userpassword)
  console.log("here");
  connection.query("SELECT email,password FROM uber_eats.restaurant WHERE email = ? AND password = ?", [useremail, userpassword], 
  (err, results) => {
    if (err) {
      res.send({err: err});
      console.log("Error");
    } 
    if (results.length > 0) {
      res.cookie('cookie',constants.DB.username,{maxAge: 900000, httpOnly: false, path : '/'});
      req.session.remail = results[0].email;
      req.session.isLoggedIn = true;
      console.log(req.session.remail);
      console.log(req.session.isLoggedIn);
      req.session.save();   
      let token = jwt.sign({useremail: useremail}, JWT_KEY);
      res.json({
        "status": 200,
        "token": token
      });
      res.end("Successful Login!");
      // res.send(results);
      // console.log("Idhar?")
      // req.session.dbUser = dbUser;
      // console.log(req.session.dbUser);
      // console.log(results);
      return;
    } else {
      res.json({
        "status": 403
      })
      console.log("Error1");
    }
  })
})



app.get('/resProfile', (req, res) => {
  console.log('Res Profile')
  console.log(req.session);
  if (!req.session.isLoggedIn) {
      res.sendStatus(404);
      console.log("Not Logged In");
  } else {
      let profileSQL = "SELECT * FROM uber_eats.restaurant WHERE email = ?";
      connection.query(profileSQL, [req.session.remail], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              console.log(results);
              res.status(200).send(results);
          } else {
              console.log("Can't find user for profile page!");
          }
      });
  }
});

app.post('/resupdateProfile', async (req, res) => {
  console.log('Res Update profile')
  console.log(req.body);
  try {
    const fileStr = req.body.preview;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
    console.log(uploadResponse);
    req.session.uploadPublicID = uploadResponse.public_id;
    req.session.uploadURL = uploadResponse.url;
   } catch (err) {
    console.log(err);
   }

   console.log(req.session.uploadPublicID);
   console.log(req.session.uploadURL);

  const {name, location, description, contact, timing, delivery, pickup } = req.body;
  if (!req.session.isLoggedIn) {
      console.log("User has to be logged in to update profile...");
  } else {
      let updateProfile = "UPDATE uber_eats.restaurant " + "SET name = ?, location = ?, description = ?, contact = ?, timings = ?, delivery = ?, pickup = ?, uploadPublicID = ?, uploadURL = ? WHERE email = ?";
      connection.query(updateProfile, [name, location, description, contact, timing, delivery, pickup, req.session.uploadPublicID, req.session.uploadURL, req.session.remail], (err, results) => {
          if (err) {
              throw err;
          } else {
              console.log('Updated Profile Successfully!');
              res.send(results);
          }
      });
  }
});

app.get('/userProfile', (req, res) => {
  console.log('user Profile')
  console.log(req.session);
  if (!req.session.isLoggedIn) {
      res.sendStatus(404);
      console.log("Not Logged In");
  } else {
      let profileSQL = "SELECT * FROM uber_eats.user WHERE email = ?";
      connection.query(profileSQL, [req.session.uemail], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              console.log(results);
              res.status(200).send(results);
          } else {
              console.log("Can't find user for profile page!");
          }
      });
  }
});

app.post('/updateProfile', async (req, res) => {
  console.log('Update profile')
  try {
      const fileStr = req.body.preview;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
      console.log(uploadResponse);
      req.session.uploadPublicID = uploadResponse.public_id;
      req.session.uploadURL = uploadResponse.url;
  } catch (err) {
      console.log(err);
  }

  console.log(req.session.uploadPublicID);
  console.log(req.session.uploadURL);

  const {name, add1, add2, location, state, country, nickname, dob, about, email, contact } = req.body;
  if (!req.session.isLoggedIn) {
      console.log("User has to be logged in to update profile...");
  } else {
      let updateProfile = "UPDATE uber_eats.user " + "SET name = ?, add1= ?, add2= ?, location = ?, state = ?, country = ?, nickname = ?, dob = ?, about = ?, email = ?, contact = ?, uploadPublicID = ?, uploadURL = ? WHERE email = ?";
      connection.query(updateProfile, [name, add1, add2, location, state, country, nickname, dob, about, email, contact, req.session.uploadPublicID, req.session.uploadURL, req.session.uemail], (err, results) => {
          if (err) {
              throw err;
          } else {
              console.log('Updated Profile Successfully!');
              res.send(results);
          }
      });
  }
});

app.post('/updateordProfile', (req, res) => {
    console.log('Update profile')
    console.log(req.body);
    const {name, add1, add2, location, state, country, nickname, dob, about, email, contact } = req.body;
    if (!req.session.isLoggedIn) {
        console.log("User has to be logged in to update profile...");
    } else {
        let updateProfile = "UPDATE uber_eats.user " + "SET name = ?, add1= ?, add2= ?, email = ?, contact = ? WHERE email = ?";
        connection.query(updateProfile, [name, add1, add2, email, contact, req.session.uemail], (err, results) => {
            if (err) {
                throw err;
            } else {
                console.log('Updated Profile Successfully!');
                res.send(results);
            }
        });
    }
  });

app.get('/resAddItems', (req,res) => {
  console.log("Res Menu")
  if (req.session.isLoggedIn) {
      let ownerMenu = "SELECT * FROM menu WHERE email = ?";
      connection.query(ownerMenu, [req.session.remail], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              res.send(results);
          } else {
              console.log("Can't find owner's menu!");
          }
      });
  } else {
      console.log("Log in to add menu!");
  }
})

app.post('/addMenu', async (req, res) => {
  console.log('Res Add Item')
  try {
    const fileStr = req.body.preview;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
    console.log(uploadResponse);
    req.session.uploadPublicID = uploadResponse.public_id;
    req.session.uploadURL = uploadResponse.url;
  } catch (err) {
    console.log(err);
  }

  const {p_id, p_name, p_ingredients, p_description, p_category, p_type, p_price, preview} = req.body;
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      let findItem = "SELECT p_id FROM menu WHERE email = ? AND p_id = ?";
      connection.query(findItem, [req.session.remail, p_id], (err, results) => {
          if (err) {
              throw err;
          } else {
              let insertItem = "INSERT INTO menu " + "SET p_name = ?, p_ingredients = ?, p_description = ?, p_category = ?, p_type = ?, p_price = ?, uploadPublicID = ?, uploadURL = ?, email = ?";
              connection.query(insertItem, [p_name, p_ingredients, p_description, p_category, p_type, p_price, req.session.uploadPublicID, req.session.uploadURL, req.session.remail], (err, results) => {
                  if(err) throw err;
                  console.log(results);
              });
          }
      });
      res.sendStatus(200);
  }
})

app.post('/editmenu', (req, res) => {
  console.log('Res Edit Item')
  const {p_id} = req.body;
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      let findItem = "SELECT p_id FROM menu WHERE email = ? AND p_id = ?";
      connection.query(findItem, [req.session.remail, p_id], (err, results) => {
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

app.get('/resEditMenu', (req, res) => {
  console.log('Res Edit Item')
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      let findItem = "SELECT * FROM menu WHERE email = ? AND p_id = ?";
      connection.query(findItem, [req.session.remail, req.session.p_id], (err, results) => {
          if (err) {
              throw err;
          } else {
                  console.log(results);
                  res.status(200).send(results);
              };
          });
  }
})

app.post('/resupdateMenu', async (req, res) => {
  console.log('Update Menu')
  try {
    const fileStr = req.body.preview;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'sushan_ubereats'});
    console.log(uploadResponse);
    req.session.uploadPublicID = uploadResponse.public_id;
    req.session.uploadURL = uploadResponse.url;
  } catch (err) {
    console.log(err);
  }
  console.log(req.body);
  const {p_name, p_ingredients, p_description, p_category, p_type, p_price} = req.body;
  if (!req.session.isLoggedIn) {
      console.log("User has to be logged in to update profile...");
  } else {
      let updateProfile = "UPDATE uber_eats.menu " + "SET p_name = ?, p_ingredients = ?, p_description = ?, p_category = ?, p_type = ?, p_price = ?, uploadPublicID = ?, uploadURL = ? WHERE email = ? AND p_id = ?";
      connection.query(updateProfile, [p_name, p_ingredients, p_description, p_category, p_type, p_price, req.session.uploadPublicID, req.session.uploadURL, req.session.remail, req.session.p_id], (err, results) => {
          if (err) {
              throw err;
          } else {
              console.log('Updated Profile Successfully!');
              res.send(results);
          }
      });
  }
});

app.get('/allrest', (req, res) => {
  console.log('user home')
  let profileSQL = "SELECT * FROM uber_eats.restaurant";
    connection.query(profileSQL, (err, results) => {
      if (err) {
          throw err;
      } else if (results.length > 0) {
          console.log(results);
            res.send(results);
      } else {
          console.log("Can't find restaurants!");
        }
      });
  })

app.post('/searchItem', async (req, res) => {
//   console.log(req.body);
  console.log("INSIDE SEARCH ITEM")
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      //find restaurants for the owner who has this item on the menu
      let findRestaurant = "SELECT r.name, r.location, r.description, r.contact, r.timings, r.uploadURL, m.email FROM menu m RIGHT JOIN restaurant r ON m.email = r.email WHERE ((m.p_name = ?) OR (r.location = ?) OR (m.p_category = ?) OR (r.name = ?)) AND (r.delivery = ? OR r.pickup = ?) AND (m.p_type = ?) GROUP BY name, m.email";
      connection.query(findRestaurant, [req.body.inSearch, req.body.inSearch, req.body.inSearch, req.body.inSearch, req.body.inDelivery, req.body.inDelivery, req.body.inV], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              console.log(results);
              // req.session.remail = results[0].email
              res.send(results);
          } else {
              res.sendStatus(404);
              console.log("Can't find any menus for this item!");
          }
      });
  }
})

app.post('/searchOI', async (req, res) => {
  console.log("INSIDE SEARCH ITEM OI")
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      //find restaurants for the owner who has this item on the menu
      let findRestaurant = "SELECT r.name, r.location, r.description, r.contact, r.timings, r.uploadURL, m.email FROM uber_eats.menu m RIGHT JOIN uber_eats.restaurant r ON m.email = r.email WHERE ((m.p_name = ?) OR (r.location = ?) OR (m.p_category = ?) OR (r.name = ?)) GROUP BY name, m.email";
      connection.query(findRestaurant, [req.body.inSer, req.body.inSer, req.body.inSer, req.body.inSer], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              console.log(results);
              // req.session.remail = results[0].email
              res.send(results);
          } else {
              res.sendStatus(404);
              console.log("Can't find any menus for this item!");
          }
      });
  }
})

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

app.post('/markfavourite', (req, res) => {
  console.log("Favourite")
  const femail = req.body.email;
  console.log(req.body);
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      let ownerMenu = "INSERT INTO favourites " + "SET user_email = ?, owner_email = ?";
      connection.query(ownerMenu, [req.session.uemail, femail], (err, results) => {
          if (err) {
              res.sendStatus(201);
          } else {
              res.sendStatus(200);
              console.log("Added to Favourites!");
          }
      });
  }
})

app.get('/getFavourites', (req, res) => {
  console.log('Get Favourites')
  if (!req.session.isLoggedIn) {
      res.sendStatus(404);
  } else {
      let profileSQL = "SELECT r.id, r.name, r.email, r.location, r.timings, r.uploadURL FROM restaurant as r INNER JOIN favourites as f ON r.email=f.owner_email WHERE user_email = ?";
      connection.query(profileSQL, [req.session.uemail], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
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
      let ownerMenu = "SELECT * FROM menu WHERE email = ?";
      connection.query(ownerMenu, [req.session.remail], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              res.send(results);
          } else {
              console.log("Can't find Res menu!");
          }
      });
  } else {
      console.log("Log in to add menu!");
  }
})

app.post('/deletefromfav', (req, res) => {
  console.log("Delete from fav")
  const {email} = req.body;
  console.log(req.body);
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      let ownerMenu = "DELETE FROM favourites WHERE owner_email = ? AND user_email = ?";
      connection.query(ownerMenu, [email, req.session.uemail], (err, results) => {
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
  console.log("Res Menu")
  if (req.session.isLoggedIn) {
      let ownerMenu = "SELECT * FROM restaurant WHERE email = ?";
      connection.query(ownerMenu, [req.session.remail], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              res.send(results);
          } else {
              console.log("Can't find Res menu!");
          }
      });
  } else {
      console.log("Log in to add menu!");
  }
})

app.post('/filter', (req, res) => {
  console.log("Filter")
  if (req.session.isLoggedIn) {
      let findRestaurant = "SELECT * FROM restaurant r LEFT JOIN menu m ON r.email = m.email WHERE m.p_type = 'Veg' GROUP BY name";
      connection.query(findRestaurant, (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              console.log(results);
              res.send(results);
          } else {
              console.log("Can't find any Veg!");
          }
      });
  } else {
      console.log("Please log in first!");
  }
})

app.post('/addToCart', (req, res) => {
  console.log("Add Cart")
  const {p_id, price} = req.body;
  console.log(req.body);
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      let ownerMenu = "INSERT INTO cart " + "SET po_id = ?, price = ?, user_email = ?, owner_email = ?";
      connection.query(ownerMenu, [p_id, price, req.session.uemail, req.session.remail], (err, results) => {
          if (err) {
              throw err;
          } else {
              res.sendStatus(200);
              console.log("Added to cart!");
          }
      });
  }
})

app.post('/updatequantity', (req, res) => {
  console.log("Update Quantity")
  const {po_id, quantity} = req.body;
  console.log(req.body);
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      let ownerMenu = "UPDATE cart " + "SET quantity = ? WHERE user_email = ? AND po_id = ?;";
      connection.query(ownerMenu, [quantity, req.session.uemail, po_id], (err, results) => {
          if (err) {
              throw err;
          } else {
              res.sendStatus(200);
              console.log("Updated Quantity!");
          }
      });
  }
})

app.get('/getCart', (req, res) => {
  console.log('Get Cart')
  if (!req.session.isLoggedIn) {
      res.sendStatus(404);
  } else {
      let profileSQL = "SELECT po_id, r.name, c.quantity, p_name, p_category, p_price FROM cart as c LEFT JOIN menu as m ON m.p_id=c.po_id INNER JOIN restaurant as r ON r.email = c.owner_email WHERE user_email = ?";
      connection.query(profileSQL, [req.session.uemail], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              console.log(results);
              res.status(200).send(results);
          } else {
              console.log("No Cart Items");
              res.send(results);
          }
      });
  }
});

app.get('/getPrice', (req, res) => {
  console.log('Find Price')
  if (!req.session.isLoggedIn) {
      res.sendStatus(404);
  } else {
      let profileSQL = "SELECT SUM(overallprice) AS total_price FROM cart WHERE user_email = ?";
      connection.query(profileSQL, [req.session.uemail], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              console.log(results);
              res.status(200).send(results);
          } else {
              console.log("Nothing's added to cart!");
          }
      });
  }
});

app.get('/getUserDeets', (req, res) => {
  console.log('Get User Details')
  if (!req.session.isLoggedIn) {
      res.sendStatus(404);
  } else {
      let profileSQL = "SELECT id, name, contact, email, add1, add2 FROM user WHERE email = ?";
      connection.query(profileSQL, [req.session.uemail], (err, results) => {
          if (err) {
              throw err;
          } else if (results.length > 0) {
              console.log(results);
              res.status(200).send(results);
          } else {
              console.log("No Cart Items");
          }
      });
  }
});

app.post('/deletefromcart', (req, res) => {
  console.log("Delete from cart")
  const {po_id} = req.body;
  console.log(req.body);
  if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
  } else {
      let ownerMenu = "DELETE FROM cart WHERE po_id = ? AND user_email = ?";
      connection.query(ownerMenu, [po_id, req.session.uemail], (err, results) => {
          if (err) {
              throw err;
          } else {
              res.sendStatus(200);
              console.log("Deleted from cart!");
          }
      });
  }
})

app.post('/order', (req, res) => {
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
    let ownerMenu = "INSERT INTO uber_eats.order " + "SET po_id = ?, user_email = ?, quantity = ?,  ordertime = ?, order_status = ?";
    connection.query(ownerMenu, [element.po_id, req.session.uemail, element.quantity, ordertime, 'Ordered'], (err, results) => {
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

  app.post('/orderIns', (req, res) => {
    console.log("Sp Ins")
    const {sp_id, SpIns} = req.body[0];
    console.log(req.body.sp_id);
    console.log(sp_id);
    if (!req.session.isLoggedIn) {
        console.log("Please log in first!");
    } else {
        let ownerMenu = "UPDATE uber_eats.order " + "SET sp_inst = ? WHERE user_email = ? AND po_id = ?;";
        connection.query(ownerMenu, [SpIns, req.session.uemail, sp_id], (err, results) => {
            if (err) {
                throw err;
            } else {
                res.sendStatus(200);
                console.log("Updated Quantity!");
            }
        });
    }
  })

  app.post('/cartorder', (req, res) => {
    console.log("Order Page")
    console.log(req.body);
    if (!req.session.isLoggedIn) {
      console.log("Please log in first!");
    } else {
      let ownerMenu = "DELETE FROM cart WHERE user_email = ?";
      connection.query(ownerMenu, [req.session.uemail], (err, results) => {
          if (err) {
              throw err;
          } else {
              res.sendStatus(200);
              console.log("Deleted from cart!");
          }
      });
    }
      
    })

  app.get('/orderstatus', (req, res) => {
    console.log('order status')
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
        let profileSQL = "SELECT r.name, r.location, r.contact, o.order_status, o.ordertime FROM uber_eats.order as o INNER JOIN uber_eats.menu as m ON o.po_id = m.p_id INNER JOIN uber_eats.restaurant as r ON m.email = r.email WHERE o.user_email = ? GROUP BY 1,2,3,4,5;";
        connection.query(profileSQL, [req.session.uemail], (err, results) => {
            if (err) {
                throw err;
            } else if (results.length > 0) {
                console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's added to cart!");
            }
        });
    }
  });

  app.get('/resorderstatus', (req, res) => {
    console.log('Res order status')
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
        let profileSQL = "SELECT u.email, u.name, u.location, u.contact, o.order_status, o.ordertime FROM uber_eats.order as o INNER JOIN uber_eats.menu as m ON o.po_id = m.p_id INNER JOIN uber_eats.user as u ON o.user_email = u.email WHERE m.email = ? GROUP BY 1,2,3,4,5,6;";
        connection.query(profileSQL, [req.session.remail], (err, results) => {
            if (err) {
                throw err;
            } else if (results.length > 0) {
                console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.post('/filteresorders', (req, res) => {
    console.log('Filter Res order status')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
        let profileSQL = "SELECT u.email, u.name, u.location, u.contact, o.order_status, o.ordertime FROM uber_eats.order as o INNER JOIN uber_eats.menu as m ON o.po_id = m.p_id INNER JOIN uber_eats.user as u ON o.user_email = u.email WHERE m.email = ? AND order_status = ? GROUP BY 1,2,3,4,5,6;";
        connection.query(profileSQL, [req.session.remail, req.body.inOS], (err, results) => {
            if (err) {
                throw err;
            } else if (results.length > 0) {
                console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.post('/filteruorders', (req, res) => {
    console.log('Filter Res order status')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
        let profileSQL = "SELECT r.name, r.location, r.contact, o.order_status, o.ordertime FROM uber_eats.order as o INNER JOIN uber_eats.menu as m ON o.po_id = m.p_id INNER JOIN uber_eats.restaurant as r ON m.email = r.email WHERE o.user_email = ? AND order_status = ? GROUP BY 1,2,3,4,5;";
        connection.query(profileSQL, [req.session.uemail, req.body.inOS], (err, results) => {
            if (err) {
                throw err;
            } else if (results.length > 0) {
                console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.post('/rorderdeets', (req, res) => {
    console.log('Res order status')
    console.log(req.body);
    req.session.ordertime = req.body.order_id;
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
        let profileSQL = "SELECT u.email, u.name, u.location, u.contact, o.order_status, o.quantity, m.p_name, u.add1, u.add2, o.sp_inst, m.p_price FROM uber_eats.order as o INNER JOIN uber_eats.menu as m ON o.po_id = m.p_id INNER JOIN uber_eats.user as u ON o.user_email = u.email WHERE m.email = ? AND ordertime= ? GROUP BY 1,2,3,4,5,6,7,8,9,10;";
        connection.query(profileSQL, [req.session.remail, req.body.order_id], (err, results) => {
            if (err) {
                throw err;
            } else if (results.length > 0) {
                console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.get('/rorderdeets', (req, res) => {
    console.log('Res order status')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
        let profileSQL = "SELECT u.email, u.name, u.location, u.contact, o.order_status, o.quantity, m.p_name, u.add1, u.add2, o.sp_inst, m.p_price FROM uber_eats.order as o INNER JOIN uber_eats.menu as m ON o.po_id = m.p_id INNER JOIN uber_eats.user as u ON o.user_email = u.email WHERE m.email = ? AND ordertime = ? GROUP BY 1,2,3,4,5,6,7,8,9,10;";
        connection.query(profileSQL, [req.session.remail, req.session.ordertime], (err, results) => {
            if (err) {
                throw err;
            } else if (results.length > 0) {
                console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.post('/uorderdeets', (req, res) => {
    console.log('Cust order status')
    console.log(req.body);
    req.session.ordertime = req.body.order_id;
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
        let profileSQL = "SELECT u.name, u.location, u.contact, o.order_status, o.quantity, m.p_name, u.add1, u.add2, o.sp_inst, m.p_price FROM uber_eats.order as o INNER JOIN uber_eats.menu as m ON o.po_id = m.p_id INNER JOIN uber_eats.user as u ON o.user_email = u.email WHERE ordertime = ? GROUP BY 1,2,3,4,5,6,7,8,9,10;";
        connection.query(profileSQL, [req.session.ordertime], (err, results) => {
            if (err) {
                throw err;
            } else if (results.length > 0) {
                console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.get('/uorderdeets', (req, res) => {
    console.log('Cust order status')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
    } else {
        let profileSQL = "SELECT u.email, u.name, u.location, u.contact, o.order_status, o.quantity, m.p_name, u.add1, u.add2, o.sp_inst, m.p_price FROM uber_eats.order as o INNER JOIN uber_eats.menu as m ON o.po_id = m.p_id INNER JOIN uber_eats.user as u ON o.user_email = u.email WHERE ordertime = ? GROUP BY 1,2,3,4,5,6,7,8,9,10;";
        connection.query(profileSQL, [req.session.ordertime], (err, results) => {
            if (err) {
                throw err;
            } else if (results.length > 0) {
                console.log(results);
                res.status(200).send(results);
            } else {
                console.log("Nothing's ordered from this restaurant!");
            }
        });
    }
  });

  app.post('/updateordercan', (req, res) => {
    console.log('updateordercan')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        console.log("Log In");
    } else {
        let updateProfile = "UPDATE uber_eats.order " + "SET order_status = ? WHERE ordertime = ?";
        connection.query(updateProfile, ['Cancelled', req.body.order_id], (err, results) => {
            if (err) {
                throw err;
            } else {
                console.log('Updated Order Stat Successfully!');
                res.send(results);
            }
        });
    }
  });

  app.post('/resorderactions', (req, res) => {
    console.log('resorderactions')
    console.log(req.body);
    if (!req.session.isLoggedIn) {
        console.log("Log In");
    } else {
        let updateProfile = "UPDATE uber_eats.order " + "SET order_status = ? WHERE ordertime = ?";
        connection.query(updateProfile, [req.body.actions, req.body.order_id], (err, results) => {
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