# Skill Assessment & Analytics Platform

A Full Stack Web Application that enables users to take technology-based skill assessments, view their results instantly, and track their performance through an interactive dashboard. The platform also provides administrative features to manage questions and assessments efficiently.

## 🌐 Live Demo

**Frontend:** https://skillspark-test.vercel.app

---

# Project Overview

The Skill Assessment & Analytics Platform is designed to help users evaluate their technical knowledge by taking multiple-choice assessments across different technologies. The system automatically calculates scores, stores assessment history, and provides performance analytics through an intuitive user interface.

---

# Features

## User Module

- User Registration
- Secure Login Authentication
- Technology-wise Skill Assessments
- Multiple Choice Questions (MCQs)
- Timer-based Test Interface
- Instant Score Calculation
- View Test History
- Performance Dashboard
- Responsive User Interface

## Admin Module

- Add Questions
- Update Questions
- Delete Questions
- Manage Technologies
- View User Performance
- Manage Assessments

---

# Tech Stack

## Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router DOM
- Axios

## Backend

- Node.js
- Express.js

## Database

- MySQL

## Development Tools

- Git
- GitHub
- Vercel
- VS Code
- Postman

---

# Project Structure

```
skillspark-test
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── models
│   └── server.js
│
├── src
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── services
│   ├── utils
│   └── App.tsx
│
├── public
├── package.json
├── vite.config.ts
└── skillspark.sql
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/harshitha-040/skillspark-test.git
```

## Navigate to the Project

```bash
cd skillspark-test
```

## Install Frontend Dependencies

```bash
npm install
```

## Start the Frontend

```bash
npm run dev
```

## Start the Backend

```bash
cd backend
npm install
npm start
```

---

# Database Setup

1. Create a MySQL database.

```sql
CREATE DATABASE skillspark;
```

2. Import the provided SQL file.

```
skillspark.sql
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=skillspark

JWT_SECRET=your_secret_key
```

---

# Application Workflow

1. User registers or logs into the platform.
2. Selects a technology for assessment.
3. Attempts multiple-choice questions.
4. Submits the assessment.
5. Backend evaluates the answers.
6. Scores are stored in the MySQL database.
7. Users can review their previous attempts and performance statistics.

---

# Key Functionalities

- Authentication & Authorization
- RESTful API Integration
- CRUD Operations
- Secure Database Connectivity
- Responsive Design
- Real-time Score Evaluation
- Performance Tracking
- Modular Component Architecture

---

# Future Enhancements

- Difficulty Levels
- Randomized Question Generation
- Leaderboard
- Certificate Generation
- Email Notifications
- Test Scheduling
- Export Results as PDF
- Detailed Analytics Dashboard

---

# Skills Demonstrated

- Full Stack Web Development
- React.js
- TypeScript
- Node.js
- Express.js
- REST API Development
- MySQL Database Design
- CRUD Operations
- Authentication
- Responsive Web Design
- Git & GitHub
- Project Deployment using Vercel

---

# Screenshots

## Home Page

_Add screenshot_

## Login Page

_Add screenshot_

## Assessment Page

_Add screenshot_

## Result Dashboard

_Add screenshot_

---

# Author

**Harshitha**

GitHub: https://github.com/harshitha-040

---

# License

This project is intended for educational and portfolio purposes.
