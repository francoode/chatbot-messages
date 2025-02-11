#!/bin/sh

echo "Init app..."
npm run start:dev &

echo "Waiting for migrations..."
sleep 5

echo "Migrations in progress..."
npm run migration:run

echo "Migrations success"
wait  # Espera a que el proceso de `npm run start:dev` termine
