const { json } = require('express');
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


// Login
router.post('/login', (req, res, next) =>{
  let isThere = false;
  for (let i = 0; i < usersData.length; i++) {
    if ( req.body.username === usersData[i].username && req.body.password === usersData[i].password ) {
      isThere = true
      req.session.username = req.body.username;
      return res.send(`Hi ${req.body.username}, Welcome to dashboard, Now tell us something about you..`);
    } 
  }
  !isThere ? res.send(`Please check login credentials!`) : next()
});


// Add data about user
router.post('/about', (req, res, next) =>{
  if ( req.session.username != undefined ) {
    for (let i = 0; i < usersData.length; i++) {
      if ( req.session.username === usersData[i].username ) {
        let reqObject = req.body,
            user = usersData[i],
            aboutUser = user['about'] = {};
        for (var key of Object.keys(reqObject)) {
          aboutUser[key] = reqObject[key];
        }
        fs.writeFile('usersData.json', JSON.stringify(usersData), err => {
          if (err) console.log(err);
        })
        return res.send(`Thanks ${req.session.username}, Now we can know you better..`);
      } 
    }
  } else res.send("session expired, Please login again");
  next();
});


// Logout user
router.post('/logout', (req, res, next) =>{
  console.log(`${req.session.username} log out`);
  req.session.destroy();
  next();
});


// Delete user
router.delete('/deleteUser', (req, res, next) =>{
  if ( req.session.username != undefined ) {
    for (let i = 0; i < usersData.length; i++) {
      if ( req.session.username === usersData[i].username ) {
        usersData.splice(i, 1);
        fs.writeFile('usersData.json', JSON.stringify(usersData), err => {
          if (err) console.log(err);
        })
        return res.send("Account deleted succesfully...");
      }
    }
  } else res.send("session expired, Please login again");
next();
});

module.exports = router