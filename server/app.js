const express = require('express');
const morgan = require('morgan');
const { error } = require('console');

const searchRouter = require('./routes/searchRoutes');
const cartRouter = require('./routes/cartRoutes');

const app = express();

//Middleware
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
}

app.use(express.json());
//app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
});

app.use('/search', searchRouter);

app.use('/getCart', cartRouter);

module.exports = app;
