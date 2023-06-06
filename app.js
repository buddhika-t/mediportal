const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
// const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');
const { errorResponse } = require('./lib/response.messages');
const logger = require('./utils/logger');

var usersRouter = require('./routes/users');
const { setDefaultData } = require("./middleware/data.cache");

var app = express();

app.use(cors());
setDefaultData();

// app.use(morgan('dev'));
app.use(morgan('combined', { stream: logger.stream }));

app.use(express.json({ limit: '256mb' }));
app.use(express.urlencoded({ limit: '256mb', extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', usersRouter);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res) {
	let response = errorResponse('BAD_REQUEST');
	res.status(404).json(response);
});

module.exports = app;
