---
title: Self hosting - Installation
description: You can install and run vimu on any operating system that can run a Docker CLI or has python, NodeJS, and go installed. You can use vimu on your local machine or a cloud provider of your choice. You can either install it bare-metal or use Docker.
---

# I# 1. Introduction

**vimu** is a versatile music score analysis tool that enables:

- Score transposition - Shift notes up/down by any number of semitones
- Pattern searching - Find specific melodies, rhythms, and chord patterns across voices
- Key change detection - Uses [AugmentedNet](https://github.com/napulen/AugmentedNet) to identify modulations based on note sequences

**Architecture:**

The application is organized into three main services orchestrated via Docker Compose:

- **vimu:** Frontend service handling the user interface and client-side logic
- **vimu-engine:** Backend service responsible for music analysis and ML processing
- **vimu-pocketbase:** Database service managing authentication and data persistence

These services are containerized and connected through a Docker network, enabling seamless communication while maintaining isolation.

**Tech Stack:**

- Frontend: Vue.js, Nuxt.js
- Backend: FastAPI (ML processing)
- Database: PocketBase (Auth & Data Storage)

**What is Docker?**

Docker is an open-source platform that automates the deployment, scaling, and management of applications using containerization technology. It packages applications and their dependencies into standardized units called containers, ensuring consistent behavior across different environments.

**Key Benefits:**

- Consistent environments across development and production
- Lightweight and efficient resource utilization
- Rapid deployment and scaling capabilities
- Isolation between applications and services

**Docker Compose Overview:**

Docker Compose is a tool for defining and running multi-container Docker applications. It uses YAML files to configure application services, making it easy to manage complex applications with multiple interconnected containers.

**Docker Compose Features:**

- Single command to spin up entire application stack
- Environment variable management and service configuration
- Network creation and container linking
- Volume management for persistent data

# 2. Project Setup & Folder Structure

The project follows this directory structure:

```
vimu-project/
├── .env                      # Root environment variables
├── docker-compose.yml        # Main docker compose configuration
├── vimu/                     # Frontend application
│   ├── Dockerfile
│   ├── src/
│   ├── public/
│   └── package.json
├── vimu-engine/             # Backend service
│   ├── Dockerfile
│   ├── src/
│   ├── requirements.txt
│   └── models/
└── vimu-pocketbase/        # Database service
    ├── Dockerfile
    └── pb_data/            # PocketBase data directory
```

## Installation

**Download and install docker** 
### Prerequisites
- Windows 10 (Pro, Enterprise, or Education) version 1909 or later
- WSL 2 enabled
### Steps
1. **Download Docker Desktop**
    - Visit Docker's official website and download Docker Desktop for Windows.
2. **Install Docker Desktop**
    - Run the installer and follow the on-screen instructions.
    - Ensure "Enable WSL 2 features" is checked during installation.
3. **Start Docker**
    - Launch Docker Desktop from the Start Menu.
    - Wait for Docker to initialize.
4. **Verify Installation**
    - Open PowerShell or Command Prompt and run:
      ```
        docker --version
        ```
    - Run a test container:
        ```
        docker run hello-world
        ```

---

## 2. Install Docker on macOS

### Prerequisites

- macOS 11 (Big Sur) or later
    

### Steps

5. **Download Docker Desktop**
    
    - Visit Docker's official website and download Docker Desktop for macOS.
        
6. **Install Docker**
    
    - Open the downloaded `.dmg` file and drag the Docker icon to the Applications folder.
        
7. **Start Docker**
    
    - Open Docker from the Applications folder.
        
    - Wait for Docker to initialize.
        
8. **Verify Installation**
    
    - Open Terminal and run:
        
        ```
        docker --version
        ```
        
    - Run a test container:
        
        ```
        docker run hello-world
        ```
        

---


**Clone the repositories:**

```bash
# Create and enter project directory
mkdir vimu-project
cd vimu-project

# Clone the repositories
git clone <https://github.com/Flomp/vimu>
git clone <https://github.com/Flomp/vimu-engine>
git clone <https://github.com/Flomp/vimu-pocketbase>

```

**Environment Configuration:**

Create a .env file in the root directory:

```bash
# .env
# Application URL
APP_URL=http://localhost:3000

# API URL
API_URL=http://localhost:5000

# PocketBase Configuration
POCKETBASE_URL=http://localhost:8090
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=securepassword

# Redis Configuration
REDIS_URL=redis://vimu-redis:6379
```

**Docker Compose Configuration:**

Create a docker-compose.yml file in the root directory:

```yaml
version: "3.9"
services:
  vimu:
    container_name: vimu
    build:
      context: ./vimu
      args:
        APP_URL: $APP_URL
        API_URL: $API_URL
        POCKETBASE_URL: $POCKETBASE_URL
    ports:
      - "3000:3000"
  vimu-engine:
    container_name: vimu-engine
    build: ./vimu-engine
    environment:
      - APP_URL=$APP_URL
      - POCKETBASE_URL=$POCKETBASE_URL
      - POCKETBASE_ADMIN_EMAIL=$POCKETBASE_ADMIN_EMAIL
      - POCKETBASE_ADMIN_PASSWORD=$POCKETBASE_ADMIN_PASSWORD
      - REDIS_URL=$REDIS_URL
    ports:
      - "5000:5000"
  vimu-pocketbase:
    container_name: vimu-pocketbase
    build:
      context: ./vimu-pocketbase
    environment:
      - APP_URL=$APP_URL
    ports:
      - "8090:8090"
    volumes:
      - /data/vimu-pocketbase:/pb_data
# Optional redis cache 
  vimu-redis:
    container_name: vimu-redis
    image: redis:latest
    entrypoint: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    volumes:
      - /data/vimu-redis:/data
```

## Local Development Setup

**Prerequisites:**

- Docker and Docker Compose installed
- Basic understanding of terminal/command line

**Launch the Application:**

```bash
# Start all services in detached mode
docker compose up -d

# View logs (optional)
docker compose logs -f
```

**Accessing the Services:**

- Frontend (vimu): [http://localhost:3000](http://localhost:3000)
- Backend API (vimu-engine): [http://localhost:5000](http://localhost:5000)
- PocketBase Admin UI: [http://localhost:8090/_/](http://localhost:8090/_/)
- Redis: localhost:6379

**How to get access of the database**

once your all servers are running then go to the 
```
http://127.0.0.1:8090/_/?installer#
```
![[Pasted image 20250210142618.png|500]]

```
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=securepassword
```

now you can login in your admin account of the pocketbase

```bash
docker compose down
```

**Troubleshooting Tips:**

- Check container logs using `docker compose logs [service-name]`
- Ensure all required ports (3000, 5000, 8090, 6379) are available
- Verify that the .env file is properly configured
- Use `docker compose down -v` to remove volumes and start fresh if needed
