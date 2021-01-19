const express = require('express');
const session = require("express-session");
const fs = require("fs");
const router = express.Router();
let usersData = require('../usersData.json');

router.use(
  session({
    secret: "itsSecret",
    resave: false,
    saveUninitialized: true
  })
);

router.post('/', (req, res) =>{
  console.log(usersData);
})

// Register user
router.post('/register', (req, res) =>{
  let isThere = false;
  const newUser = {
    username: req.body.username,
    password: req.body.password
  }
  for ( let i = 0; i < usersData.length; i++ ) {
    if ( newUser.username === usersData[i].username ) {
      isThere = true
      break;
    } 
  }
  if (isThere) {
    return res.send(`Hi ${req.body.username}, this username already exists`);
  } else {
    usersData.push(newUser);
    fs.writeFile('usersData.json', JSON.stringify(usersData), err => {
      if (err) console.log(err);
    })
    return res.send(`Thanks for registring with us, Please login for better experince..`);
  }
});

// Login
router.post('/login', (req, res) =>{
  for ( let i = 0; i < usersData.length; i++ ) {
    if ( req.body.username === usersData[i].username ) {
      if ( req.body.password === usersData[i].password ) {
        req.session.username = req.body.username;
        return res.send(`Hi ${req.body.username}, Welcome to dashboard, Now tell us something about you..`);
      } else res.send(`Please check login credentials..`)
    } else res.send(`${req.body.username} not exists, Please register..`)
  }
});


// Add data about user
router.post('/about', (req, res) =>{
  if ( req.session.username != undefined ) {
    usersData.forEach(user => {
      if( req.session.username === user.username ) {
        let reqObject = req.body,
            aboutUser = user['about'] = {};
        for ( var key of Object.keys(reqObject) ) {
          aboutUser[key] = reqObject[key];
        }
        fs.writeFile('usersData.json', JSON.stringify(usersData), err => {
          if (err) console.log(err);
        })
        return res.send(`Thanks ${req.session.username}, Now we can know you better..`);
      }
    })
  } else res.send("session expired, Please try to login again");
});

// Update credentials
router.put('/updateCred', (req, res) =>{
  if ( req.session.username != undefined ) {
    let updatedUser = req.body;
    usersData.forEach(user => {
      if( req.session.username === user.username ) {
        user.username = updatedUser.username ? updatedUser.username : user.username
        user.password = updatedUser.password ? updatedUser.password : user.password
      }
    })
    fs.writeFile('usersData.json', JSON.stringify(usersData), err => {
      if (err) console.log(err);
    })
    return res.send("Account credentials update succesfully...");
  } else res.send("session expired, Please try to login again");
});


// Logout user
router.post('/logout', (req, res, next) =>{
  console.log(`${req.session.username} log out`);
  req.session.destroy();
  next();
});


// Delete user
router.delete('/deleteUser', (req, res) =>{
  if ( req.session.username != undefined ) {
    usersData.forEach((user, index) => {
      if ( req.session.username === user.username ) {
        usersData.splice(index, 1);
        fs.writeFile('usersData.json', JSON.stringify(usersData), err => {
          if (err) console.log(err);
        })
        return res.send("Account deleted succesfully...");
      }
    });
  } else res.send("session expired, Please try to login again");
});

module.exports = router