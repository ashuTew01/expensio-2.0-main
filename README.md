# Expensio

Expensio is an advanced finance management application that helps users gain deep insights into their financial behaviors and expenditure patterns. Initially developed as a monolithic application, it has been transitioned to a microservices architecture for better scalability and maintainability. The user service is complete, and work is ongoing on the expense service.

This is an ongoing project.
1. User Service: Node.js, Express, PostgreSQL: Completed with rate limited OTP Authentication.
2. Expense Service: Node.js, Express, MongoDB: Ongoing with CRUD operations in place
3. Kubernetes: In the infra/k8s directory, deployments for user and expense there along with other important details.

Currently, adding rabbitMQ for asynchronous communication support.


Link to completed monolithic Expensio - https://github.com/ashuTew01/expensio

## Features

## OTP Authentication with Rate Limiting

- **Secure OTP Generation**: Genrated one-time passwords (OTPs) that are unique and difficult to guess, ensuring secure user authentication.
- **Rate Limiting**:  Implements a rate limiting mechanism to restrict users to a maximum of 3 OTP requests within a specified time period. This prevents abuse and reduces the risk of brute-force attacks.
- **Account Lockout**: After exceeding the OTP request limit, the user’s account is temporarily blocked from requesting further OTPs. This feature helps in mitigating potential misuse and enhances security.
- **Real-time Verification**: Processes OTPs in real-time, providing immediate feedback to users during the authentication process. This ensures a smooth and efficient user experience.
- **Reset and Recovery**: Allows users to request a new OTP after the lockout period expires, with mechanisms in place to notify users about the reset process and any related actions needed.

## Shared Library for Reusable Code

- **Centralized Middleware**: Offers reusable middleware functions for authentication, logging, and error handling, ensuring consistency and efficiency across services.
- **Error Handling Utilities**:  Provides common utilities for managing and formatting errors, standardizing error responses across different services.
- **Configuration Management**: Includes shared configuration settings and constants to maintain uniformity and minimize code duplication.
- **NPM Registry Integration**: Registered the library on npm for easy installation and updates, ensuring all services use the latest code version.

##  Migration Scripts for PostgreSQL

- **Database Migration**: Provides migration scripts for transitioning the database schema and data between versions.
- **Version Control**:  Tracks and manages database schema changes using version-controlled migration scripts.
- **Data Integrity**: Ensures data integrity during migrations by validating and transforming data as needed.
- **Rollback Capabilities**: Supports rollback mechanisms to revert changes in case of migration failures.
- **Automated Execution**: Automates the execution of migration scripts to streamline database updates and reduce manual effort.

##  Docker and Kubernetes Deployment

- **Containerization with Docker**: Uses Docker for containerizing application components, ensuring consistency across different environments.
- **Orchestration with Kubernetes**:   Leverages Kubernetes for orchestrating and managing containerized services, enhancing scalability and reliability.
- **Automated Deployment**: Facilitates automated deployment processes, reducing manual intervention and minimizing deployment errors.
- **Resource Management**: Manages resources efficiently, optimizing performance and cost-effectiveness in cloud environments.
- **Scalability**: Enables horizontal scaling of services based on demand, ensuring the application can handle varying loads.

##  Error Validation and Logging

- **Robust Error Validation**: Implements comprehensive validation mechanisms to ensure data integrity and prevent invalid inputs.
- **Custom Error Messages**:   Provides user-friendly error messages to guide users in correcting issues effectively.
- **Error Tracking**: Tracks and logs error occurrences over time, helping identify and address recurring issues.
