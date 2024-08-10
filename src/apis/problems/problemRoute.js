var request = require("request");
const express = require("express");

require("dotenv").config();

// define access parameters
var accessToken = process.env.SPHERE_ENGINE_ACCESS_TOKEN;
var endpoint = process.env.SPHERE_ENGINE_ENDPOINT;

const createProblem = async (req, res) => {
  // Extract parameters from request body
  const { name, masterjudgeId } = req.body;

  // Define access parameters
  const accessToken = process.env.SPHERE_ENGINE_ACCESS_TOKEN;
  const endpoint = process.env.SPHERE_ENGINE_ENDPOINT;

  // Define request parameters
  const problemData = {
    name,
    masterjudgeId,
  };                    

  // Send request
  request(
    {
      url: `https://${endpoint}/api/v4/problems?access_token=${accessToken}`,
      method: "POST",
      form: problemData,
    },
    (error, response, body) => {
      if (error) {
        return res.status(500).send("Connection problem");
      }

      // Process response
      if (response.statusCode === 201) {
        return res.status(201).json(JSON.parse(body)); // Return problem data in JSON
      } else {
        if (response.statusCode === 401) {
          return res.status(401).send("Invalid access token");
        } else if (response.statusCode === 400) {
          const bodyParsed = JSON.parse(body);
          return res
            .status(400)
            .send(
              `Error code: ${bodyParsed.error_code}, details: ${bodyParsed.message}`
            );
        } else {
          return res.status(response.statusCode).send("Error occurred");
        }
      }
    }
  );
};

const getAllProblems = async (req, res) => {

  // Define access parameters
  const accessToken = process.env.SPHERE_ENGINE_ACCESS_TOKEN;
  const endpoint = process.env.SPHERE_ENGINE_ENDPOINT;

  // Send request
  request(
    {
      url:
        "https://" + endpoint + "/api/v4/problems?access_token=" + accessToken,
      method: "GET",
    },
    function (error, response, body) {
      if (error) {
        console.log("Connection problem");
      }

      // process response
      if (response) {
        if (response.statusCode === 200) {
          console.log(JSON.parse(response.body)); // list of problems in JSON
        } else {
          if (response.statusCode === 401) {
            console.log("Invalid access token");
          }
        }
      }
    }
  );
};
const router = new express.Router();

router.post("/create-problem", createProblem);
router.get("/all-problems", getAllProblems);

module.exports = router;
