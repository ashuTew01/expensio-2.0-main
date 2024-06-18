# Use an official Maven image to build the project
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as the base image
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/goal-management-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]