var request = require('request');

// define access parameters
var accessToken = process.env.SPHERE_ENGINE_ACCESS_TOKEN;
var endpoint = process.env.SPHERE_ENGINE_ENDPOINT;

// send request
request({
    url: 'https://' + endpoint + '/api/v4/judges?access_token=' + accessToken,
    method: 'GET'
}, function (error, response, body) {
    
    if (error) {
        console.log('Connection problem');
    }
    
    // process response
    if (response) {
        if (response.statusCode === 200) {
            console.log(JSON.parse(response.body)); // list of judges in JSON
        } else {
            if (response.statusCode === 401) {
                console.log('Invalid access token');
            } else if (response.statusCode === 400) {
                var body = JSON.parse(response.body);
                console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
            }
        }
    }
});