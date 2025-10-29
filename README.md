# Hotel Booker Fullstack Application
A modern full-stack web application for managing hotel bookings with a React frontend and Node.js/Express backend.

![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

### Backend Features
- 🔐 **JWT Authentication** – Secure user authentication and authorization
- 📅 **Booking Management** – Full CRUD operations for hotel bookings
- 🛡️ **Input Validation** – Robust request validation middleware
- 🏥 **Health Checks** – API health monitoring endpoints
- 🗄️ **MongoDB Integration** – NoSQL database with Mongoose ODM
- 🔒 **Security** – Password hashing, CORS, and environment protection

### Frontend Features
- 📝 **Booking Form** – Interactive form for creating reservations
- 📋 **Booking List** – Display and manage all bookings
- 🔍 **Booking Details** – Detailed view of individual bookings
- 👤 **Authentication UI** – Modern login and registration interface
- 📱 **Responsive Design** – Mobile-friendly responsive layout
- 🔄 **Real-time Updates** – Dynamic UI updates with API integration

---

## 🛠️ Tech Stack

### Backend
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT (JSON Web Tokens)
- Validation: Joi
- Security: bcrypt, helmet, cors

### Frontend
- Framework: React 18
- State Management: React Hooks
- HTTP Client: Axios
- Styling: CSS3
- Build Tool: Create React App

### Testing
- Backend Testing: Jest, Supertest
- Frontend Testing: Jest, React Testing Library
- E2E Testing: Playwright

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- npm 

### System Architecture Diagram 

![System Architecture](docs/Booking-Fullstackapp.drawio.png)

[Download Full Architecture PDF](docs/Booking-Fullstackapp.pdf)

1. Clone the repository:  
```bash
git clone https://github.com/mohammedghanemi/Hotel-Booker-Fullstack-Application-Tested-with-Playwright-Postman.git
cd backend
npm install
cd frontend
npm install
npm install -D @playwright/test
npx playwright install
```
1. Running the Application:  
```bash
cd frontend
npm start
cd backend 
npm run dev
npx playwright test
```
