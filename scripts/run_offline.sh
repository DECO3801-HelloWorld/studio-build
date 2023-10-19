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

# Start running user detection
# echo "Checking if python depenencies installed"
# ./scripts/install_py_deps.sh

# Build the client code.
cd ./src/client-side
# npm install
if [ $DEV == 1 ]; then
	npm run dev -- --host&
else
	npm run build
fi

# Build the display manager code.
cd ../display-manager/
# npm install
if [ $DEV == 1 ]; then
	npm run dev -- --host&
else
	npm run build
fi

IP_ADDRESS=$(hostname -I | tr -d ' ')
# open_browser () {
# 	sleep 3s
# 	xdg-open "http://$IP_ADRESS:$PORT/display"
# }


# Run the server.
cd ../server
# npm install
if [ $DEV == 1 ]; then
	npm run dev&
else 
	# open_browser&
	(sleep 5 && echo -e "\n\n==== SERVER IS RUNNING ====" && echo "If your page hasn't opened automatically, go to http://$IP_ADDRESS:$PORT/display")&
	(sleep 10 && cd ../hub && sudo python3 network_detect.py $PORT)&
	npm run start
fi


