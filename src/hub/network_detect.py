import os
import threading
import time
import datetime

from scapy.all import ARP, sniff

connected_devices = {} # {ip:mac}

# lock for connected_devices dict
lock = threading.Lock()

def process_packet(packet):
    if ARP in packet and packet[ARP].op == 1: # ARP Request
        ip = packet[ARP].psrc
        mac = packet[ARP].hwsrc

        with lock: # Get lock
            if ip not in connected_devices:
                connected_devices[ip] = mac
                print(f"New device connected:\nIP: {ip}\nTime: {datetime.datetime.now()}")

def device_ping():
    while True:
        tmp_connected = {}
        with lock: # Get lock
            tmp_connected = dict(connected_devices) # copy of dict
        for ip, mac in tmp_connected.items():
            response = os.system(f"ping -c 1 {ip}") # Ping device
            if response != 0:
                print(f"Device disconnected:\nIP: {ip}\nTime: {datetime.datetime.now()}")
                del connected_devices[ip]

        time.sleep(10) # 10s

# ARP packet processing thread
arp_thread = threading.Thread(target=lambda: sniff(filter="arp", prn=process_packet, store=0))

# Device ping thread
ping_thread = threading.Thread(target=device_ping)

# Start Threads
arp_thread.start()
ping_thread.start()

# Finish Threads
arp_thread.join()
ping_thread.join()
