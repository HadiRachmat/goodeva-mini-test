# goodeva-mini-test

## Table of Contents
- [About](#about)
- [Getting Started](#getting-started)
  - [Running the Application](#running-the-application)
    - [Front-End (FE)](#front-end-fe)
    - [Back-End (BE)](#back-end-be)
  - [Node Version](#node-version)
- [Technical Decisions](#technical-decisions)

## About
This repository is a mini test project showcasing the integration of front-end (React, TypeScript, Vite) and back-end (Nest.js).

## Getting Started
The project is divided into two main parts:

### Running the Application
#### Front-End (FE)
Make sure you are in the `/goodeva-technology-test-fe` directory. To start the front-end application:
```bash
npm install
npm run dev
```
By default, Vite will start a development server at [http://localhost:5173/](http://localhost:5173/).

#### Back-End (BE)
Make sure you are in the `/goodeva-technology-test-be` directory. To start the back-end application:
```bash
npm install
npm run start:dev
```
By default, Nest.js will start a development server at [http://localhost:3000/](http://localhost:3000/).

### Node Version
The project is built using Node.js version **16.x.x**. It is recommended to use a version manager such as [nvm](https://github.com/nvm-sh/nvm) to match the required version.

## Technical Decisions
1. **TypeScript as Base Language:** Chosen to leverage static typing and improved developer experience both in the front-end and back-end.
2. **Vite over Create React App (CRA):** Selected for faster build times and optimized development workflow.
3. **Nest.js for Back-End:** To facilitate a modular project structure and scalability with support for TypeScript intrinsically.