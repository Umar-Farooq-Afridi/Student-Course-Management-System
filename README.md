# Student Course Management System

## About Project

This is a web application that lets students create an account, log in, browse available courses,enroll in the ones they want and manage their own profile. It's built using a standard client server setup, meaning the part the user sees (the website) and the part that handles data and logic (server) are kept separate and talk to each other over the internet using simple web requests.

## How It's Built (Architecture)

1. The Frontend is Built with plain HTML, CSS and JavaScript no frameworks. Pages like login, register, dashboard and profile are static HTML files and JavaScript files handle things like sending form data to the server and updating the page with the response.
2. The Backend Built with Node.js and the Express framework. This is where all the real logic lives: checking if a login is correct, creating new student accounts, handling course enrollments and so on. The backend is organized into small, focused pieces routes decide which URL does what, controllers contain the actual logic and middleware handles crosscutting tasks like authentication and error handling. Keeping things separated this way makes the code easier to read, test and fix.
3. The Database a MySQL relational database stores three main things: students, courses, and enrollments (which student is taking which course). These three tables are connected to each other so the system always knows exactly who's enrolled in what and it won't let the samestudent enroll in the same course twice.

When a student uses the site, the frontend sends a request to the backend, the backend checks the database if needed and then sends a response back that the frontend displays. This requestresponse cycle happens every time a student logs in, views courses, enrolls or updates their profile.

### Technologies Used

- Node.js + Express: runs the backend server and handles incoming requests
- MySQL: stores all the data in organized, related tables
- HTML, CSS, JavaScript: builds the pages the student interacts with
- JWT (JSON Web Tokens): keeps track of who's logged in without needing to store login sessions on the server
- Bcrypt: scrambles (hashes) passwords before they're ever saved
- express-validator: checks that incoming data (like emails and passwords) is properly formatted before it's processed

### Security Measures

- Passwords are never stored as plain text. Every password is run through bcrypt, which turns it into a scrambled, one-way hash. Even if the database were somehow exposed, the original passwords could not be recovered from it.
- Login is protected with tokens, not stored sessions. When a student logs in, they receive a signed token (JWT) that proves who they are on future requests. This token expires automatically after a set time so it can't be used forever if it's ever leaked.
- Every input is checked before it's used. Forms like registration and login validate that the email looks like an email, the password meets a minimum length and required fields aren't left empty this stops obviously bad or malicious data from ever reaching the database.
- The database uses parameterized queries. Instead of directly inserting user input into SQL commands, the system uses placeholders that the database library fills in safely. This is the standard defense against SQL injection attacks, one of the most common ways databases get compromised.
