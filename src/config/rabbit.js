const amqp = require("amqplib");

async function createRabbitMQConnection() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "compiler_queue";

  await channel.assertQueue(queue, {
    durable: true,
  });

  return { connection, channel, queue };
}
