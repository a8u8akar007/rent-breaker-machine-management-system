# RentBreaker: Heavy Machine Management System

RentBreaker is a robust, full-stack MERN (MongoDB, Express, React, Node.js) application designed for equipment rental businesses. It streamlines the management of heavy machinery, customer relations, rental contracts, and maintenance scheduling.

## 🚀 Demo Readiness
This project is built to showcase a professional industrial management system with a focus on real-time data, security, and premium user experience.

### 🎯 Project Purpose
Equipment rental companies often struggle with tracking machine availability, maintenance cycles, and pending payments. RentBreaker provides a centralized dashboard to monitor fleet health, automate billing calculations, and manage customer life-cycles efficiently.

### 👥 Target Users
- **Operations Managers**: Track fleet utilization and deployment.
- **Maintenance Teams**: Log issues and schedule repairs.
- **Sales/Front Desk**: Manage rentals and customer profiles.
- **Admins**: Oversee user roles and system-wide reports.

## 🛠 Tech Stack
- **Frontend**: React.js (Vite), Context API, Vanilla CSS (Premium Pastel Theme).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT & Bcrypt.js.
- **API**: RESTful Architecture.

## ✨ Core Features
- **Fleet Management**: CRUD operations for heavy machinery with status tracking.
- **Customer Directory**: Centralized database for client history.
- **Rental Engine**: Manage rental start/end dates with automatic balance calculation.
- **Maintenance Logs**: Track repair costs and machine downtime.
- **Unified Dashboard**: Real-time stats on revenue, utilization, and recent activity.

## 🔑 Security Features
- **JWT-based Auth**: Secure tokens for API requests.
- **Password Hashing**: Bcrypt encryption for user data.
- **Protected Routes**: Middleware that restricts unauthorized access to management modules.

## 🔧 Installation & Setup
1. **Clone the repository**
2. **Install Backend Dependencies**: `npm install`
3. **Install Frontend Dependencies**: `cd frontend && npm install`
4. **Environment Variables**: Create a `.env` file in the root with `MONGO_URI`, `JWT_SECRET`, and `PORT`.
5. **Run the App**: `npm run dev` (from root if using concurrently) or run backend and frontend separately.
