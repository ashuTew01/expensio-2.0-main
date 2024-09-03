#!/bin/bash

# Navigate to the services directory
cd ./services || { echo "Directory './services' not found"; exit 1; }

# Loop through each directory in the services folder
for dir in */; do
  # Check if it is a directory
  if [ -d "$dir" ]; then
    # Navigate into the directory
    cd "$dir" || continue

    # Run npm update @expensio/sharedlib
    echo "Updating @expensio/sharedlib in $dir..."
    npm update @expensio/sharedlib

    # Navigate back to the services directory
    cd ..
  fi
done

echo "Update complete."
