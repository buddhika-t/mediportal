const express = require('express');
const router = express.Router();

const droneController = require('./drone.controller');
const droneValidator = require('./drone.validator');

// GET request for list all drones.
router.get('/', droneController.droneList);

// GET request for one drone.
router.get('/:id', droneController.droneDetail);

// GET request for one drone.
router.get('/:id/battery', droneController.droneBatteryDetail);

// POST request for creating drone.
router.post('/', droneValidator.droneCreate, droneController.droneCreate);

// PUT request for update drone battery capacity.
router.put('/:id/battery', droneValidator.updateBattery, droneController.droneUpdateBattery);

// PUT request for update drone state.
router.put('/:id/state', droneValidator.updateState, droneController.droneUpdateState);

// // GET request to update drone.
// router.put('/:id', droneValidator.droneUpdate, droneController.droneUpdate);

module.exports = router;