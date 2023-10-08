import os
import threading
import time
import datetime
import contextlib

import asyncio
import socketio
import socket
import ipaddress

from scapy.all import ARP, sniff
from user_manager import UserManager

connected_devices = {} # {mac:ip}

# create socket client
sio = socketio.AsyncClient()

# lock for connected_devices dict
lock = threading.Lock()

# User manager
user_m = UserManager()

# Exit program flag
exit_flag = False

# TODO add in:
#   - user verificaiton in process_packet
#   - determine socket functionality with server
#   - check ping del removes from connected_devices
#   - rearrange socket.write() to allow for disconnect
#   - fix exit msg w/ SNIFF

def stop_capture(packet):
    global exit_flag
    return exit_flag

def msg_format(ip):
    int_ip = int(ipaddress.IPv4Address(ip))
    with lock:
        usr_count = len(connected_devices)    

    #msg_str = '{' + str(int_ip) + ':' + str(usr_count) + '}'
    msg_json = {int_ip:usr_count} 

    return msg_json  

def process_packet(packet):
    global connected_devices

    if ARP in packet and packet[ARP].op == 1: # ARP Request
        ip = packet[ARP].psrc
        mac = packet[ARP].hwsrc

        with lock: # Get lock
            if mac not in connected_devices:
                user_m.add_user(mac, ip)
                connected_devices[mac] = ip
                print(f"New device connected:\nIP: {ip}\nTime: {datetime.datetime.now()}")
                sio.emit('new_connection', msg_format(ip)) # send new connection ip to server

def device_ping():
    global exit_flag
    global connected_devices

    while not exit_flag:
        tmp_connected = {}
        with lock: # Get lock
            tmp_connected = dict(connected_devices) # copy of dict
        for mac, ip in tmp_connected.items():
            #with contextlib.redirect_stdout(None): # suppress ping msg
            response = os.system(f"ping -c 1 {ip} > /dev/null 2>&1") # Ping device
            if response != 0:
                print(f"Device disconnected:\nIP: {ip}\nTime: {datetime.datetime.now()}")
                del connected_devices[mac]
                sio.emit('lost_conneciton', msg_format(ip)) # send disconnected ip to server

        time.sleep(10) # 10s

def close_cmd():
    global connected_devices
    # Wait for user input to exit the program
    while True:
        user_input = input()
        if user_input.lower() == "end":
            exit_flag = True
            connected_devices = {}
            sio.disconnect()
            break
# -------------------- Define & Start Threads -----------------

# ARP packet processing thread
arp_thread = threading.Thread(target=lambda: sniff(filter="arp", prn=process_packet, stop_filter=stop_capture, store=0))
# Device ping thread
ping_thread = threading.Thread(target=device_ping)
# Server communications thread
close_thread = threading.Thread(target=close_cmd)

# Start Threads
arp_thread.start()
ping_thread.start()
close_thread.start()

# -------------------- Socket Handling ---------------------

# socket comminications
@sio.event
async def connect():
    print('connected to server')

@sio.event
async def disconnect():
    print('disconnected from server')

async def main():
    # get local hostname
    hostname = socket.gethostname()
    # get ip address
    ip_address = socket.gethostbyname(hostname)
    print(f'IP: {ip_address}')
    port = os.environ.get("PORT", "3001")
    try:
        await sio.connect(ip_address + port)
    except Exception as e:
        print(f'Error Msg: {e}')

if __name__ == '__main__':
    asyncio.run(main())

# ----------------------

# Finish Threads
arp_thread.join()
ping_thread.join()
close_thread.join()

print("COMPLETED")
