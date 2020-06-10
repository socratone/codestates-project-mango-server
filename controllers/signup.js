const Users = require('../models').Users;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const signup = async (req, res) => {
  const {nickname, email, password} = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);
  
  try{
    let user = await Users.create({
      nickname,
      email,
      password: hashPass,
    });
    
    const secretKey = process.env.TOKEN_KEY;
    const options = { expiresIn : '1h' };
    const rfOptions = { expiresIn : '14d' };  
    const access_token = await jwt.sign({ id : user.id }, secretKey, options);
    const refresh_token = await jwt.sign({ id : user.id }, secretKey, rfOptions);
    res.status(201).json({ access_token, refresh_token });
  }
  catch(err){
    res.status(409).end('Alredy user');
  }
};

module.exports = signup;

// const userInfo = { id : user.id};
// const secretKey = process.env.TOKEN_KEY;
// const options = { expiresIn: '1d' };
// const token = await jwt.sign(userInfo, secretKey, options);
// const refreshtoken = createRefreshToken();

// createRefreshToken() = () => {
// let salt = bcrypt.genSaltSync(10);
// bcrypt.hashSync(config.tokenSecret, salt);
// }
// res.cookie('access-token', token, { httpOnly : true });
// res.cookie('refresh-token', token, { httpOnly : true});