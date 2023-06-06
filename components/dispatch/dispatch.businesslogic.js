const { dataCache } = require("../../middleware/data.cache");
const { STATUS_INPROGRESS } = require('./dispatch.constants');
const constants = require('../../lib/constants');
const ba64 = require("ba64")

/**
 * Create new dispatch
 * @param {Object} data 
 */
const createDispatch = (data) => {
    data['created_at'] = Date.now();
    data['status'] = STATUS_INPROGRESS;

    if (dataCache.has("drone-list")) {
        const dataList = dataCache.get("drone-list");
        dataList.map(element => {            
            if (element['serial'] === data.drone) {
                element['state'] =  constants.STATE_LOADING;
            }            
        });
        dataCache.set("drone-list", dataList);
        
        let ext = '', fileName = '';
        let img_url = process.env.PUBLIC_IMAGE_URL     
        data.medication.map(element => {
            fileName = Math.floor((Math.random() * 100000) + 1);
            ext = element.image.split(';')[0].split('/')[1];
            fileName = `${fileName}.${ext}`;        
            ba64.writeImageSync(`./public/images/${fileName}`, element.image);            
            element.image = `${img_url}${fileName}`
        });

        if (dataCache.has("dispatch-list")) {
            let dataList = dataCache.get("dispatch-list");
            dataList.push(data);
            dataCache.set("dispatch-list", dataList);
        } else {
            dataCache.set("dispatch-list", [data]);
        }
        return data;  
    } else {
        return null;
    }
}

/**
 * Get details of the dispatch
 * @param {Object} filter 
 */
const getDispatchDetail = (filter) => {
    if (dataCache.has("dispatch-list")) {
        const dataList = dataCache.get("dispatch-list");
        return dataList.find(element => element[filter['key']] === filter['value'] && element['status'] === STATUS_INPROGRESS)
    } else {
        return null;
    }
}

module.exports = { createDispatch, getDispatchDetail };