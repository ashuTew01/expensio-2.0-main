export const otpMailHtmlTemplate = (otp) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Expensio OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .otp {
            font-size: 36px;
            font-weight: bold;
            color: #333333;
            margin: 20px 0;
        }
        .message {
            font-size: 18px;
            color: #666666;
            margin-bottom: 30px;
        }
        .footer {
            background-color: #007bff;
            color: #ffffff;
            padding: 15px;
            text-align: center;
            font-size: 14px;
        }
        .footer p {
            margin: 0;
        }
        .warning {
            color: #d9534f;
            font-size: 16px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            Expensio: One-Time Password (OTP)
        </div>
        <div class="content">
            <p class="message">Your login OTP is:</p>
            <div class="otp">${otp}</div>
            <p class="warning">Please do not share this OTP with anyone.</p>
        </div>
        <div class="footer">
            <p>Thank you for using Expensio.</p>
            <p>&copy; ${new Date().getFullYear()} Expensio. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};
