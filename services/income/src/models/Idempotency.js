import mongoose from "mongoose";
//a model for idempotency keys.

const idempotencySchema = new mongoose.Schema({
	idempotencyKey: { type: String, required: true, unique: true },
	userId: { type: Number, required: true },
	response: { type: Object, required: true },
	createdAt: { type: Date, default: Date.now },
});

// Optional TTL (Time-To-Live) index to automatically delete old entries after 24 hours
idempotencySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Idempotency = mongoose.model("Idempotency", idempotencySchema);

export default Idempotency;
