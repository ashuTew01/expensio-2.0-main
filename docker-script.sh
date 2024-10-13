#!/bin/bash

# Define the base directory where the services are located
SERVICES_DIR="./services"

# Define the list of services
services=("dashboard" "expense" "financial-data" "income" "smart-ai" "user")

# Loop through each service directory, build and push the Docker image
for service in "${services[@]}"; do
  # Define the full path to the service directory
  service_dir="$SERVICES_DIR/$service"

  # Check if the service directory exists
  if [ -d "$service_dir" ]; then
    echo "                                                                      "
    echo "     ███████╗██╗  ██╗██████╗ ███████╗███╗   ██╗███████╗██╗ ██████╗    "
    echo "     ██╔════╝╚██╗██╔╝██╔══██╗██╔════╝████╗  ██║██╔════╝██║██╔═══██╗   "
    echo "     █████╗   ╚███╔╝ ██████╔╝█████╗  ██╔██╗ ██║███████╗██║██║   ██║   "
    echo "     ██╔══╝   ██╔██╗ ██╔═══╝ ██╔══╝  ██║╚██╗██║╚════██║██║██║   ██║   "
    echo "     ███████╗██╔╝ ██╗██║     ███████╗██║ ╚████║███████║██║╚██████╔╝   "
    echo "     ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝ ╚═════╝    "
    echo "                                                                      "

    echo "Building Docker image for $service..."

    # Build the Docker image for the service
    docker build -t ashuz057/expensio-$service:latest "$service_dir"

    # Check if the build was successful
    if [ $? -eq 0 ]; then
      echo "Docker image for $service built successfully."

      # Push the Docker image to Docker Hub
      docker push ashuz057/expensio-$service:latest

      # Check if the push was successful
      if [ $? -eq 0 ]; then
        echo "Docker image for $service pushed successfully to Docker Hub."
      else
        echo "Failed to push Docker image for $service to Docker Hub."
      fi
    else
      echo "Failed to build Docker image for $service."
    fi
    clear
  else
    echo "Service directory $service_dir does not exist. Skipping..."
  fi

  echo "------------------------------------------"
done
echo "                                                                      "
echo "     ███████╗██╗  ██╗██████╗ ███████╗███╗   ██╗███████╗██╗ ██████╗    "
echo "     ██╔════╝╚██╗██╔╝██╔══██╗██╔════╝████╗  ██║██╔════╝██║██╔═══██╗   "
echo "     █████╗   ╚███╔╝ ██████╔╝█████╗  ██╔██╗ ██║███████╗██║██║   ██║   "
echo "     ██╔══╝   ██╔██╗ ██╔═══╝ ██╔══╝  ██║╚██╗██║╚════██║██║██║   ██║   "
echo "     ███████╗██╔╝ ██╗██║     ███████╗██║ ╚████║███████║██║╚██████╔╝   "
echo "     ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝ ╚═════╝    "
echo "                                                                      "
echo "All services processed."
