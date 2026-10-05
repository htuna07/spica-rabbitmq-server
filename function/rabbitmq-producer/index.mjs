import amqp from "amqplib";

const QUEUE = "spica.test";

export default async function (req, res) {
	const {rabbitmq_username, rabbitmq_password} = process.env;
	const url = `amqps://${encodeURIComponent(rabbitmq_username)}:${encodeURIComponent(rabbitmq_password)}@rabbitmq.tunakucukertas.com:5681`;

	const payload = req.body && Object.keys(req.body).length ? req.body : {hello: "from spica producer"};

	const connection = await amqp.connect(url);
	try {
		const channel = await connection.createChannel();
		// Must match the consumer's queue options, otherwise RabbitMQ rejects with PRECONDITION_FAILED.
		await channel.assertQueue(QUEUE, {durable: true});
		channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(payload)));
		await channel.close();
	} finally {
		await connection.close();
	}

	return res.status(200).send({sent: true, queue: QUEUE, payload});
}
