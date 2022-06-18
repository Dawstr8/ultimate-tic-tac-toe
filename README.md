# Ultimate tic-tac-toe

## General info

The project is an online arena for playing ultimate tic-tac-toe with random opponents and exploring the game solo/with friends.

## Ultimate tic-tac-toe

I've chosen ultimate tic-tac-toe to be the main game in this project because initially, I wanted to implement a bot capable of winning every time with a human player.
I've already implemented a version of this bot in python using the MCTS algorithm for the codingame challenge at https://www.codingame.com/ide/puzzle/tic-tac-toe.
The last version of my code used there is shown in the mcts.py file added to this repository.

## Client

The client side of project is implemented using React and typescript.
I've been using react in my projects for about 2 years now, usually with javascript.

This year I took a class at university where we develop a web application using react and typescript for the client and spring boot for the server.
That's why I've chosen to use typescript in this project too, but that's my first time using it.

## Server

I'm using a node.js server with socket.io library enabling two-way communication between server and client, which is helpful in real-time games implementation.
