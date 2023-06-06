//var winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
 
const myFormat = printf(info => {
	return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
	level: 'info',
	//format: winston.format.json(),
	format: combine(
		label({ label:  '127.1.0.0' }),
		timestamp(),
		myFormat
	),
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log` 
		// - Write all logs error (and below) to `error.log`.
		//
		new transports.Console({
			handleExceptions: true,
			colorize: true
		}),
		new transports.File({
			filename: './logs/error.log',
			handleExceptions: true,
			maxsize: 5242880, //5MB
			maxFiles: 5,
			level: 'error'
		}),
		new transports.File({ filename: './logs/combined.log' })
	],
	exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;
module.exports.stream = {
	write: function(message, encoding){
		logger.info(message);
	}
};