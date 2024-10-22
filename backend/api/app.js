const express = require('express');
const app = express();
// const cookieParser = require('cookie-parser')
const cors = require('cors')
const products = require('../routes/product');
const suppliers = require('../routes/supplier');
const users = require('../routes/user');
const faqs = require('../routes/faq');
// const auth = require('../routes/auth');
// const order = require('../routes/order');



app.use(express.json({limit:'50mb'}));

app.use(express.urlencoded({limit: "50mb", extended: true }));
app.use(cors());
// app.use(cookieParser());

app.use('/api/v1', products);
app.use('/api/v1', suppliers);
app.use('/api/v1', users);
app.use('/api/v1', faqs);
// app.use('/api/v1', auth);
// app.use('/api/v1', order);


module.exports = app