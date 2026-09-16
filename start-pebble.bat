@echo off
echo Starting Pebble Storefront & Admin Server...
start "" http://localhost:8000/
start "" http://localhost:8000/admin.html
node server.js
pause
