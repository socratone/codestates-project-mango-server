const express = require('express');
const app = express();
const routes = require('./controllers');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

app.use(bodyParser.json());
app.use(cors({
  origin : ['http://localhost:3000', 'http://localhost:3001'],
  methods:['GET', 'POST'],
  credentials: true
}));
app.use('/signin', routes.signin);
app.use('/signup', routes.signup);
app.use('/signout', routes.signout);
app.use('/refresh', routes.refresh);
app.use('/scoringMusic', routes.socoringMusic);

const open = app.listen(3000, () => {
  console.log('3000 port start');
});

module.exports = open;