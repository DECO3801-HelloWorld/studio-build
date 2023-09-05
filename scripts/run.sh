#!/bin/bash

# Build the client code.
cd ./src/client-side
npm install
npm run build

# Build the display manager code.
cd ../display-manager/
npm install
npm run build

# Run the server.
cd ../server
npm install
npm run start
