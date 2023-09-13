#!/bin/bash

#define default port
DEFAULT_PORT=3001

#Check if port supplied
if [ "$1" ]; then
	PORT=$1
else
	PORT=$DEFAULT_PORT
fi

export PORT=$PORT

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
