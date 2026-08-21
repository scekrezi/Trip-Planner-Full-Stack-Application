# Trip Planner Application

A full-stack trip planning application built with **Java, Spring Boot, MySQL, React, JavaScript, and REST APIs**.

The application allows users to create trips, organize itineraries, invite participants, and manage role-based access.

## Features

* Create and manage trips
* Add destinations and itinerary items
* Invite and manage trip participants
* Assign role-based permissions
* Perform CRUD operations across trip-related resources
* Validate requests and handle application errors
* Store and manage data using MySQL
* Connect a React frontend with Spring Boot REST APIs

## Tech Stack

**Backend**

* Java
* Spring Boot
* Spring Framework
* REST APIs
* Maven

**Frontend**

* React
* JavaScript
* HTML/CSS
* Bootstrap

**Database**

* MySQL
* Relational database design

**Tools**

* Git & GitHub
* IntelliJ IDEA
* Postman
* DBeaver

## Architecture

The backend follows a layered architecture:

```text
React Frontend
      |
      v
REST API
      |
      v
Controller
      |
      v
Service
      |
      v
Repository / Data Access
      |
      v
MySQL Database
```

This structure separates request handling, business logic, and data access to make the application easier to maintain and extend.

## API & Database

The backend exposes RESTful endpoints for:

* Trip management
* Itinerary management
* Destinations
* Participant invitations
* User and participant management
* Role assignment and access control

The relational data model includes:

* Users
* Trips
* Destinations
* Itinerary Items
* Participants
* Invitations
* Roles / Permissions


## Running Locally

### Prerequisites

* Java
* Maven
* MySQL
* Node.js
* npm
* Git

### Clone the repository

```bash
git clone https://github.com/scekrezi/Trip-Planner-Full-Stack-Application.git
cd Trip-Planner-Full-Stack-Application
```

### Backend

```bash
cd server
mvn spring-boot:run
```

Configure your MySQL connection in the application configuration before starting the backend.

### Frontend

```bash
cd client
npm install
npm start
```

## Project Structure

```text
Trip-Planner-Full-Stack-Application/
├── client/     # React frontend
├── server/     # Java / Spring Boot backend
└── README.md
```

## What I Learned

This project strengthened my experience with:

* Java and object-oriented programming
* Spring Boot REST API development
* Controller-Service-Repository architecture
* Relational database design with MySQL
* CRUD operations
* Frontend and backend integration
* Role-based permissions
* Validation and error handling
* Git-based development workflows
* Debugging across application layers

## Future Improvements

* Expand automated testing
* Improve authentication and authorization
* Add Docker support
* Deploy the application to the cloud
* Add CI/CD
* Improve responsive UI
* Add notifications for invitations and itinerary updates

## Author

**Sindi Cekrezi**

Full Stack Developer with experience in Java, Spring Boot, Angular, .NET, REST APIs, SQL, Azure, and modern software development practices.

* GitHub: [scekrezi](https://github.com/scekrezi)
* LinkedIn: (https://linkedin/in/sindicekrezi)
