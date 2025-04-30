# AMA - Energy Efficiency and Management Platform

This project, titled AMA, is an Energy Efficiency and Management Platform developed for the Project 2 course at ESMAD. It aims to provide users with tools to monitor and manage their energy consumption, promote energy efficiency, and offer insights into energy usage patterns. The platform consists of a client-side application built with Vue.js and a server-side application using Node.js and Express, with data storage managed (though the specifics aren't detailed in the provided file list).

## Features

*   User authentication (login/register)
*   Dashboard with energy consumption monitoring
*   Data visualization through charts and graphs
*   User profile settings
*   Admin panel for user and system management

## Client Setup

The client-side application is built with Vue.js and Vite.

1.  Navigate to the `client` directory:

    ```sh
    cd client
    ```
2.  Install dependencies:

    ```sh
    npm install
    ```
3.  Run the development server:

    ```sh
    npm run dev
    ```

## Server Setup

The server-side application is built with Node.js and Express.

1.  Navigate to the `server` directory:

    ```sh
    cd server
    ```
2.  Install dependencies:

    ```sh
    npm install
    ```
3.  Start the server:

    ```sh
    npm run dev
    ```

## Database Population

The project includes a Python script (`populateDB.py`) to generate fake data for the database.

1.  Run the script:

    ```sh
    python populateDB.py
    ```
2.  The script will generate a `populateDB.sql` file.
3.  Execute this SQL file against your database to populate it.

## Team members
*   Andres Gouveia
*   Fabio Correia
*   Diana Gonçalves
