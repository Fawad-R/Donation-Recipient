const jsonwebtoken = require('jsonwebtoken');
const key = 'mkasfakfalfkasfk[p231[2312';
let cookieParser = require('cookie-parser')
const express = require('express');
let app=express()
app.use(cookieParser());
const Auth = async (req, res, next) => {
  let headerToken;
  try {
    if (req.cookies.user || req.headers.token) {
      headerToken = req.cookies.user || req.headers.token;
    }
    jsonwebtoken.verify(headerToken, key, (err, user) => {
      if (err) {
        return res.status(404).send(err);
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).send('error');
  }
};

module.exports = Auth;
