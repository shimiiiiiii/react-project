const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// app
const app = express();
const postRoutes = require('./routes/post');
// const authRoutes = require('./routes/auth');

// db
mongoose
    .connect(process.env.DATABASE, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());



app.use('/api', postRoutes);
// app.use('/api', authRoutes);

// route


// port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));