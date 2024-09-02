#!/bin/bash

# Delete in reverse order of deployment
echo "Deleting Ingress..."
kubectl delete -f ./k8s/ingress-srv.yaml
echo "Ingress deleted."

echo "Deleting Financial Data Service..."
kubectl delete -f ./k8s/financial-data-depl.yaml
echo "Financial Data Service deleted."

echo "Deleting Expense Service..."
kubectl delete -f ./k8s/expense-depl.yaml
echo "Expense Service deleted."

echo "Deleting User Service..."
kubectl delete -f ./k8s/user-depl.yaml
echo "User Service deleted."

echo "Deleting RabbitMQ..."
kubectl delete -f ./k8s/rabbitmq-depl.yaml
echo "RabbitMQ deleted."

echo "Undo deployment process completed."
