#!/bin/bash

echo "Setting up Git for job-emailer-manager-front-end"
echo "================================================"

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    git branch -M master
fi

# Set up git config for multi-account setup
git config user.email "adam@freemer.com"
git config user.name "Adam Freemer"

# Add remote with multi-account format
git remote add origin git@github.com-personal:AdamFreemer/job-emailer-manager-front-end.git

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Next.js frontend with Google OAuth and job tracking"

# Push to GitHub
git push -u origin master

echo ""
echo "Done! Your frontend is now on GitHub."
echo "Repository: https://github.com/AdamFreemer/job-emailer-manager-front-end"