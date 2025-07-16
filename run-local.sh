#!/bin/bash

echo "Starting Job Emailer Manager - Frontend"
echo "======================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Starting Next.js development server..."
echo "Frontend will be available at: http://localhost:3000"
echo "Make sure backend is running at: http://localhost:8000"
echo ""

npm run dev