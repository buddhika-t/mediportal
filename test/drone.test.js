require('dotenv').config();
const request = require('supertest');
const app = require('../app'); //reference to you app.js file


let serialId = '';
let token = '';
/**
 * Testing get all order endpoint
 */
describe('drone api endpoints', function () {

    it('POST /user/authenticate get user token', function (done) {
        var data = {
            "email": "example@gmail.com",
            "password": "12323412"
        };

        request(app)
            .post("/user/authenticate")
            .send(data)
            .set('Accept', 'application/json')
			.expect("Content-type", /json/)
			.expect(200)
			.end(function(err, res) {
                if (err) return done(err);
                token = res.body.data.token;
                return done();
		    });
    })

    it('POST /drone create new drone & respond with json drone detail', function (done) {
        var data = {
            serial: "12312112",
            model: "Middleweight",
            weight: 330,
            battery_capacity: 100
        };

        request(app)
            .post("/drone")
            .set('Authorization', `Bearer ${token}`)     
            .send(data)
            .set('Accept', 'application/json')
			.expect("Content-type", /json/)
			.expect(201)
			.end(function(err, res) {
                if (err) return done(err);
                serialId = res.body.data.serial;
                return done();
		    });
    });

    

});