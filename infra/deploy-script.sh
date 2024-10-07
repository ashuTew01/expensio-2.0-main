#!/bin/bash

# Define colors for cool output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "                                                                      "
echo "     ███████╗██╗  ██╗██████╗ ███████╗███╗   ██╗███████╗██╗ ██████╗    "
echo "     ██╔════╝╚██╗██╔╝██╔══██╗██╔════╝████╗  ██║██╔════╝██║██╔═══██╗   "
echo "     █████╗   ╚███╔╝ ██████╔╝█████╗  ██╔██╗ ██║███████╗██║██║   ██║   "
echo "     ██╔══╝   ██╔██╗ ██╔═══╝ ██╔══╝  ██║╚██╗██║╚════██║██║██║   ██║   "
echo "     ███████╗██╔╝ ██╗██║     ███████╗██║ ╚████║███████║██║╚██████╔╝   "
echo "     ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝ ╚═════╝    "
echo "                                                                      "


echo -e "${GREEN}********************** STARTING EXPENSIO BACKEND DEPLOYMENT **********************${NC}"

# Check if the secrets folder exists
if [ -d "./secrets" ]; then
  echo -e "${GREEN}Secrets folder found. Deploying secrets...${NC}"
  bash ./secrets/secret-deploy-script.sh
  echo -e "${GREEN}Secrets deployed.${NC}"
else
  echo -e "${RED}No secrets folder found. Skipping secrets deployment.${NC}"
fi

# Function to check the rollout status of a deployment
check_rollout_status() {
  local deployment_name=$1
  echo -e "${GREEN}Waiting for ${deployment_name} to roll out...${NC}"
  sudo kubectl rollout status deployment/${deployment_name} -n expensio-dev
  if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment ${deployment_name} failed. Exiting...${NC}"
    exit 1
  else
    echo -e "${GREEN}${deployment_name} successfully deployed.${NC}"
  fi
}

# Function to check if a specific port is open on a pod (used to check Kafka/Zookeeper)
check_service_readiness() {
  local pod_label=$1
  local port=$2
  local pod_name=$(sudo kubectl get pod -l app=${pod_label} -n expensio-dev -o jsonpath="{.items[0].metadata.name}")

  echo -e "${GREEN}Checking if ${pod_label} is ready on port ${port}...${NC}"
  for i in {1..10}; do
    echo -e "${GREEN}Attempt $i: Checking port ${port} on pod ${pod_name}...${NC}"
    sudo kubectl exec -n expensio-dev ${pod_name} -- nc -zv localhost ${port}
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}${pod_label} is ready and accepting connections on port ${port}.${NC}"
      return 0
    fi
    echo -e "${RED}${pod_label} is not ready yet. Retrying in 20 seconds...${NC}"
    sleep 20
  done

  echo -e "${RED}${pod_label} did not start within the expected time. Exiting...${NC}"
  exit 1
}

# Function to apply kubectl YAML files with cool output
apply_yaml() {
  local yaml_file=$1
  echo -e "${GREEN}Applying ${yaml_file}...${NC}"
  sudo kubectl apply -f ${yaml_file}
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to apply ${yaml_file}. Exiting...${NC}"
    exit 1
  fi
}

############################### DEPLOYMENT STEPS

# Deploy in the specified order
echo -e "${GREEN}***************** DEPLOYING KAFKA ******************${NC}"

echo -e "${GREEN}Making PVC for Kafka...${NC}"
apply_yaml ./k8s/kafka/pvc.yaml
echo -e "${GREEN}PVC created. Waiting for 10 seconds...${NC}"
sleep 10

echo -e "${GREEN}Deploying Zookeeper...${NC}"
apply_yaml ./k8s/kafka/zookeeper-depl.yaml
check_rollout_status "zookeeper-depl"
check_service_readiness "zookeeper" 2181  # Check if Zookeeper is listening on port 2181

echo -e "${GREEN}Deploying Kafka...${NC}"
apply_yaml ./k8s/kafka/kafka-depl.yaml
check_rollout_status "kafka-depl"
echo -e "${GREEN}Waiting for 60 Seconds for Kafka to be ready..${NC}"
sleep 60

echo -e "${GREEN}Deploying Kafka Create Topics Job...${NC}"
apply_yaml ./k8s/kafka/kafka-create-topics-job.yaml
echo -e "${GREEN}Kafka Create Topics Job deployed.${NC}"

echo -e "${GREEN}***************** DEPLOYING KAFKA DONE ******************${NC}"

echo -e "${GREEN}**************** DEPLOYING MICROSERVICES ******************${NC}"

services=("user" "expense" "income" "financial-data" "dashboard" "smart-ai")

for service in "${services[@]}"; do
  echo -e "${GREEN}Deploying ${service^} Service...${NC}"
  apply_yaml "./k8s/${service}-depl.yaml"
  check_rollout_status "${service}-depl"
done

echo -e "${GREEN}**************** DEPLOYING MICROSERVICES DONE ******************${NC}"

echo -e "${GREEN}**************** DEPLOYING INGRESS ******************${NC}"

echo -e "${GREEN}Installing Ingress-Nginx from web...${NC}"
apply_yaml "https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml"
echo -e "${GREEN}Ingress-nginx installed.${NC}"
echo -e "${GREEN}Waiting for 10 Seconds for Ingress to be ready..${NC}"
sleep 10

echo -e "${GREEN}Deploying Ingress Service File...${NC}"
apply_yaml ./k8s/ingress-srv.yaml
echo -e "${GREEN}Ingress deployed.${NC}"

echo -e "${GREEN}**************** DEPLOYING INGRESS DONE ******************${NC}"

echo -e "${GREEN}**************** EXPENSIO BACKEND DEPLOYMENT COMPLETE ******************${NC}"
