const { body, validationResult } = require('express-validator');
const constants = require('../../lib/constants');
const { errorResponse } = require('../../lib/response.messages');
const { ERROR_DRONE_NOT_FOUND, PACKAGE_OVERLOADED } = require('./dispatch.constants');
const { isAvailableExist } = require("../../middleware/data.cache");

const validator = {};

// Validate create dispatch data.
validator.dispatchCreate = [
    // Validate fields.
        	    	   	
    body('drone').exists().withMessage({ message: 'serial required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('drone').isLength({ min: 1, max: 100 }).withMessage({ message: 'serial number must be less than 100 characters', errorCode: constants.EXCEED_CHARACTER_LENGTH }),

    body('medication').isArray(),
    body('medication.*.name').exists().isLength({ min: 1}).withMessage({ message: 'Name required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('medication.*.name').matches(/^[\w_-]*$/).withMessage({ message: 'Name must be alphanumeric characters, dash and underscore only', errorCode: constants.INVALID_CHARACTERS }),
    body('medication.*.weight').exists().isLength({ min: 1}).withMessage({ message: 'Weight required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('medication.*.weight').isInt({ gt: 0, lt: 501 }).withMessage({ message: 'Weight must be between 1gm to 500gm', errorCode: constants.INVALID_DATA }),
    body('medication.*.code').exists().isLength({ min: 1}).withMessage({ message: 'Code required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('medication.*.code').matches(/^[A-Z0-9_]*$/).withMessage({ message: 'Code must be upper case letters, numbers and underscore only', errorCode: constants.INVALID_CHARACTERS }),
    body('medication.*.image').exists().isLength({ min: 1}).withMessage({ message: 'Image required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
    body('medication.*.image').matches(/^data:.*;base64,([0-9a-zA-Z+\\/]{4})*(([0-9a-zA-Z+\\/]{2}==)|([0-9a-zA-Z+\\/]{3}=))?$/i )
        .withMessage({ message: 'Invalide image data', errorCode: constants.INVALID_IMAGE }),

    body('drone').custom((value, { req }) => {
        if (!isAvailableExist(value)) {
            throw new Error('Drone not found');
        } else {
            return true;
        }
    }).withMessage({ message: 'Drone not found or not available', errorCode: ERROR_DRONE_NOT_FOUND }),

    body('medication').custom((value, { req }) => {
        const drone = isAvailableExist(req.body.drone);
        const totalWeight = value.reduce((accumulator, currentValue) => accumulator + +currentValue['weight'], 0);
        if (drone && drone['weight'] >= totalWeight) {
            return true;
        } else {
            throw new Error('Package is overloaded');
        }

    }).withMessage({ message: 'Package is overloaded', errorCode: PACKAGE_OVERLOADED }),

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
