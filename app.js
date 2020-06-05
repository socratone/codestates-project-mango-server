const express = require('express');
const app = express();
const routing = require('./routing');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors({
  origin : ['http://localhost:3001']
}));
app.use('/signin', routing.signin);
app.use('/signup', routing.signup);
app.use('/signout', routing.signout);


let open = app.listen(3000, () => {
  console.log('3000 port start');
});

module.exports = open;