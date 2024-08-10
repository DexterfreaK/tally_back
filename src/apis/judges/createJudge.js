const express = require("express");
var request = require("request");
const router = express.Router();

// define access parameters
var accessToken = process.env.SPHERE_ENGINE_ACCESS_TOKEN;
var endpoint = process.env.SPHERE_ENGINE_ENDPOINT;

router.post("/create-judge", (req, res) => {
  // Define the request parameters
  const judgeData = {
    compilerId: 116, // Python compiler ID
    source: `def length_of_args(*args):\n    return len(args)`,
  };

  // Send request
  request(
    {
      url: `https://${endpoint}/api/v4/judges?access_token=${accessToken}`,
      method: "POST",
      form: judgeData,
    },
    (error, response, body) => {
      if (error) {
        return res.status(500).send("Connection problem");
      }

      // Process response
      if (response.statusCode === 201) {
        return res.status(201).json(JSON.parse(body)); // Return judge data in JSON
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
});

module.exports = router;
