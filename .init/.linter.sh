#!/bin/bash
cd /home/kavia/workspace/code-generation/delivery-tracker-227447-227456/delivery_tracking_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

