var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const { getUser } = require("../middleware/data.cache");
const { successResponse, errorResponse } = require('../lib/response.messages');
const constants = require('../lib/constants');
const { body, validationResult } = require('express-validator');

const validateUser = [
  // Validate fields.        	    	   	
  body('email').exists().withMessage({message: 'Email required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE }),
  body('password').exists().withMessage({message: 'Password required', errorCode: constants.MISSING_MANDATORY_ATTRIBUTE}),
  body('email').isEmail().withMessage({message: 'Username must be an email address', errorCode: constants.INVALID_EMAIL}),
  body('password').isLength({ min: 8 }).withMessage({message: 'Password must be 8+ chars long', errorCode: constants.INVALID_DATA}),
  body('password').matches(/\d/).withMessage({message: 'Must contain a number', errorCode: constants.INVALID_DATA}),

  // Process request after validation and sanitization.
(req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          let errorData = errors.array({ onlyFirstError: true }).shift();
          let response = errorResponse(errorData['msg']['errorCode'],errorData['msg']['message']);
          res.status(400).json(response);
      } else {
          next();
      }
  }
];

/* GET users listing. */
router.get('/', (req, res) => {
  const response = {"status": "OK"}
  return res.status(200).json(response);
});

/* POST authenticate the user credentials. */
router.post('/authenticate', validateUser, (req, res) => {
  const user = getUser(req.body.email, req.body.password);

  if (user) {
    jwt.sign({user}, process.env.TOKEN_KEY, { expiresIn: 60 * 60 * 5 }, (error, token) => {
      const data = {id: user.id, userEmail: user.userEmail, token: token};
      return res.status(200).json(successResponse(constants.SUCCESS, data));
    });
  } else {
    return res.status(401).json(errorResponse(constants.FAIL, 'User not found'));
  }

});

module.exports = router;
