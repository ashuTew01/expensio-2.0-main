import amqp from "amqplib";

const connectRabbitMQ = async () => {
	const connection = await amqp.connect(process.env.RABBITMQ_URL);
	return connection;
};

export default connectRabbitMQ;
