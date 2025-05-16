# secure-react-app
This is a group project for the Secure Programming course at Tampere Universities, by [Mikko Tuominen](https://github.com/tuo-mikko) and [Olivia Takkinen](https://github.com/olivena).

It is a simple React + Node application for the popular television series White Lotus, that takes into account OWASP guidelines and security risks in [frontend](https://github.com/tuo-mikko/secure-react-app/tree/main/packages/frontend) and [backend](https://github.com/tuo-mikko/secure-react-app/tree/main/packages/backend) for [API](https://owasp.org/www-project-api-security/) and [Client side](https://owasp.org/www-project-top-10-client-side-security-risks/) security.

## How to run it?

Running the software requires the Node ≥ 18.

After cloning the repository, navigate to the root of the project. Then install dependencies with:

`npm run bootstrap`

After the dependencies finish loading, start both the backend and frontend in a single terminal with:

`npm start`

Now, the system should be up and running.

Front-end: http://localhost:3000
Back-end API: http://localhost:3001/api

The user would then have to fill out the secrets into the .env file, but for the practicality of this course and it's personnel, the file is fully available filled out.

## Software
This repository contains two main applications—a frontend and a backend—that together implement a secure, token-based forum system. Both are written in TypeScript and can be found under the packages/. Below is a simple overview of the system.

![image](https://github.com/user-attachments/assets/4bb6b1a9-01e3-43fa-b1cb-cae45d6e5f53)

### Frontend
The frontend is a React single-page application built with:
* React 18 & TypeScript
* React Router for client-side navigation
* Chakra UI for user interface
* react-hook-form for form state and validation
* Axios as a gateway to the backend:
  * Automatically attaches HTTP-only cookies to every request
  * Includes a response interceptor that, on 401, attempts a silent /refresh and retries once
* Authentication state is held in React context (or App.tsx state)
  * All “create” buttons and protected pages only render when the user is logged in
  * On a failed refresh or logout, the client clears the user state and hides protected UIs

### Backend
The backend is a Node.js + Express API, responsible for business logic, data validation and access to MongoDB. The serverside is built with:

* TypeScript for end-to-end type safety
* Express for routing and middleware
* Mongoose for MongoDB schemas and models
  * Strictly typed schemas with field validations (required, max length)
  * toJSON transforms to hide sensitive data and prevent it ending up in the front
* Authentication with short-lived JWT access tokens and long-lived refresh tokens
  * Tokens are issued as HTTP-only, Secure, SameSite=Lax cookies
  * Refresh tokens are random 64-byte strings, hashed with bcrypt, and stored in the database into a refreshTokens collection
  * /api/refresh rotates the refresh token: validates the provided cookie against the database hash, issues new tokens, and updates the stored hash
  * /api/logout clears both cookies and deletes the matching refresh token from the database
* Security hardening
  * Rate limiting with express-rate-limit to block brute-force and DoS attempts
  * Structured logging (e.g. Winston) of all auth events—successful logins, failures, refresh attempts, unauthorized access—with IP addresses and timestamps
  * Default-deny on protected routes, middleware checks for a valid access token cookie and rejects all other requests
* Api specification detailing every route, request/response schema, and security schema
* SBOM generation using CycloneDX to produce machine-readable inventories of all dependencies


## API

A description of the API, requests and responses and authentication can be found in the [OpenAPI.yaml](https://github.com/tuo-mikko/secure-react-app/blob/main/openAPI.yaml). The file is best viewed in the [Swagger Editor](https://editor.swagger.io/). The file contents can be either copied into the editor or uploaded as a file.


## Contributing (development process)

Basic Git flow for the project when developer starts a new feature:

- Checkout development branch and pull latest commits

  `git checkout development`

  `git pull`

- Make a new branch from development branch (All feature branches should start with a "feature/" prefix)

  `git checkout -b feature/*`

- When feature is done push your code into remote  

   `git push -u origin [name of your local branch]`

  and open a new pull request from GitHub into development branch and ask someone to review it

- When someone has accepted the pull request developer can merge it into development branch
- When releases are made development branches are merged into main with pull requests

