var request = require("request");
const express = require("express");

require("dotenv").config();
// Define access parameters
const accessToken = process.env.SPHERE_ENGINE_ACCESS_COMPILER_TOKEN;
const endpoint = process.env.SPHERE_ENGINE_COMPILER_ENDPOINT;

const createSub = async (req, res) => {
  const { compilerId, source } = req.body;

  var submissionData = {
    compilerId: compilerId || 116,
    source: source,
  };

  console.log(compilerId);
  console.log(source);

  request(
    {
      url:
        "https://" +
        endpoint +
        "/api/v4/submissions?access_token=" +
        accessToken,
      method: "POST",
      form: submissionData,
    },
    function (error, response, body) {
      if (error) {
        console.log("Connection problem");
      }

      // process response
      if (response) {
        if (response.statusCode === 201) {
          console.log(JSON.parse(response.body)); // submission data in JSON
          return res.status(201).json(JSON.parse(response.body));
        } else {
          if (response.statusCode === 401) {
            console.log("Invalid access token");
          } else if (response.statusCode === 402) {
            console.log("Unable to create submission");
          } else if (response.statusCode === 400) {
            var body = JSON.parse(response.body);
            console.log(
              "Error code: " +
                body.error_code +
                ", details available in the message: " +
                body.message
            );
          }
        }
      }
    }
  );
};

const getSub = async (req, res) => {
  const submissionId = req.params.id;

  request(
    {
      url:
        "https://" +
        endpoint +
        "/api/v4/submissions/" +
        submissionId +
        "?access_token=" +
        accessToken,
      method: "GET",
    },
    function (error, response, body) {
      if (error) {
        console.log("Connection problem");
      }

      // process response
      if (response) {
        if (response.statusCode === 200) {
          res.status(200).json(JSON.parse(response.body)); 
        } else {
          if (response.statusCode === 401) {
            console.log("Invalid access token");
          }
          if (response.statusCode === 403) {
            console.log("Access denied");
          }
          if (response.statusCode === 404) {
            console.log("Submision not found");
          }
        }
      }
    }
  );
};

const getSubStream = async (req, res) => {
  const submissionId = req.params.id;
  const stream = req.params.stream;

  request(
    {
      url:
        "https://" +
        endpoint +
        "/api/v4/submissions/" +
        submissionId +
        "/" +
        stream +
        "?access_token=" +
        accessToken,
      method: "GET",
    },
    function (error, response, body) {
      if (error) {
        console.log("Connection problem");
      }

      // process response
      if (response) {
        if (response.statusCode === 200) {
          res.status(200).json(response);
        } else {
          if (response.statusCode === 401) {
            console.log("Invalid access token");
          } else if (response.statusCode === 403) {
            console.log("Access denied");
          } else if (response.statusCode === 404) {
            var body = JSON.parse(response.body);
            console.log(
              "Non existing resource, error code: " +
                body.error_code +
                ", details available in the message: " +
                body.message
            );
            res.status(404).json(body);
          } else if (response.statusCode === 400) {
            var body = JSON.parse(response.body);
            console.log(
              "Error code: " +
                body.error_code +
                ", details available in the message: " +
                body.message
            );
            res.status(400).json(body);
          }
        }
      }
    }
  );
};

const router = new express.Router();

router.post("/create-sub", createSub);
router.get("/get-sub/:id", getSub);
router.get("/get-sub-str/:id/:stream", getSubStream);

module.exports = router;
