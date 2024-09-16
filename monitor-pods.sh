while true; do
  clear
  echo "Fetching resource usage for pods..."
  kubectl top pods -n expensio-dev
  sleep 0.5
done
