const droneBusinessLogic = require('./drone.businesslogic');
const isEmpty = require('is-empty');
const constants = require('../../lib/constants');
const { successResponse, errorResponse } = require('../../lib/response.messages');
const { ERROR_DRONE_NOT_FOUND, ERROR_DRONE_CREATE_FAILED } = require('./drone.constants');
const logger = require('../../utils/logger');

const controller = {};

// Display detail data for a specific drone.
controller.droneDetail = async (req, res, next) => {
	try {
		const drone = await droneBusinessLogic.getDroneDetail({key: 'serial', value: req.params.id});
		if (isEmpty(drone)) {
			let response = errorResponse(ERROR_DRONE_NOT_FOUND);
			return res.status(404).json(response);
		}

		return res.status(200).json(successResponse(constants.SUCCESS, drone));

	} catch (error) {
		let response = errorResponse(ERROR_DRONE_NOT_FOUND);
		res.status(400).json(response);
	}
};

// Display battery level for a given drone.
controller.droneBatteryDetail = async (req, res, next) => {
	try {
		const drone = await droneBusinessLogic.getDroneDetail({key: 'serial', value: req.params.id});
		if (isEmpty(drone)) {
			let response = errorResponse(ERROR_DRONE_NOT_FOUND);
			return res.status(404).json(response);
		}

		return res.status(200).json(successResponse(constants.SUCCESS, {battery_capacity: drone.battery_capacity}));

	} catch (error) {
		let response = errorResponse(ERROR_DRONE_NOT_FOUND);
		res.status(400).json(response);
	}
};

// Display list of all orders.
controller.droneList = async (req, res, next) => {
    try {
		let filter = null;
        const state = req.query.state;
		if (state) {
			filter = {key: 'state', value: state};
		}

		const droneList = await droneBusinessLogic.getDroneList(filter);	
        res.status(200).json(successResponse(constants.SUCCESS, droneList));

    } catch (err) {
        logger.error(err);
		let error = errorResponse(ERROR_DRONE_NOT_FOUND);
        res.status(404).json(error);
    }
}

// Handle drone create on POST.
controller.droneCreate = async (req, res, next) => {
	try {
		let newDrone = await droneBusinessLogic.createDrone(req.body);
		// logger.info('check user access');
		res.status(201).json(successResponse(constants.SUCCESS, newDrone));
	
	  } catch (err){
		logger.error(err);
		let error = errorResponse(ERROR_DRONE_CREATE_FAILED);
		res.status(500).json(error);
	  }
},

// Handle drone Battery level on PUT.
controller.droneUpdateBattery = async (req, res, next) => {
	try {
		const battryData = {key: 'battery_capacity', value: req.body.battery_capacity}
		let drone = await droneBusinessLogic.updateDroneElement({key: 'serial', value: req.params.id}, battryData);
		logger.info('drone Battery level updated. battery_capacity: ' + req.body.battery_capacity + '%');
		res.status(201).json(successResponse(constants.SUCCESS, drone));
	
	  } catch (err){
		logger.error(err);
		let error = errorResponse(ERROR_DRONE_UPDATE_FAILED);
		res.status(500).json(error);
	  }
},

// Handle drone state data on PUT.
controller.droneUpdateState = async (req, res, next) => {
	try {
		const stateData = {key: 'state', value: req.body.state}
		let drone = await droneBusinessLogic.updateDroneElement({key: 'serial', value: req.params.id}, stateData);
		logger.info('Drone state updated. state: ' + req.body.state);
		res.status(201).json(successResponse(constants.SUCCESS, drone));
	
	  } catch (err){
		logger.error(err);
		let error = errorResponse(ERROR_DRONE_UPDATE_FAILED);
		res.status(500).json(error);
	  }
},

module.exports = controller;