const dispatchBusinessLogic = require('./dispatch.businesslogic');
const isEmpty = require('is-empty');
const constants = require('../../lib/constants');
const { successResponse, errorResponse } = require('../../lib/response.messages');
const { ERROR_NOT_FOUND, ERROR_CREATE_FAILED } = require('./dispatch.constants');
const logger = require('../../utils/logger');

const controller = {};

// Display detail data for a specific dispatch.
controller.dispatchDetail = async (req, res, next) => {
	try {
		const dispatch = await dispatchBusinessLogic.getDispatchDetail({key: 'drone', value: req.params.id});
		if (isEmpty(dispatch)) {
			let response = errorResponse(ERROR_NOT_FOUND);
			return res.status(404).json(response);
		}

		return res.status(200).json(successResponse(constants.SUCCESS, dispatch));

	} catch (error) {
		let response = errorResponse(ERROR_NOT_FOUND);
		res.status(400).json(response);
	}
};

// Handle dispatch create on POST.
controller.dispatchCreate = async (req, res, next) => {
	try {
		let newDispatch = await dispatchBusinessLogic.createDispatch(req.body);
		// logger.info('check user access');
		res.status(201).json(successResponse(constants.SUCCESS, newDispatch));
	
	  } catch (err){
		logger.error(err);
		let error = errorResponse(ERROR_CREATE_FAILED);
		res.status(500).json(error);
	  }
},

module.exports = controller;