import json

class UserManager:

    def __init__(self):
        self.file_path = "users.json"
        self.users_dict = {}

        try:
            with open(self.file_path, "r") as file:
                users_dict = json.load(file)
            print("File Located")
        except IOError as e:
            print(f"An error occurred while writing the file: {e}")


    def verify_user(self, MAC):
        if MAC in self.users_dict:
            return True
        else:
            return False

    def add_user(self, MAC, IP):
        self.clear(IP)
        if MAC in self.users_dict:
            self.users_dict[MAC].append(IP)
        else:
            self.users_dict[MAC] = [IP]
        self.f_save()

    def get_ip(self, MAC):
        if MAC in self.users_dict:
            return self.users_dict[MAC]
        else:
            return []

    def get_mac(self, IP):
        for key, ip_list in self.users_dict.items():
            for val in ip_list:
                if val == IP:
                    return key
                    break

    def clear(self, IP):
        for key, ip_list in self.users_dict.items():
            for val in ip_list:
                if val == IP:
                    self.users_dict[key].remove(val)

    def f_save(self):
        with open(self.file_path, "w") as file:
            json.dump(self.users_dict, file, indent=4)
