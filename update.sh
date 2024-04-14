#!/bin/bash

# Enable command tracing
# set -x

# This script resets the main branch to match the remote origin/main

# Function to handle errors
error_handling() {
    echo -e "\n!! Error occurred at line $1\n\n"
    read -p "Press enter to exit..."  # Pause for the user to read the error
    exit 1
}

# Trap any error and call error_handling function
trap 'error_handling $LINENO' ERR

echo -e "\n============================================="
echo -e "\tYT-AUTO-SKIP UPDATE"
echo -e "=============================================\n"

# Reset any changes and check out the latest commit
echo "git reset --hard HEAD"
git reset --hard HEAD 
echo -e "\n=============================================\n"

# Checkout origin/main in detached HEAD state
echo "git checkout origin/main"
git checkout origin/main
echo -e "\n=============================================\n"

# Delete the local main branch
echo "git branch -D main"
git branch -D main
echo -e "\n=============================================\n"

# Create a new main branch from the current state (origin/main)
echo "git checkout -b main"
git checkout -b main
echo -e "\n=============================================\n"

read -p "Process completed. Press enter to exit."
