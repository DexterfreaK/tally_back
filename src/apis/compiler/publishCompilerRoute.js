const { createRabbitMQConnection } = require("../../config/rabbit");

const createSub = async (req, res) => {
  const {
    compilerId,
    source,
    inputs,
    compare_tc,
    pb_id,
    user_id,
    contest_id,
    language,
  } = req.body;

  try {
    const { channel, queue } = await createRabbitMQConnection();

    // Create the message to be sent to the queue
    const message = {
      compilerId,
      source,
      inputs,
      compare_tc,
      pb_id,
      user_id,
      contest_id,
      language,
    };

    // Send the message to the RabbitMQ queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true, // Ensures message is not lost even if RabbitMQ restarts
    });
    
    res.status(200).json({ message: "Request queued successfully" });
  } catch (error) {
    console.error("Error queuing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const router = new express.Router();

router.post("/create-sub", createSub);
module.exports = router;