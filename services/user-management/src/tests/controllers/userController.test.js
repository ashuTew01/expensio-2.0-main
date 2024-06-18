import request from "supertest";
import app from "../../src/app.js";

describe("User Controller", () => {
	it("should register a user", async () => {
		const res = await request(app).post("/api/users/register").send({
			username: "testuser",
			email: "testuser@example.com",
			password: "password123",
			firstName: "Test",
			lastName: "User",
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty("username", "testuser");
	});

	it("should login a user", async () => {
		const res = await request(app).post("/api/users/login").send({
			email: "testuser@example.com",
			password: "password123",
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("email", "testuser@example.com");
	});
});
