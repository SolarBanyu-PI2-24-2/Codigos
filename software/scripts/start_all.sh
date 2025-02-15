#!/bin/sh
chmod +x scripts/start_all.sh

dockerd &

sleep 5

cd backend

docker-compose up --build
