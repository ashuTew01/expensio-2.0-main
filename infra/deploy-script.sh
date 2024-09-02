#!/bin/bash

# Check if the secrets folder exists
if [ -d "./secrets" ]; then
  echo "Secrets folder found. Deploying secrets..."
  bash ./secrets/secret-deploy-script.sh
  echo "Secrets deployed."
else
  echo "No secrets folder found. Skipping secrets deployment."
fi

# Deploy in the specified order
echo "Deploying RabbitMQ..."
kubectl apply -f ./k8s/rabbitmq-depl.yaml
echo "RabbitMQ deployed."

echo "Deploying User Service..."
kubectl apply -f ./k8s/user-depl.yaml
echo "User Service deployed."

echo "Deploying Expense Service..."
kubectl apply -f ./k8s/expense-depl.yaml
echo "Expense Service deployed."

echo "Deploying Financial Data Service..."
kubectl apply -f ./k8s/financial-data-depl.yaml
echo "Financial Data Service deployed."

echo "Installing Ingress-Nginx from web..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.2/deploy/static/provider/cloud/deploy.yaml
echo "Ingress-ngnix installed."

echo "Deploying Ingress Service File..."
kubectl apply -f ./k8s/ingress-srv.yaml
echo "Ingress deployed."

echo "Deployment process completed."
