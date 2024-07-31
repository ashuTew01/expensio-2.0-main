import request from "supertest";
import app from "../../src/app"; // Import the express app

describe("POST /send-otp", () => {
	it("should send an OTP successfully", async () => {
		const phone = "1234567890";
		const mockOtpService = jest.fn().mockResolvedValue({
			message: "OTP sent successfully.",
			userExists: true,
			otp: "123456",
		});

		jest.mock("../../src/services/otpService", () => ({
			handleSendOTPService: mockOtpService,
		}));

		const response = await request(app)
			.post("/api/users/send-otp")
			.send({ phone });

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			message: "OTP sent successfully.",
			userExists: true,
			otp: "123456",
		});
	});

	it("should handle RateLimitError", async () => {
		const phone = "1234567890";
		const mockOtpService = jest
			.fn()
			.mockRejectedValue(
				new RateLimitError("Too many OTP requests. Please try after 1 hour.")
			);

		jest.mock("../../src/services/otpService", () => ({
			handleSendOTPService: mockOtpService,
		}));

		const response = await request(app)
			.post("/api/users/send-otp")
			.send({ phone });

		expect(response.statusCode).toBe(429); // HTTP status code for too many requests
		expect(response.body.error).toBe(
			"Too many OTP requests. Please try after 1 hour."
		);
	});
});
