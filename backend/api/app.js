const express = require('express');
const cors = require('cors');

const app = express();

const users = require('../routes/user');
const products = require('../routes/product');
const suppliers = require('../routes/supplier');
const faqs = require('../routes/faq');
// const auth = require('../routes/auth');
// const order = require('../routes/order');

app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// app.use(cors()); 
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true }));

app.use('/api', users);
app.use('/api', products);
app.use('/api', suppliers);
app.use('/api', faqs);


module.exports = app