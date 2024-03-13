const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
let cookieParser = require('cookie-parser')
const mongoose = require('./config/db');
const authRoutes = require('./Routes/authRoutes');
const campaignRoutes = require('./Routes/campaignRoutes');
const loginRoutes = require('./Routes/loginRoutes');
const verifyEmailRoutes = require('./Routes/verifyEmailRoutes');
const systemSettingsRoutes = require('./Routes/systemSettingsRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');
const paymentRoutes2 = require('./Routes/paymentRoutes2');
const path = require('path');

const app = express();
const port = 8000;

//middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.static(path.join(__dirname, "./client/build")));

global.config = {
    loginApi: {
        baseUrl: 'https://abcd.com',
        mocks: true,
        mockDelay: 2000
    }
}

app.use('/', authRoutes)
app.use('/', campaignRoutes)
app.use('/', loginRoutes)
app.use('/', verifyEmailRoutes)
app.use('/', systemSettingsRoutes)
app.use('/', paymentRoutes)
app.use('/', paymentRoutes2)
app.get('/',(req,res)=>{
  res.send('Home')
})
app.get("*", function (_, res) {
    res.sendFile(
      path.join(__dirname, "./client/build/index.html"),
      function (err) {
        res.status(500).send(err);
      }
    );
  });
app.listen(port, () => {
    console.log(`listening the port: ${port}`);
});
