from scapy.all import ARP, sniff
import datetime

connected_devices = {}

def process_packet(packet):
    if ARP in packet:
        ip = packet[ARP].psrc
        mac = packet[ARP].hwsrc
        packet[ARP].show()

        if packet[ARP].op == 1: # ARP Request
            if ip not in connected_devices:
                connected_devices[ip] = mac
                #print(f"New device connected:\nIP: {ip}\nMAC: {mac}\nTime: {datetime.datetime.now()}")

        elif packet[ARP].op == 2: # ARP Reply
            if ip in connected_devices:
                del connected_devices[ip]
                #print(f"Device disconnected:\nIP: {ip}\nTime: {datetime.datetime.now()}")

# sniffing for ARP packets on the network
sniff(filter="arp", prn=process_packet, store=0)
