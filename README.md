# Real time forum

## Overview

This project is a forum application that includes features such as user registration and login, post creation, commenting on posts, and private messaging. The application is designed as a single-page application (SPA) with a Golang backend using SQLite for data storage and JavaScript for handling frontend events and WebSocket communication.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)

## Features

### 1. Registration and Login:
   - Users can register into the forum by providing a nickname, age, gender, firstname, lastname, email, and password.
   - Users are able to  connect using either the nickname or the e-mail combined with the password.
   - Users are able to log out from any page one the forum.

### 2. Posts and Comments:
   - Users can create posts (each post can have at least on category)
   - For each post, user can create a comment.
   - Users can see posts in a feed display.
   - Both posts and comments can be liked or disliked

### 3. Private Messages:
   - Users can send private messages to each other.
   - Real-time chat with an online/offline section organized by the last message sent.
   - Messages are displayed using infinite scroll. 10 messages are loaded when the user scroll up

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://learn.zone01dakar.sn/git/frdiouf/real-time-forum.git
    ```

2. **Install Dependencies:**
    ```bash
    go mod download
    ```

3. **Run the Application:**
    ```bash
    go run .
    ```

## Authors
**[cheikhndiaye9](https://learn.zone01dakar.sn/git/cheikhndiaye9)**<br>
**[frdiouf](https://learn.zone01dakar.sn/git/frdiouf)**<br>


