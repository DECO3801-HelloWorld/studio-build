import os
import threading
import time
import datetime
import contextlib
import argparse

import asyncio
import socketio
import socket
import ipaddress

from scapy.all import ARP, sniff
from user_manager import UserManager

# Getting the port from commandline argument
argument = argparse.ArgumentParser(
        description="Accepts a port number to run on")
argument.add_argument("port", type=int, help="The port number to use")

port_cmd = argument.parse_args().port
if port_cmd is None:
    port_cmd = 3001

connected_devices = {} # {mac:ip}

# create socket client
sio = socketio.Client()

# lock for connected_devices dict
lock = threading.Lock()

# user manager
user_m = UserManager()

# exit program flag
exit_flag = False

# TODO add in:
#   - user verificaiton in process_packet
#   - don't process device and hotspot ARP
#   - fix exit msg w/ SNIF

def stop_capture(packet):
    global exit_flag
    return exit_flag

def msg_format(ip):
    global connected_devices

    int_ip = int(ipaddress.IPv4Address(ip))
    usr_count = len(connected_devices)

    msg_json = {'ip':ip, 'count':usr_count}
    return msg_json

def process_packet(packet):
    global connected_devices

    if ARP in packet and packet[ARP].op == 1: # ARP Request
        ip = packet[ARP].psrc
        mac = packet[ARP].hwsrc

        with lock: # Get lock
            if mac not in connected_devices:
                if user_m.add_user(mac, ip): # checks if server device is being processed
                    connected_devices[mac] = ip
                    print(f"\nNew device connected:\n IP: {ip}")
                    sio.emit('new_connection', msg_format(ip)) # send new connection ip to server
                else:
                    print("\nDevice ARP: avoided")

def device_ping():
    global exit_flag
    global connected_devices

    while not exit_flag:
        tmp_connected = {}
        with lock: # Get lock
            tmp_connected = dict(connected_devices) # copy of dict
        for mac, ip in tmp_connected.items():
            response = os.system(f"ping -c 1 {ip} > /dev/null 2>&1") # Ping device
            if response != 0:
                print(f"\nDevice disconnected:\n IP: {ip}")
                with lock:
                    del connected_devices[mac]
                sio.emit('lost_connection', msg_format(ip)) # send disconnected ip to server

        time.sleep(1) # seconds

def close_cmd():
    global connected_devices
    global exit_flag
    # wait for user input to exit the program
    while True:
        user_input = input()
        if user_input.lower() == "end":
            exit_flag = True
            connected_devices = {}
            break

# -------------------- Define & Start Threads -----------------

# ARP packet processing thread
arp_thread = threading.Thread(target=lambda: sniff(filter="arp", prn=process_packet, stop_filter=stop_capture, store=0))
# device ping thread
ping_thread = threading.Thread(target=device_ping)
# aerver communications thread
close_thread = threading.Thread(target=close_cmd)

# start threads
arp_thread.start()
ping_thread.start()
close_thread.start()

# -------------------- Socket Handling ---------------------

# socket comminications
@sio.event
def connect():
    print(' - - connected to server - - ')

@sio.event
def disconnect():
    print(' - - disconnected from server - - ')

def main():
    # get local hostname
    hostname = socket.gethostname()
    # get ip address
    ip_address = socket.gethostbyname(hostname)
    port = os.environ.get("PORT")
    if port is None:
        port = port_cmd
    try:
        print(f"{ip_address}:{port}")
        sio.connect(f'http://{ip_address}:{port}')
    except Exception as e:
        print(f'Error Message: {e}')

if __name__ == '__main__':
    main()

# -------------------- Ending Processes -----------------

# finish threads
arp_thread.join()
ping_thread.join()
close_thread.join()

# disconnect from server
sio.disconnect()

print(" - - COMPLETED - - ")
