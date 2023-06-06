# Nodejs Drones Aplication

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|TOKEN_KEY           | JWT security token             | "sample"      |
|PUBLIC_IMAGE_URL           | Public image url             | "http://loclahost:3000/image/"      |


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version v14.18.1 (LTS)

# Getting started
- Unzip the file 

- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm start
```

### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node on ./bin/www. Can be invoked with `npm start`                  |

## Testing
The tests are  written in Mocha and the assertions done using Chai

```
"mocha": "^10.2.0",
"supertest": "^6.3.3",

```

### Running tests using NPM Scripts
````
npm run test

````
Test files are created under test folder.

# Database
Database is running in cache when application start default data will insert

## Authentication credentials
````
{
    "email": "example@gmail.com",
    "password": "12323412"
}

````

# API endpoints
- Authentication
````
POST - http://<HOST:PORT>/user/authenticate
{
    "email": "example@gmail.com",
    "password": "12323412"
}
````

All API endpoints are use JSON Web Token (JWT) - Bearer token

- Drone
````
POST - http://<HOST:PORT>/drone/ (Registering a drone)
{
    "serial": "12312112",
    "model": "Middleweight",
    "weight": 330,
    "battery_capacity": 100
}

GET - http://<HOST:PORT>/drone/ (Get the list of drones in the system)

GET - http://<HOST:PORT>/drone/:id/ (Get the given drone details)

GET - http://<HOST:PORT>:id/battery (Get the given drone battery status)

PUT - http://<HOST:PORT>/:id/battery (Update the given drone battery status)
{
    "battery_capacity": 34
}

PUT - http://<HOST:PORT>/:id/state (Update the given drone state)
{
    "state": "LOADING"
}

````

- Dispatch
````
GET - http://<HOST:PORT>/dispatch/:id (Get given drone medications details)

POST - http://<HOST:PORT>/dispatch/ (Create drone medications dispatch)
{
    "drone": "12312112",
    "medication": [
        {
            "name": "sas",
            "weight": "30",
            "code": "ASS",
            "image": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAB2oAAAR3CAIAAAC5f3MV...000 more characters"
        },
        {
            "name": "sas",
            "weight": "34",
            "code": "ASS",
            "image": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAB2oAAAR3CAIAAAC5f3MV...3000 more characters"
        }
    ]
}

````




