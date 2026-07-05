# Digital Manufacturing & Order Tracking System (MES)

A robust, multi-tenant Full-Stack MERN application designed to simulate a Manufacturing Execution System (MES). This repository demonstrates enterprise-level architecture, including strict data isolation, real-time status tracking, and a digital audit trail.

## Live Demo

https://mes-dashboard-three.vercel.app/

## Demo Credentials

To explore the live application without registering, feel free to use the following test account:

Email: admin@tesla.com

Password: supersecurepassword123



##  Project Overview

This project was built to showcase advanced web development capabilities beyond standard CRUD applications. It simulates a B2B SaaS platform where different manufacturing companies (tenants) can manage their production floors securely without ever seeing each other's data.

The core feature is the Order Status Pipeline. When an operator advances an order from **Pending** to **Cutting** or **Welding**, the system automatically generates an immutable digital audit trail recording exactly who made the change and when.

## Tech Stack & Architecture

### Frontend

- **React (Vite)**: Fast compilation and modern component architecture.
- **Tailwind CSS v4**: Utility-first styling for a sleek dark-mode industrial UI.
- **Recharts**: Real-time visualization for KPI cards and dynamic bar charts.
- **Context API**: Global state management for user sessions and JWT handling.

### Backend

- **Node.js & Express**: Lightweight API gateway.
- **MongoDB & Mongoose**: Flexible schema design for nested documents and audit logs.
- **JSON Web Tokens (JWT)**: Stateless and secure authentication.

##  Architectural Highlights

- **Multi-Tenant Data Isolation**: Custom Express middleware extracts `tenantId` from the signed JWT and injects it into every MongoDB query, ensuring users only access their company data.
- **Compound Database Indexing**: Mongoose schemas are optimized with compound indexes such as `tenantId + orderNumber` for performance and collision prevention.
- **Digital Audit Trail**: Order state changes are stored as sub-documents, providing a complete historical timeline for each order.

##  What I Learned

- **Security First**: JWT storage and authorization should be enforced at the application layer, not just in the UI.
- **State Management Complexity**: Complex order pipelines require careful state handling to keep the UI in sync with backend updates.
- **Schema Design**: Modeling `statusHistory` as nested documents improves NoSQL performance and readability.
- **Modern Build Tools**: Vite and Tailwind v4 provide a much faster and cleaner development workflow.

##  Getting Started (Local Development)

### Prerequisites

- Node.js installed
- A MongoDB connection string (local or MongoDB Atlas)

### Backend Setup

```bash
cd ../backend
npm install
```

Create a `.env` file in the `backend` directory with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd ../mes-frontend
npm install
npm run dev
```

Open the browser at the localhost URL provided by Vite.

##  Future Enhancements

- **Real-Time Synchronization**: Add Socket.io to broadcast order updates instantly to all active clients.
- **Server-Side Pagination**: Add backend pagination to support large datasets efficiently.
- **Role-Based Access Control (RBAC)**: Restrict admin-level actions to authorized users only.
