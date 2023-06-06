const { dataCache } = require("../../middleware/data.cache");
const constants = require('../../lib/constants');

/**
 * Create new Drone
 * @param {Object} data 
 */
const createDrone = (data) => {
    data['created_at'] = Date.now();
    data['state'] = constants.STATE_IDLE;
    if (dataCache.has("drone-list")) {
        let dataList = dataCache.get("drone-list");
        dataList.push(data);
        dataCache.set("drone-list", dataList);
    } else {
        dataCache.set("drone-list", [data]);
    }
    return data;
}

/**
 * List Drone
 * @param {Object} filter 
 */
const getDroneList = (filter = '') => {
    if (dataCache.has("drone-list")) {
        const dataList = dataCache.get("drone-list");
        if (filter) {
            return dataList.filter(element => element[filter['key']] === filter['value'])
        } else {
            return dataList;
        }
    } else {
        return [];
    }
}

/**
 * Get details of the Drone
 * @param {Object} filter 
 */
const getDroneDetail = (filter) => {
    if (dataCache.has("drone-list")) {
        const dataList = dataCache.get("drone-list");
        return dataList.find(element => element[filter['key']] === filter['value'])
    } else {
        return null;
    }
}

/**
 * Update details of the Drone
 * @param {Object} filter
 * @param {Object} data  
 */
const updateDroneElement = (filter, data) => {
    if (dataCache.has("drone-list")) {
        const dataList = dataCache.get("drone-list");
        dataList.map(element => {            
            if (element[filter['key']] === filter['value']) {
                element[data['key']] =  data['value']
            }            
        });
        dataCache.set("drone-list", dataList);
        return dataList.find(element => element[filter['key']] === filter['value'])      
    } else {
        return null;
    }
}

module.exports = { createDrone, getDroneList, getDroneDetail, updateDroneElement };