const express = require('express');
const router = express.Router()

const app = express();

app.get('/', (req, res) =>{
  console.log('Hi mayur, success is ahead!!!');
});

app.listen('5000', () => {
  console.log('Listening on Port 5000');
});