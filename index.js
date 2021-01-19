const express = require('express');
let usersData = require('./usersData.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded( {extended: false} ));
app.use('/api/users', require('./api/users'));


app.get('/', (req, res) =>{
  console.log(usersData);
});

app.listen('5000', () => {
  console.log('Listening on Port 5000');
});