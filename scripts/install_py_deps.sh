#!/bin/bash

# List of non-standard libraries and their corresponding installation names
dependencies=(
    "asyncio:asyncio"
    "socketio:python-socketio[client]"
    "ipaddress:ipaddress"
    "scapy:scapy"
)

for dependency in "${dependencies[@]}"; do
    name="${dependency%%:*}"
    install_name="${dependency##*:}"

    if python -c "import $name" &> /dev/null; then
        echo "$name is already installed"
    else
        pip install "$install_name"
        echo "Installed $name"
    fi
done

