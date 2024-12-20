const express = require('express');
const cors = require('cors');

const app = express();

const firebase = require('../routes/firebase');
const users = require('../routes/user');
const products = require('../routes/product');
const varieties = require('../routes/variety');
const faqs = require('../routes/faq');
const cart = require('../routes/cart');
const salesRoutes = require('../routes/sales'); 

app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// app.use(cors()); 
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true }));

app.use('/api/fb', firebase);
app.use('/api', users);
app.use('/api', products);
app.use('/api', varieties);
app.use('/api', faqs);
app.use('/api', cart);
app.use('/api', salesRoutes); 



module.exports = app