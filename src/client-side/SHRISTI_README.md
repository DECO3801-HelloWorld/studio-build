# How to set up development

First, ensure that NODE is installed on your device. It's different for every device but [here](https://nodejs.dev/en/learn/how-to-install-nodejs/) is a good starting point.
Next run:
```
npm install
```
in this directory.

## Launching the webpage
in this directory, run the command
```
npm run dev -- --host
```
This should start the development environment where you can visit the webpage. eg (http://localhost:5173)
From here you can make changes to the project and it is automatically reflected in your browser.

## Where to start
The main file that you want to work on is ./src/App.jsx. This is where the application is rendered. I've written some template code to get you started and comfortable.
I've also written a NetworkManager module that handles a few networking events in the client application. Expand on these with the functionality you want to implement.

## How do I use react?
A good starting point is the [react documentation](https://react.dev/learn). It's really user friendly and teaches you some react concepts.
A great introductory video by Fireship is [React in 100 Seconds](https://youtu.be/Tn6-PIqc4UM?si=s8NsLG1w_zm6ZbpF).
For a more in-depth guide into the react features, [this video](https://youtu.be/Rh3tobg7hEo?si=kpDRmIeZhm6lcIAI) was really helpful for me.

## What are .jsx files?
Jsx files are a variation of javascript that lets you write html elements along with js code. Again see the [react documentation](https://react.dev/learn). 

## What's the deal with websockets?
A bi-directional communication with a server. [This video](https://youtu.be/1BfCnjr_Vjg?si=X3s6nZNpISeiAv4_) explains it well.

## Good luck
If you have any more questions please reach out.
Also make sure that you're working on your Client-UI branch on github.

~Benjamin
