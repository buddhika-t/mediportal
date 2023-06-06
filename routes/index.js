const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const logger = require('../utils/logger');

const { droneRoutes, droneController } = require('../components/drone');
const { dispatchRoutes } = require('../components/dispatch');

const canAccess = (req, res, next) => {
	checkAuthorization(req, (err, authorized) => {
    logger.info('check user access');
		if (err || !authorized) {
			res.status(401).json({ message: 'Unauthorized', status: 401 });
		} else {
      next();
    }		
	});

	function checkAuthorization(req, callback) {
		// logger.info('jwt decode and actual authentication admin/superuser matching goes here..');

    try {
      const bearerHeader = req.headers['authorization']
      
      const tokenParts = bearerHeader.split(' ');
      if (tokenParts.length === 2) {
        var scheme = tokenParts[0];
        var credentials = tokenParts[1];

        if (/^Bearer$/i.test(scheme)) {
          let token = credentials;
          //verify token
          jwt.verify(token, process.env.TOKEN_KEY, (error, decoded) => {
            if (error) {
              callback(error, false)
            } else {
              callback(null, true)
            }        
          });
        } else {
          callback(error, false)
        };
      }
      
    } catch (err) {
      // return res.status(401).send("Invalid Token");
      callback('Invalid Token', false);
    }
	}
}

router.use(canAccess);

router.use('/drone', droneRoutes);
router.use('/dispatch', dispatchRoutes);

// GET request for list of all drone items.
// router.get('/drones', droneController.droneList);

module.exports = router;

