const { body, validationResult } = require('express-validator');
const constants = require('../../lib/constants');
const { errorResponse } = require('../../lib/response.messages');
const { DUPLICATE_DATA, ERROR_DRONE_NOT_FOUND } = require('./drone.constants');
const { isDroneExist } = require("../../middleware/data.cache");

const validator = {};

// Validate create drone data.
validator.droneCreate = [
    // Validate fields.        	    	   	
    body('serial').exists().withMessage({ message: 'serial required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('serial').isLength({ max: 100 }).withMessage({ message: 'serial number must be less than 100 characters', errorCode: constants.EXCEED_CHARACTER_LENGTH }),
    body('model').exists().withMessage({ message: 'model required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('model').isIn(['Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight']).withMessage({ message: 'model not found', errorCode: constants.NOT_FOUND }),
    body('weight').exists().withMessage({ message: 'weight required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('weight').isInt({ gt: 0, lt: 501 }).withMessage({ message: 'weight must be between 1gm to 500gm', errorCode: constants.INVALID_DATA }),
    body('battery_capacity').exists().withMessage({ message: 'battery capacity required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('battery_capacity').isFloat({ gt: -1, lt: 100.01 }).withMessage({ message: 'battery capacity must be between 0 to 100', errorCode: constants.INVALID_DATA }),
    body('serial').matches(/^[\w_-]*$/).withMessage({ message: 'Serial must be alphanumeric characters, dash and underscore only', errorCode: constants.INVALID_CHARACTERS }),

    body('serial').custom(value => {
        if (isDroneExist(value)) {
            throw new Error('serial already in use');
        } else {
            return true;
        }
    }).withMessage({ message: 'serial already in use', errorCode: DUPLICATE_DATA }),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            let errorData = errors.array({ onlyFirstError: true }).shift();
            let response = errorResponse(errorData['msg']['errorCode'], errorData['msg']['message']);
            res.status(400).json(response);
        } else {
            next();
        }
    }
];

// Validate update battery drone data.
validator.updateBattery = [
    // Validate fields.        	    	   	
    body('battery_capacity').exists().withMessage({ message: 'battery capacity required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('battery_capacity').isFloat({ gt: -1, lt: 100.01 }).withMessage({ message: 'battery capacity must be between 0 to 100', errorCode: constants.INVALID_DATA }),

    body('serial').custom((value, { req }) => {
        if (!isDroneExist(req.params.id)) {
            throw new Error('Drone not found');
        } else {
            return true;
        }
    }).withMessage({ message: 'Drone not found', errorCode: ERROR_DRONE_NOT_FOUND }),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            let errorData = errors.array({ onlyFirstError: true }).shift();
            let response = errorResponse(errorData['msg']['errorCode'], errorData['msg']['message']);
            res.status(400).json(response);
        } else {
            next();
        }
    }
];

// Validate update state drone data.
validator.updateState = [
    body('state').exists().withMessage({ message: 'battery capacity required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('state').isIn([constants.STATE_IDLE, constants.STATE_LOADING, constants.STATE_LOADED, constants.STATE_DELIVERING, 
        constants.STATE_DELIVERED, constants.STATE_RETURNING]).withMessage({ message: 'state not found', errorCode: constants.NOT_FOUND }),

    body('serial').custom((value, { req }) => {
        if (!isDroneExist(req.params.id)) {
            throw new Error('Drone not found');
        } else {
            return true;
        }
    }).withMessage({ message: 'Drone not found', errorCode: ERROR_DRONE_NOT_FOUND }),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            let errorData = errors.array({ onlyFirstError: true }).shift();
            let response = errorResponse(errorData['msg']['errorCode'], errorData['msg']['message']);
            res.status(400).json(response);
        } else {
            next();
        }
    }
];

module.exports = validator;
