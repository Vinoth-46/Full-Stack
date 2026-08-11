# 🍽️ VinoTreats - Full-Stack Food Delivery & Management Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://full-stack-yldm.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Telegram](https://img.shields.io/badge/Telegram-Admin_Bot-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://telegram.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)

VinoTreats is an enterprise-grade, full-stack food delivery and restaurant management web application built using the MERN stack (MongoDB, Express, React, Node.js). It features a customer-facing e-commerce storefront, an admin control dashboard, cloud image hosting via Cloudinary, Stripe payment processing, and an automated **Telegram Admin Bot** for system control and maintenance management.

---

## 🌐 Live Application

> **URL:** [https://full-stack-yldm.onrender.com](https://full-stack-yldm.onrender.com)  
> **Admin Dashboard:** [https://full-stack-yldm.onrender.com/admin](https://full-stack-yldm.onrender.com/admin)

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Telegram Bot Admin Interface](#-telegram-bot-admin-interface)
- [Security & Testing](#-security--testing)
- [Deployment](#-deployment)
- [API Documentation Summary](#-api-documentation-summary)
- [License](#-license)

---

## ✨ Key Features

### 🛒 Customer Storefront (`/`)
* **Interactive Menu & Categories:** Filter food items dynamically by dish category (Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles, etc.).
* **Smart Shopping Cart:** Persistent cart management stored per user in MongoDB.
* **Dual Payment Options:**
  * **Stripe Checkout:** Secure online payment gateway integrated with checkout session redirects.
  * **Cash on Delivery (COD):** Offline payment method with instant order confirmation.
* **Order History & Real-Time Status:** Track placed orders with real-time status updates (*Food Processing*, *Out for Delivery*, *Delivered*).
* **Authentication:** User registration and login using JWT (JSON Web Tokens) and `bcrypt` password encryption.
* **Maintenance Guard:** Automated maintenance mode overlay triggered via the Telegram Admin Bot.

### 🛡️ Admin Management Dashboard (`/admin`)
* **Menu Management (CRUD):**
  * Add new food items with name, category, description, price, and image.
  * Direct cloud image uploads powered by **Cloudinary**.
  * Remove items (automatically purging images from Cloudinary storage).
  * Update dish details seamlessly.
* **Order Dispatch & Fulfillment:** View incoming customer orders, detailed item breakdowns, customer delivery addresses, and update fulfillment statuses.

### 🤖 Telegram Admin Control Bot
* **Remote Control Panel:** Manage application states via Telegram message commands.
* **Instant Maintenance Toggle:** Enable or disable maintenance mode globally (`/maintenance_on`, `/maintenance_off`) without restarting servers.
* **Health & Status Monitoring:** Check live application and database status anytime using `/status`.
* **Access Control:** Restricted strictly to designated Admin Telegram User IDs.

---

## 💻 Tech Stack

### **Frontend & Admin Applications**
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Modern component-based UI library |
| **Build Tool** | [Vite 7](https://vitejs.dev/) | Next-generation fast frontend bundler |
| **Routing** | [React Router v7](https://reactrouter.com/) | Client-side routing for SPA architecture |
| **HTTP Client** | [Axios](https://axios-http.com/) | Promise-based HTTP client for API requests |
| **UI Notifications** | [React Toastify](https://fkhadra.github.io/react-toastify/) | Lightweight customizable toast alerts |
| **Styling** | Vanilla CSS3 | Custom responsive grid layouts and flexbox styling |

### **Backend API Service**
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) | Asynchronous event-driven JavaScript runtime |
| **Web Server** | [Express 5](https://expressjs.com/) | Fast, unopinionated web framework for Node.js |
| **Database** | [MongoDB](https://www.mongodb.com/) | NoSQL document database |
| **ODM** | [Mongoose 8](https://mongoosejs.com/) | Object Data Modeling library for MongoDB |
| **Image Storage** | [Cloudinary](https://cloudinary.com/) | Cloud storage & optimization for product media |
| **File Handling** | [Multer](https://github.com/expressjs/multer) | Multipart/form-data handling for uploads |
| **Payments** | [Stripe SDK](https://stripe.com/) | Secure credit/debit card payment processing |
| **Bot Automation** | [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) | Telegram Bot API wrapper for Node.js |

### **Security & Utilities**
| Security Feature | Tool / Library | Usage |
| :--- | :--- | :--- |
| **Authentication** | `jsonwebtoken` | Token-based stateless authentication |
| **Password Hashing** | `bcrypt` | Salted password hashing algorithm |
| **Rate Limiting** | `express-rate-limit` | IP-based request rate limiting (100 req / 15 min) |
| **Sanitization** | Custom Middleware | Protection against XSS & NoSQL query injection |
| **Price Verification** | Server-side Calculation | Defense against client-side cart tampering |

---

## 🏗️ System Architecture

```
                                +-------------------+
                                |   Client Browser  |
                                +---------+---------+
                                          |
                        +-----------------+-----------------+
                        |                                   |
             +----------v----------+             +----------v----------+
             | Customer Storefront |             |   Admin Dashboard   |
             |       (React)       |             |       (React)       |
             +----------+----------+             +----------+----------+
                        |                                   |
                        +-----------------+-----------------+
                                          | HTTP API Requests
                                +---------v---------+
                                |  Express 5 Server |
                                +----+----+----+----+
                                     |    |    |
           +-------------------------+    |    +-------------------------+
           |                              |                              |
+----------v----------+        +----------v----------+        +----------v----------+
|       MongoDB       |        |      Cloudinary     |        |     Stripe API      |
|  (User/Food/Orders) |        |    (Media Assets)    |        | (Payment Processing)|
+---------------------+        +---------------------+        +---------------------+
                                          ^
                                          | Command / Webhook
                               +----------+----------+
                               |  Telegram Admin Bot |
                               +---------------------+
```

---

## 📁 Project Directory Structure

```text
Full-Stack/
├── admin/                      # Admin Panel (React 19 + Vite)
│   ├── src/
│   │   ├── components/        # Admin Navbar, Sidebar, etc.
│   │   ├── pages/             # Add Food, List Items, Manage Orders
│   │   ├── App.jsx            # Admin main routing component
│   │   └── main.jsx           # Admin entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    # Node.js + Express REST API
│   ├── config/                # Database (Mongoose) & Cloudinary setup
│   ├── controllers/           # Cart, Food, Order, User, Settings logic
│   ├── middleware/            # JWT Auth, Admin verification, Sanitization
│   ├── models/                # Mongoose Schemas (Food, Order, User, Settings)
│   ├── routes/                # API Route definitions
│   ├── services/              # Telegram Admin Bot integration
│   ├── uploads/               # Temporary local upload cache
│   ├── server.js              # Express main entry server file
│   └── package.json
│
├── frontend/                   # Customer Storefront (React 19 + Vite)
│   ├── src/
│   │   ├── components/        # Navbar, Header, FoodDisplay, Footer, Modals
│   │   ├── context/           # StoreContext state management (Cart & Auth)
│   │   ├── pages/             # Home, Cart, PlaceOrder, Verify, MyOrders
│   │   ├── App.jsx            # Customer app routing
│   │   └── main.jsx           # Customer entry point
│   ├── package.json
│   └── vite.config.js
│
├── tests/                      # Automated Security & Integrity Suite
│   ├── test_access.js         # Access control test suite
│   ├── test_dos.js            # Rate limiting / DoS defense tests
│   ├── test_injection.js      # NoSQL / XSS injection sanitization tests
│   ├── test_pii.js            # PII leakage prevention tests
│   └── test_price.js          # Server-side price calculation verification
│
├── package.json                # Root package configuration & build scripts
├── render.yaml                 # Deployment configuration for Render
└── README.md                   # Project Documentation
```

---

## 🔑 Environment Variables

To run the application locally or deploy it to cloud environments, configure a `.env` file inside the `backend/` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vinotreats

# JWT Security Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Telegram Bot Administration (Optional)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
TELEGRAM_ADMIN_ID=123456789
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [npm](https://www.npmjs.com/) (v9.0.0 or higher)
* [MongoDB](https://www.mongodb.com/) instance (local or MongoDB Atlas connection string)
* [Cloudinary Account](https://cloudinary.com/) (for food image uploads)
* [Stripe Account](https://stripe.com/) (for payment processing)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Vinoth-46/Full-Stack.git
   cd Full-Stack
   ```

2. **Install All Dependencies:**
   Run the unified root script to automatically install dependencies for `backend`, `frontend`, and `admin`:
   ```bash
   npm run install-all
   ```

### Running Locally

1. **Configure Environment Variables:**
   Create `backend/.env` using the template provided above.

2. **Start Backend Server:**
   ```bash
   npm run dev
   ```
   *Backend API starts at `http://localhost:4000`*

3. **Start Customer Frontend (Separate Terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   *Customer Storefront opens at `http://localhost:5173`*

4. **Start Admin Dashboard (Separate Terminal):**
   ```bash
   cd admin
   npm run dev
   ```
   *Admin Panel opens at `http://localhost:5174`*

---

## 🤖 Telegram Bot Admin Interface

The backend integrates an automated Telegram bot allowing administrators to manage system states remotely without needing browser access.

### **Available Bot Commands**

| Command | Action | Description |
| :--- | :--- | :--- |
| `/start` | Welcome | Verifies administrator identity and lists available commands |
| `/status` | Server Status | Returns current maintenance mode state, last modified user, and live site link |
| `/maintenance_on` | Enable Maintenance | Activates website maintenance screen globally for customer users |
| `/maintenance_off` | Disable Maintenance | Deactivates maintenance mode and restores normal site operation |
| `/help` | Help Menu | Displays bot command documentation |

---

## 🧪 Security & Testing

The repository contains an automated security test suite located in `/tests` to ensure endpoint resilience against common web vulnerabilities:

```bash
# Execute security verification tests
node tests/test_access.js      # Validates JWT authentication and route access control
node tests/test_dos.js         # Tests IP rate-limiting protection under heavy traffic
node tests/test_injection.js   # Verifies NoSQL injection and XSS input sanitization
node tests/test_pii.js         # Ensures no sensitive user data is exposed in logs/responses
node tests/test_price.js       # Verifies server-side calculation against price manipulation
```

---

## 📦 Deployment

This repository is pre-configured for automated deployment on [Render](https://render.com) using `render.yaml`.

### **Render Blueprint Build Command:**
```bash
npm run render-build
```
This script automatically installs node modules across all sub-directories and builds static production assets for both `frontend` and `admin`. Express serves these compiled assets from `backend/public/frontend` and `backend/public/admin`.

### **Render Start Command:**
```bash
npm run start
```

---

## 📋 API Documentation Summary

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST /api/user/register` | `POST` | Public | Register new user account |
| `POST /api/user/login` | `POST` | Public | Authenticate user and receive JWT token |
| `GET /api/food/list` | `GET` | Public | Fetch catalog of available food items |
| `POST /api/food/add` | `POST` | Admin | Upload new food item with Cloudinary image |
| `POST /api/food/remove` | `POST` | Admin | Delete food item and purge associated media |
| `POST /api/cart/add` | `POST` | User | Add item to user's shopping cart |
| `POST /api/cart/remove` | `POST` | User | Remove item from user's shopping cart |
| `POST /api/cart/get` | `POST` | User | Retrieve current shopping cart contents |
| `POST /api/order/place` | `POST` | User | Initiate Stripe Checkout order session |
| `POST /api/order/place-cod` | `POST` | User | Place Cash on Delivery order |
| `POST /api/order/verify` | `POST` | User | Verify Stripe payment transaction status |
| `POST /api/order/userorders`| `POST` | User | Fetch order history for logged-in user |
| `GET /api/order/list` | `GET` | Admin | Fetch all customer orders |
| `POST /api/order/status` | `POST` | Admin | Update delivery/fulfillment status of an order |
| `GET /api/settings/maintenance`| `GET` | Public | Check if system is currently in maintenance mode |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

<p center>
  Developed with ❤️ by <a href="https://github.com/Vinoth-46">Vinoth</a>
</p>
