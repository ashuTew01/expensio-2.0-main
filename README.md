# Expensio

[![Live App](https://img.shields.io/badge/Live_App-expensio.codelikh.com-brightgreen)](https://expensio.codelikh.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/ashuTew01/expensio-2.0-main)
[![Technical Blog](https://img.shields.io/badge/Read-Technical_Blog-red)](https://shorturl.at/Sk4jx)
[![YouTube Demo](https://img.shields.io/badge/Watch-YouTube_Demo-red)](https://youtu.be/i2YwiRFxRBk)

**Expensio** is a cutting-edge financial management platform that offers users deep insights into their spending habits, financial behavior, and the psychology behind their expenses. Transitioned from a monolithic application to a fully deployed, production-grade **microservices architecture**, Expensio leverages advanced technologies like **Kafka**, **Kubernetes**, **Google Cloud Platform**, **MongoDB**, and **PostgreSQL** to provide a highly scalable, resilient, and user-friendly experience.

---

## 📢 Live Demo

- **Live Application**: [expensio.codelikh.com](https://expensio.codelikh.com)
- **Technical Blog**: [Building Expensio - The Journey](https://shorturl.at/Sk4jx)
- **YouTube Demo**: [Expensio Live Demo](https://youtu.be/i2YwiRFxRBk)
- **GitHub Repository**: [Expensio 2.0](https://github.com/ashuTew01/expensio-2.0-main)

---

## 📑 Table of Contents

- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Technologies Used](#technologies-used)
- [Detailed Service Overview](#detailed-service-overview)
- [Infrastructure & Deployment](#infrastructure--deployment)
- [Usage](#usage)
- [Contributors](#contributors)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Further Reading](#further-reading)
- [Contact](#contact)

---

## 🔥 Key Features

### 1. Advanced Microservices Architecture

- **Event-Driven Communication**: Utilizes **Kafka** for asynchronous, event-driven communication between services, ensuring high performance and scalability.
- **Scalability and Resilience**: Services are independently deployable and scalable, managed by **Kubernetes** on **Google Cloud Platform**.
- **Data Consistency**: Implements the **Distributed Saga Pattern**, **idempotency**, and transactional operations to maintain data integrity across services.
- **Decoupled Services**: Microservices like User, Expense, and Income operate independently but communicate through events, enhancing maintainability.

### 2. Smart AI/NLP-Powered Chat Assistant

- **Natural Language Processing**: Allows users to interact with the app using natural language to add expenses/incomes and request financial summaries.
- **Intelligent Inference**: Automatically extracts details like **title**, **amount**, **category**, **mood**, and **cognitive triggers** from user input.
- **Personalized Insights**: Provides AI-driven financial summaries that delve into users' spending habits and offer tailored advice.
- **Conversational Interface**: Enhances user engagement by providing a chat-based interaction model.

### 3. Comprehensive Financial Tracking and Insights

- **Real-Time Updates**: Instantaneous reflection of financial data across the platform thanks to the event-driven architecture.
- **Detailed Analytics**: Tracks expenses and incomes by **month**, **category**, **mood**, and **cognitive triggers**, offering deep insights into financial behavior.
- **Dashboard Visualization**: An interactive dashboard displays analytics, trends, and summaries in a user-friendly interface.
- **Automated Categorization**: Expenses and incomes are automatically categorized for easier tracking.

### 4. Secure and Efficient Authentication

- **OTP Authentication**: Implements rate-limited OTP authentication to ensure security and prevent abuse.
- **Account Management**: Features smooth recovery mechanisms and notifications for account lockouts due to exceeded OTP requests.
- **Rate Limiting**: Prevents brute-force attacks by limiting the number of OTP requests.

### 5. Fully Deployed Frontend

- **Responsive Design**: A sleek and intuitive UI built with modern web technologies.
- **User Experience**: Emphasizes simplicity and interactivity, enhancing user engagement and retention.
- **Mobile Accessibility**: Mobile responsiveness improvements are underway to enhance accessibility.
- **Interactive Elements**: Smooth animations and real-time updates provide a seamless experience.

---

## 🏗 Architecture Overview

Expensio's architecture is built around microservices, each responsible for specific functionalities and communicating asynchronously through Kafka. The entire system is orchestrated using Kubernetes on Google Cloud Platform, ensuring high availability and scalability.

![Architecture Diagram](https://miro.medium.com/v2/resize:fit:2000/format:webp/0*QtWI_1PCD9n_O8fn.png)

- **Microservices**:
  - **User Service**: Manages user authentication and profiles.
  - **Expense Service**: Handles expense tracking and categorization.
  - **Income Service**: Manages income entries and sources.
  - **Financial Data Service**: Analyzes and operates on financial data for analysis, provides financial summaries.
  - **Dashboard Service**: Aggregates frequently accessed data for fast retrieval.
  - **Smart AI Service**: Offers personalized financial chats.
- **Event Bus**: Kafka handles all inter-service communication with topics for different event types like `EXPENSE_CREATED`, `FINANCIAL_DATA_UPDATED`.
- **Data Storage**:
  - **MongoDB**: Used for unstructured data like expenses, incomes, and cognitive triggers.
  - **PostgreSQL**: Used for relational data such as user credentials and authentication.
- **Orchestration**:
  - **Kubernetes**: Manages containerized services, scaling, and deployments.
  - **Ingress Controller (NGINX)**: Routes incoming traffic to appropriate services.
- **Security**:
  - **Kubernetes Secrets**: Manages sensitive data like database credentials.
  - **TLS/SSL Encryption**: Ensures secure communication.

---

## 💻 Technologies Used

- **Backend**:
  - Node.js
  - Express.js
- **Frontend**:
  - React.js
  - Redux
  - Socket.io
- **Microservices**:
  - Docker
  - Kubernetes
- **Event Streaming**:
  - Apache Kafka
  - Zookeeper
- **Databases**:
  - MongoDB
  - PostgreSQL
- **Cloud Infrastructure**:
  - Google Cloud Platform (GCP)
- **Authentication**:
  - OTP system with rate limiting
- **Other Tools**:
  - NGINX Ingress Controller
  - Docker

---

## 📚 Detailed Service Overview

### **User Service**

- **Technology**: Node.js, Express, PostgreSQL
- **Features**:
  - Secure OTP authentication with rate limiting
  - User profile management
  - Account lockout and recovery mechanisms

### **Expense Service**

- **Technology**: Node.js, Express, MongoDB
- **Features**:
  - CRUD operations for expenses
  - Transactional integrity with MongoDB transactions
  - Publishes `EXPENSE_CREATED`, `EXPENSE_DELETED` etc. events to Kafka

### **Income Service**

- **Technology**: Node.js, Express, MongoDB
- **Features**:
  - CRUD operations for incomes
  - Transactional integrity
  - Publishes `INCOME_CREATED`, etc. events to Kafka

### **Financial Data Service**

- **Technology**: Node.js, Express, MongoDB
- **Features**:
  - Aggregates data from Expense and Income services
  - Analyzes spending habits based on categories, moods, and cognitive triggers
  - Provides data for the Dashboard service and the Smart AI Assistant.
  - Does detailed financial analysis of the user.

### **Dashboard Service**

- **Technology**: Node.js, Express, MongoDB
- **Features**:
  - Aggregates frequently accessed data of the user for instant retrieval.
  - Real-time visualization of financial data
  - Interactive charts and summaries
  - Consumes events from various services.

### **Smart AI Service**

- **Technology**: Node.js, Express, MongoDB, NLP Libraries
- **Features**:
  - Natural language understanding for user queries
  - Adds expenses/incomes through conversational input
  - Generates personalized financial summaries
  - Can respond to personalized financial data questions.

### **Frontend Service**

- **Technology**: React.js, Redux, Socket.io
- **Features**:
  - User authentication and session management
  - Interactive dashboard with real-time updates
  - Chat interface for Smart AI Assistant
  - Responsive design (mobile optimization in progress)

---

## 🛠 Infrastructure & Deployment

### **Docker & Kubernetes**

- **Containerization**:
  - Each microservice is containerized using Docker, ensuring consistent deployment environments.
- **Orchestration**:
  - Kubernetes manages containers, scaling, and service discovery.
  - **Deployments**: Define desired state and manage updates.
  - **Services**: Expose microservices internally and externally.
  - **Ingress Controller (NGINX)**: Routes external traffic to the appropriate services.

### **Event Streaming with Kafka**

- **Kafka Cluster**:
  - Deployed on Kubernetes for scalability and resilience.
- **Zookeeper**:
  - Manages Kafka broker coordination.
- **Topics**:
  - Separate topics for different event types, allowing for efficient event processing.
- **Event Replay**:
  - New services can replay past events to build their current state.

### **Databases**

- **MongoDB**:
  - Handles unstructured data for services like Expense and Income.
  - Deployed with replication for high availability.
- **PostgreSQL**:
  - Manages relational data for the User service.
  - Uses persistent volume claims for data durability.

### **Security and Secrets Management**

- **Kubernetes Secrets**:
  - Securely stores sensitive information like database credentials and API keys.
- **TLS/SSL**:
  - Encrypted communication between services and external clients to ensure data security.

---

## 🎮 Usage

- **Access the Application**:
  - Visit [expensio.codelikh.com](https://expensio.codelikh.com) in your browser.
- **Create an Account**:
  - If you want to simply test things out, login as a guest and try the app.
  - Sign up using your email and complete OTP authentication.
- **Explore Features**:
  - **Add Expenses/Incomes**:
    - Use the forms or interact with the Smart AI Assistant.
  - **View Dashboard**:
    - Analyze your financial data through interactive charts.
  - **Chat with AI Assistant**:
    - Ask for financial summaries or add entries using natural language.
- **Security Measures**:
  - **OTP Limits**:
    - Be mindful of OTP request limits to avoid temporary lockouts.
  - **Data Privacy**:
    - All your data is securely stored and encrypted.
    - Avoid entering any confidential info in the guest user account, as it is public.

---

## 🤝 Contributors

- **Ashutosh Tewari**
  - [GitHub](https://github.com/ashuTew01) | [LinkedIn](https://www.linkedin.com/in/ashutew0117/)
- **Anubhav Pandey**
  - [GitHub](https://github.com/anubhav2025) | [LinkedIn](https://www.linkedin.com/in/anubhav09/)
 
- Contributions are encouraged and welcome. We are looking for a mobile app developer for this app, so if you are interested, do contact us. 

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgements

- **Hack36 Hackathon**:
  - Provided the initial platform and inspiration for Expensio.
- **YouTuber Ed Roh**:
  - For UI inspiration that guided the frontend design.
- **Open-Source Community**:
  - For the amazing tools, libraries, and resources that made this project possible.

---

## 📝 Further Reading

- **Technical Blog**:
  - [Building Expensio - The Journey](https://shorturl.at/Sk4jx)
- **Monolithic Version**:
  - [Expensio 1.0 Repository](https://github.com/ashuTew01/expensio)

---

## 📬 Contact

For any inquiries, feedback, or collaboration opportunities:

- **Email**:
  - [Email me](mailto:krishwave66@gmail.com)
- **Project Issues**:
  - [GitHub Issues](https://github.com/ashuTew01/expensio-2.0-main/issues)
- **LinkedIn**:
  - [Ashutosh Tewari](https://www.linkedin.com/in/ashutew0117)

---

*Made with ❤️ by Ashutosh Tewari and Anubhav Pandey*
