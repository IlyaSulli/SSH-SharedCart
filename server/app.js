const express = require('express');
const morgan = require('morgan');
const { error } = require('console');
const cors = require('cors');

const searchRouter = require(`${__dirname}/routes/searchRoutes`);
console.log('here');
const cartRouter = require(`${__dirname}/routes/cartRoutes`);
const apiRouter = require(`${__dirname}/routes/apiRoutes`);

const app = express();
app.use(cors());

//Middleware
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

app.use('/getAPIs', apiRouter);

module.exports = app;
