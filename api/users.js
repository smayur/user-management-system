const express = require('express');
const router = express.Router();
let usersData = require('../usersData.json');


// Login
router.get('/login', (req, res, next) =>{
  let isThere = false;
  for (let i = 0; i < usersData.length; i++) {
    if ( req.body.username === usersData[i].username && req.body.password === usersData[i].password ) {
      isThere = true
      return res.send(`Hi ${req.body.username}, Welcome to dashboard `);
    } 
  }
  !isThere ? res.send(`Please check login credentials!`) : next()
});

module.exports = router