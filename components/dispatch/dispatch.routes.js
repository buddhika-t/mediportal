const express = require('express');
const router = express.Router();

const dispatchController = require('./dispatch.controller');
const dispatchValidator = require('./dispatch.validator');

// GET request for one dispatch.
router.get('/:id', dispatchController.dispatchDetail);

// POST request for creating dispatch.
router.post('/', dispatchValidator.dispatchCreate, dispatchController.dispatchCreate);

module.exports = router;