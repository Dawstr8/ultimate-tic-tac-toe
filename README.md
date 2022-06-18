# Ultimate tic-tac-toe

## General info

The project is an online arena for playing ultimate tic-tac-toe with random opponents and exploring the game solo/with friends.

Deployed at https://grand-jelly-16f720.netlify.app using heroku and netlify (runs slowly there).

## Ultimate tic-tac-toe

I've chosen ultimate tic-tac-toe to be the main game in this project because initially, I wanted to implement a bot capable of winning every time with a human player.
I've already implemented a version of this bot in python using the MCTS algorithm for the codingame challenge at https://www.codingame.com/ide/puzzle/tic-tac-toe.
The last version of my code used there is included in the mcts.py file.

## Client

The client side of project is implemented using React and TypeScript.
I've been using React in my projects for about 2 years now, usually with JavaScript.

This year, at university, I took a course where we developed a web application using React and TypeScript for the client and Spring Boot for the server.
I've just started learning TypeScript and wanted to use it in this project to gain experience.

## Server

I'm using a Node.js server with socket.io library enabling two-way communication between server and client, which is helpful in real-time games implementation.

## How it looks
- lobby
![](https://i.imgur.com/OotbTwr.png)
- gameplay
![](https://i.imgur.com/763HepE.png)

