

# Coding Platform Project

This project is a coding platform built with Node.js and Next.js. It features a backend powered by Node.js, PostgreSQL as the database, and Docker for code execution using Dockerode. The frontend is built with Next.js and styled using ShadCN.
<img width="1440" height="793" alt="Screenshot 2025-08-27 at 12 09 19 PM" src="https://github.com/user-attachments/assets/f5e8a505-8bb0-49bb-bcca-5b3a0e421d0d" />
<img width="1440" height="791" alt="Screenshot 2025-08-27 at 12 12 36 PM" src="https://github.com/user-attachments/assets/45568326-f304-416c-9a40-c2849f905eff" />

### Link for the presentation - [Link]([url](https://drive.google.com/file/d/1_lIZp1gsngGv1QrOGadXydkq0Gg1SkxZ/view?usp=sharing))
## Features
- Backend: Node.js, PostgreSQL, Docker (Dockerode)
- Frontend: Next.js, ShadCN
- Containerized Python code execution

## Requirements
- Node.js
- Docker
- PostgreSQL

## Backend Setup

1. **Clone the repository**:

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Setup PostgreSQL**:
    - Ensure PostgreSQL is running on your system.
    - Create a new database and update the connection details in the `.env` file.

4. **Build Docker Container**:
    ```bash
    docker build -t python-executor .
    ```

5. **Run the Backend**:
    ```bash
    npm start
    ```

    This will start the Node.js server using Nodemon.

## Frontend Setup

1. **Navigate to the frontend directory**:
    ```bash
    cd ../frontend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the Frontend**:
    ```bash
    npm run dev
    ```

    This will start the Next.js development server.

## Directory Structure

```plaintext
coding-platform/
│
├── backend/           # Node.js backend code
│   ├── Dockerfile     # Docker configuration for code execution
│   ├── src/           # Source code for backend
│   ├── .env           # Environment variables
│   └── ...
│
├── frontend/          # Next.js frontend code
│   ├── app/         # app and components
│   ├── styles/        # ShadCN styling
│   └── ...
│
└── README.md          # This file
```

## Docker Configuration

- **Dockerfile**: The Dockerfile in the backend directory is used to build the container for executing Python code.

    ```Dockerfile
    # Example Dockerfile for Python code execution
    FROM python:3.8-slim

    WORKDIR /app

    COPY . /app

    CMD ["python", "executor.py"]
    ```

- **Dockerode**: The backend uses Dockerode to manage Docker containers programmatically.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
