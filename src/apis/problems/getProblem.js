var request = require('request');
const express = require("express");
const router = express.Router();
require("dotenv").config();

// define access parameters
var accessToken = process.env.SPHERE_ENGINE_ACCESS_TOKEN;
var endpoint = process.env.SPHERE_ENGINE_ENDPOINT;

router.use(express.json());      
var problemId = 42;

// send request
request({
    url: 'https://' + endpoint + '/api/v4/problems/' + problemId + '?access_token=' + accessToken,
    method: 'GET'
}, function (error, response, body) {
    
    if (error) {
        console.log('Connection problem');
    }
    
    // process response
    if (response) {
        if (response.statusCode === 200) {
            console.log(JSON.parse(response.body)); // problem data in JSON
        } else {
            if (response.statusCode === 401) {
                console.log('Invalid access token');
            } else if (response.statusCode === 403) {
                console.log('Access denied');
            } else if (response.statusCode === 404) {
                console.log('Problem not found');
            }
        }
    }
});