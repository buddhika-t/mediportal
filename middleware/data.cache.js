const Cache = require("node-cache");
const dataCache = new Cache({ stdTTL: 60 * 60 });

/* get user data. */
const getUser = (email, password) => {
  const userList = dataCache.get("user-list")
  if (dataCache.has("user-list")) {
    return userList.find(element => element['userEmail'] === email && element['password'] === password)
  } else {
    return null;
  }
}

/* Check the drone is exist in the list. */
const isDroneExist = (serial) => {
  const dataList = dataCache.get("drone-list")
  if (dataCache.has("drone-list")) {
    return dataList.find(element => element['serial'] === serial)
  } else {
    return null;
  }
}

/* Check the drone is available in the list. */
const isAvailableExist = (serial) => {
  const dataList = dataCache.get("drone-list")
  if (dataCache.has("drone-list")) {
    return dataList.find(element => (element['serial'] === serial && element['state'] === 'IDLE' && +element['battery_capacity'] > 25))
  } else {
    return null;
  }
}

/* insert default user data. */
const setDefaultData = () => {
  const users = [{
    id: Date.now(),
    userEmail: 'example@gmail.com',
    password: '12323412'
  }]

  dataCache.set("user-list", users);
}

module.exports = {
  getUser,
  setDefaultData,
  isDroneExist,
  isAvailableExist,
  dataCache,
};