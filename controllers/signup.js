const Users = require('../models').Users;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const signup = async (req, res) => {
  const {nickname, email, password} = req.body;
  try{
    let user = await Users.create({
      nickname,
      email,
      password
    });
    const userInfo = { id : user.id};
    const secretKey = process.env.TOKEN_KEY;
    const options = { expiresIn: '1d' };
    const token = await jwt.sign(userInfo, secretKey, options);
    res.status(201).json(user);
  }
  catch(err){
    res.status(409).end('Alredy user');
  }
};

module.exports = signup;