# Expensio

**Expensio** is an advanced financial management platform designed to give users unparalleled insights into their financial behavior, expenditures, and overall relationship with money. Initially developed as a monolithic application, Expensio is now being transitioned to a **microservices architecture** for improved scalability, maintainability, and resilience. It leverages cutting-edge technologies such as **Kafka**, **MongoDB**, **PostgreSQL**, and **Kubernetes** to ensure a robust and modern event-driven architecture.

This is an ongoing project with several completed services, including **User**, **Expense**, **Income**, **Financial Data**, **Dashboard**, and the innovative **Smart Chat Assistant**.

---

## 👨‍💻 **Developed By**

This project is developed by **Ashutosh Tewari** and **Anubhav Pandey**, both currently in their final year (during 2024) of B.Tech. at **NIT Allahabad**. The project is an advanced finance management platform, showcasing industry-level implementation of event-driven microservices architecture, intelligent NLP-driven features, and modern deployment strategies.

---

## Key Features

### **1. Microservices Architecture with Kafka-Driven Event Bus**

- **Fan-out Architecture**: Expensio uses a Kafka-powered event-driven system where key events such as `EXPENSE_CREATED` are consumed by multiple services, such as **Financial Data** and **Dashboard**. This allows independent services to handle related tasks in parallel without tight coupling.
  
- **Transactional Integrity**: Leveraging **MongoDB transactions** and **Idempotency** ensures that services are consistent and durable. Every service is idempotent, meaning that events are safely processed without risking duplicate or inconsistent data, even when reprocessing occurs.

- **Distributed Saga Pattern**: A **SAGA** pattern has been implemented to handle distributed transactions, ensuring data consistency across multiple services and guaranteeing atomicity in complex workflows.

- **Dead Letter Queue (DLQ)**: The system incorporates DLQs to catch failed event messages. Although event retries and DLQ processing are not yet fully implemented, this setup ensures that no messages are lost and all failures are traceable.

---

### **2. Smart Chat Assistant with NLP for Financial Queries**

Expensio includes a **Smart Chat Assistant** that users can interact with to query their financial data, add expenses, and get personalized insights. This assistant can:

- **Conversational Expense & Income Entry**: Users can simply chat with the assistant to add new expenses or incomes. The assistant intelligently infers details like **title**, **amount**, **category**, **mood**, and **cognitive triggers** from the message.
  
- **Financial Queries & Summaries**: Users can ask the assistant for **financial summaries**, which dive deep into their financial habits, trends, and behavior. The assistant is capable of understanding complex financial questions and offers summaries that reveal the user's relationship with money.

---

### **3. Advanced OTP Authentication with Rate Limiting**

- **OTP Authentication**: Expensio uses a **rate-limited OTP authentication** system. Users are limited to 3 OTP requests within a specified period to prevent abuse or brute force attacks.
  
- **Account Lockout & Recovery**: If users exceed the request limit, their accounts are temporarily locked, ensuring security. The system provides smooth recovery mechanisms, notifying users about when and how they can unlock their accounts.

---

### **4. Comprehensive Financial Data Tracking & Insights**

- **Financial Data Services**: The **Financial Data** service tracks every user's expenses and income by **month**, **category**, **mood**, and **cognitive triggers**. The platform gives a thorough breakdown of spending patterns and financial insights. 
- **Event-Driven Updates**: When a new expense or income is created, the Financial Data service updates the user’s financial profile, and the **Dashboard** service reflects those changes in real-time.
- **Automated Categorization**: Expenses and incomes are automatically categorized, with built-in support for tracking custom **cognitive triggers** that influence financial behavior, such as moods or specific triggers tied to purchases.

---

### **5. Frontend Under Development**

The frontend for Expensio is being actively developed and will soon be deployed, offering users a clean and intuitive interface to interact with their financial data, chat with the Smart Assistant, and manage their expenses and incomes.

---

## Key Technologies

