# Realyze - AI-Powered Real Estate Discovery

Welcome to the Realyze project! This project is an AI-powered real estate discovery platform with a React frontend and a Django REST framework backend.

This README provides instructions on how to set up and run the project locally.

## Table of Contents

- [Realyze - AI-Powered Real Estate Discovery](#realyze---ai-powered-real-estate-discovery)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [Running the Project](#running-the-project)
  - [Project Structure](#project-structure)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js and npm or pnpm:** For the frontend development.
  - [Install Node.js](https://nodejs.org/)
  - [Install pnpm](https://pnpm.io/installation)
- **Python 3.8+ and pip:** For the Django backend.
  - [Install Python](https://www.python.org/downloads/)
- **PostgreSQL:** The database used by the backend.
  - [Install PostgreSQL](https://www.postgresql.org/download/)
- **Git:** For cloning the repository.
  - [Install Git](https://git-scm.com/downloads)

## Frontend Setup

1. **Navigate to the project root directory** in your terminal.
2. **Install frontend dependencies** using pnpm:

   ```bash
    pnpm install
   ```

3. **Configure frontend environment variables** (if any). You might need a `.env` file in the frontend root directory as well, depending on your frontend configuration.

## Backend Setup

1. **Navigate into the `backend` directory:**

    ```bash
    cd backend
    ```

2. **Create and activate a Python virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On macOS/Linux
    # venv\Scripts\activate    # On Windows
    ```

3. **Install backend dependencies:**
  
    ```bash
    pip install -r requirements.txt
    ```

4. **Create a `.env` file** in the **backend root directory** (where `manage.py` is located).

    ```env
    SECRET_KEY='your_super_secret_key_here'
    DATABASE_NAME='your_realyze_db_name'
    DATABASE_USER='your_db_user'
    DATABASE_PASSWORD='your_db_password'
    DATABASE_HOST='localhost'
    DATABASE_PORT='5432'
    EMAIL_HOST_USER='your_gmail_address@gmail.com'
    EMAIL_HOST_PASSWORD='your_gmail_app_password' # Use an App Password if you have 2FA on your Gmail account
    FRONTEND_URL='http://localhost:5173' # Or your frontend's actual URL
    ```

    **Replace the placeholder values** with your actual database credentials, Gmail account details, and frontend URL.

    **SECURITY NOTE:** Add `.env` to your `.gitignore` file to prevent committing sensitive information.

5. **Configure PostgreSQL Database:**
    - Ensure your PostgreSQL server is running.
    - Create a database with the name you specified in the `.env` file (e.g., `your_realyze_db_name`).
    - Ensure the database user you specified has privileges to connect to and manage this database.

6. **Run Database Migrations:**
    With your virtual environment activated in the `backend` directory, apply the database schema changes:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

7. **Create a Superuser (Optional but Recommended):**
    You can create an administrator user to access the Django admin panel:
  
    ```bash
    python manage.py createsuperuser
    ```

    Follow the prompts to set up the superuser.

## Running the Project

1. **Start the Django backend server:**
    Navigate to the `backend` directory, activate your virtual environment, and run:

    ```bash
    python manage.py runserver
    ```

    The backend server will typically run at `http://127.0.0.1:8000/`.

2. **Start the React frontend development server:**
    Navigate back to the project root directory and run:
  
    ```bash
    pnpm dev
    ```

    The frontend server will typically run at `http://localhost:5173/`.

3. **Access the application:**
    Open your web browser and go to the frontend URL (defaulting to `http://localhost:5173/`).

## Project Structure

```txt
realyze/
├── backend/               # Django Backend
│   ├── realyze_backend/   # Django Project Settings
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── authentication/    # Django Authentication App
│   │   ├── migrations/
│   │   ├── templates/
│   │   │   └── authentication/
│   │   │       └── password_reset_email.txt
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── manage.py
│   └── requirements.txt
├── client/
│   ├── public/            # Frontend Public Assets
│   ├── src/               # React Frontend Source
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── ui/        # Shadcn UI components
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.js
│   ├── README.md 
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── .gitignore
└── README.md

```
