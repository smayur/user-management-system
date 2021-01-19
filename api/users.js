const express = require('express');
const router = express.Router();
let usersData = require('../usersData.json');


router.get('/', (req, res) =>{
  res.json(usersData);
});


module.exports = router