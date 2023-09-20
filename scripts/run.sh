#!/bin/bash

#define default port
DEFAULT_PORT=3001
echo "Select port with \"./run.sh [PORTNO]\" (Defult $DEFAULT_PORT)"
echo "Start in dev mode? (Auto-Updating) [y/n]"
read DEV


#Checking if Dev mode active
if [ $DEV == "y" ] || [ $DEV == "yes" ]; then
	DEV=1
	echo "==Starting in Development mode=="
else
	DEV=0
	echo "==Starting in Build mode=="
fi

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
if [ $DEV == 1 ]; then
	npm run dev -- --host&
else
	npm run build
fi

# Build the display manager code.
cd ../display-manager/
npm install
if [ $DEV == 1 ]; then
	npm run dev -- --host&
else
	npm run build
fi

open_browser () {
	sleep 3s
	xdg-open "http://localhost:$PORT/display"
}

# Run the server.
cd ../server
npm install
if [ $DEV == 1 ]; then
	npm run dev
else 
	open_browser&
	npm run start
fi
