import { Kafka, logLevel } from "kafkajs";
import { logInfo, logError } from "@expensio/sharedlib";

let producer, consumer; // Singleton producer and consumer instances

export const connectKafka = async (timeout = 15000, interval = 500) => {
	const startTime = Date.now();
	const kafka = new Kafka({
		clientId: `${process.env.SERVICE_NAME}-service`,
		brokers: [process.env.KAFKA_BROKER_URL || "kafka-srv:9092"],
		logLevel: logLevel.ERROR,
	});

	while (!producer || !consumer) {
		try {
			// Create Kafka producer and consumer instances
			producer = kafka.producer();
			consumer = kafka.consumer({
				groupId: `${process.env.SERVICE_NAME}-service`,
			});

			await producer.connect();
			await consumer.connect();

			logInfo("Connected to Kafka Event Bus.");

			process.on("exit", async () => {
				await producer.disconnect();
				await consumer.disconnect();
				logInfo("Kafka producer and consumer disconnected");
			});

			process.on("SIGINT", async () => {
				await producer.disconnect();
				await consumer.disconnect();
				logInfo("Kafka Event Bus connection closed due to app termination");
				process.exit(0);
			});
		} catch (error) {
			if (Date.now() - startTime >= timeout) {
				logError(
					"Failed to connect to Kafka Event Bus after multiple attempts:",
					error
				);
				throw error;
			}
			await new Promise((resolve) => setTimeout(resolve, interval)); // Wait before retrying
		}
	}

	// Return producer and consumer
	return { producerInstance: producer, consumerInstance: consumer };
};
