export function onMessage(message, channel) {
	try {
		const body = message.content.toString("utf-8");
		console.log("Received from queue:", message.fields.routingKey, body);
		// Not awaited: Spica's server never answers ack/nack calls, so awaiting would hang until timeout.
		channel.ack(message).catch(err => console.error("Ack failed:", err));
	} catch (err) {
		console.error("Processing failed, requeueing:", err);
		channel.nack(message).catch(e => console.error("Nack failed:", e));
	}
}