### **Microservices & Event-Driven Architecture**

Expensio is built around microservices and follows a **fan-out** event-driven model with **Kafka** as the core event bus. Kafka allows for **event replay** and ensures that new services can subscribe to historical events easily. Events such as `EXPENSE_CREATED` and `FINANCIALDATA_UPDATED` are key to the platform, ensuring that each service has access to the events it needs, while maintaining **decoupling** between services.

- **Apache Kafka**: Kafka is central to the event-driven architecture, offering robust scalability and resilience. Kafka's **manual offset commits** ensure event consumption is done in an orderly fashion, with retries handled manually for full control over how events are processed.
- **MongoDB & PostgreSQL**: MongoDB is used for services like **Expense** and **Financial Data**, while **PostgreSQL** is the backbone for relational data such as **User** management.
- **Kubernetes**: Expensio is containerized using **Docker** and orchestrated with **Kubernetes**, ensuring smooth deployments, scaling, and management in a cloud-native environment.

### **Idempotency & Transactions**

- **Idempotent Services**: Every service is designed to be idempotent, ensuring that even if events are replayed or processed multiple times, there is no risk of double entries or inconsistent states.
  
- **Transactional Integrity**: MongoDB transactions ensure that financial updates are only committed once the event bus has confirmed the event was processed. This guarantees that the system remains consistent, even in the event of failure.

---

## Detailed Service Overview

### **User Service**
- **Technology**: Node.js, Express, PostgreSQL.
- **Authentication**: Completed with rate-limited OTP Authentication, ensuring secure user access with a focus on preventing abuse.
  
### **Expense Service**
- **Technology**: Node.js, Express, MongoDB.
- **Features**: Fully integrated with the Financial Data and Dashboard services, providing real-time updates on expenses and insights. Transaction support ensures data consistency.

### **Income Service**
- **Technology**: Node.js, Express, MongoDB.
- **Features**: Tracks user income with full integration into the event-driven system, updating financial data and dashboard services in real-time.

### **Financial Data Service**
- **Technology**: Node.js, Express, MongoDB.
- **Features**: Analyzes user spending behavior, tracking mood, cognitive triggers, and categories to offer deep insights into financial habits.

### **Dashboard Service**
- **Technology**: Node.js, Express, MongoDB.
- **Features**: Displays user data from both the expense and income services, providing a comprehensive view of financial behavior and trends.

### **Smart Chat Service**
- **Technology**: Node.js, Express, MongoDB, NLP.
- **Features**: Users can chat with the assistant to add expenses/incomes, view financial data, and ask for insights and summaries.

---

## Infrastructure & Deployment

### **Docker & Kubernetes**
- **Containerization**: Each microservice is containerized using Docker, ensuring consistency across different environments.
- **Orchestration**: Kubernetes is used to manage these containers, ensuring smooth scaling and deployment.
  
### **Kafka & Zookeeper Deployments**
- **Persistent Volumes**: Kafka is connected to **persistent storage** to ensure that no events are lost, even if the services are restarted.
- **Topic Management**: Each event type is associated with a Kafka topic, allowing for replayable and scalable event management.

---

## To-Do & Upcoming Features

- **DLQ Processing**: Currently, failed events are routed to a Dead Letter Queue (DLQ), and handling of these failed events is planned for future updates.
- **Event Replay for New Services**: New services will have the capability to replay past events they have subscribed to, ensuring no data is missed.
- **Frontend Deployment**: The frontend will be deployed soon to offer users an intuitive interface for interacting with Expensio's services.

---

Expensio is an evolving platform with ongoing improvements to both the backend and frontend. Contributions and feedback are highly appreciated as we aim to create the best personal finance management experience possible.

This project is being developed by: Ashutosh Tewari and Anubhav Pandey (B.Tech. Students of NIT Allahabad).
For more details, check out the [Monolithic Version of Expensio](https://github.com/ashuTew01/expensio) on GitHub.
