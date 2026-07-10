BookMyShow - clone project

Developer : Elsa Mathew

Introduction :

        A full-featured Movie Ticket Booking System inspired by BookMyShow, built using Django, Django REST Framework, HTML, CSS, JavaScript, and SQLite.

Project Overview

        This application allows users to browse movies, view show timings, select seats, make bookings, and download tickets. The system supports three roles:

            1.Admin
            2.Theatre Owner
            3.User

        Each role has dedicated functionalities for managing movies, theatres, shows, bookings, and users.


Features

    Admin Module

            * Admin Dashboard
            * Manage Theatres
            * View Booking Statistics
            * Monitor Revenue
            * View User Details
            * View Theatre Details

    Theatre Module

            * Theatre Dashboard
            * Manage Screens
            * Manage Sections
            * Auto Seat Generation
            * Manage Movies
            * Manage Shows
            * View Theatre Bookings
            * View Revenue Reports

    User Module

            * User Registration & Login
            * Browse Movies
            * View Movie Details
            * Select Theatre & Show Time
            * Seat Selection
            * Ticket Generation




Movie Management

        * Add/Edit/Delete Movies
        * Upload Movie Posters
        * Add Trailer Links
        * Manage Languages
        * Manage Genres
        * Add Cast Details
        * Add Crew Details
        * Set Movie Status

Theatre Management

        * Add/Edit/Delete Theatres
        * Assign Theatre Owners
        * Manage Screens
        * Screen-wise Sections
        * Dynamic Seat Creation

Booking System

        * Seat Selection
        * Prevent Double Booking
        * Booking Confirmation
        * Ticket Generation
        * QR Code Support
        * Booking History

Technology Stack

    Backend

        * Python
        * Django
        * Django REST Framework

    Frontend

        * HTML5
        * CSS3
        * JavaScript

    Database

        * SQLite

Project Structure

        Bookmyshow/
            │
            ├── authenticate/
            ├── adminapp/
            ├── theatre/
            ├── user/
            ├── booking/
            │
            ├── templates/
            ├── static/
            ├── media/
            │
            ├── db.sqlite3
            ├── manage.py
            └── README.md

Installation

    Clone Repository            : git clone <repository-url>

    Navigate to Project         : cd Bookmyshow

    Create Virtual Environment  : python -m venv venv

    Activate Environment        : venv\Scripts\activate

    Install Dependencies        : pip install -r requirements.txt

    Run Migrations              : python manage.py makemigrations
                                  python manage.py migrate

    Create Superuser            : python manage.py createsuperuser

    Run Server                  : python manage.py runserver

