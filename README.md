# RoxRatings

A full-stack store rating platform built for the Roxiler FullStack Intern Coding Challenge.

RoxRatings provides a single role-based application for **Administrators, Normal Users, and Store Owners**. Users can discover stores and submit ratings, store owners can monitor their store performance, and administrators can manage users, stores, ratings, and ownership.

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Lucide React
- Responsive CSS

### Backend
- Node.js
- Express.js
- JWT authentication
- bcrypt password hashing
- Nodemailer for password-reset OTP emails

### Database
- PostgreSQL
- PostgreSQL CITEXT for case-insensitive emails

## Features

### Authentication & Security
- Single login system with role-based access
- JWT authentication
- Secure bcrypt password hashing
- Change password
- Forgot-password flow with real email OTP
- 6-digit OTP verification
- OTP expiry and attempt limits
- Secure password reset token flow
- Generic password-reset responses to reduce email enumeration

### Administrator
- Dashboard with application statistics
- Manage users
- Manage stores
- Search and filter users/stores
- Sort records
- View detailed user information
- Create, update, and delete users
- Create, update, and delete stores
- Assign store owners
- View owner rating statistics

### Normal User
- Sign up and log in
- Browse and search stores
- View store rating information
- Submit a rating from 1 to 5
- Update an existing rating
- See personal rating alongside the overall store average
- Change password
- Log out

### Store Owner
- Secure owner login
- View average store rating
- View total number of ratings
- View rating distribution
- View users who rated the store
- Change password

## Validation

The application enforces the required challenge validations:

- **Name:** 20–60 characters
- **Address:** maximum 400 characters
- **Password:** 8–16 characters, including at least one uppercase letter and one special character
- **Email:** valid email format
- **Rating:** integer from 1 to 5
- Duplicate ratings for the same user/store are prevented

## Password Reset

RoxRatings implements a real email-based password reset flow:

```
Forgot Password
      ↓
Enter registered email
      ↓
6-digit OTP sent by email
      ↓
Verify OTP
      ↓
Set new password
      ↓
Login
```

OTP security includes:
- Hashed OTP storage
- 10-minute expiration
- Maximum verification attempts
- Secure reset-token generation
- One-time reset flow

The application uses SMTP/Nodemailer for sending OTP emails. No fake or hard-coded OTP is used.

## Demo Accounts

These are local/demo accounts configured for testing:

| Role | Email | Password |
|---|---|---|
| Store Owner — City Square | owner@CitySquare.test | Owner@123 |
| Store Owner — Central Market | owner@CentralMarket.test | Owner@123 |
| Normal User | krishnaxchaturvedi@gmail.com | Krishna@123 |
| Normal User | krishnachaturvedi201@gmail.com | Krishna@124 |
| Administrator | admin@roxratings.test | Admin@123 |

> These accounts are demonstration credentials for this coding-assessment application.

## Demo Stores

The local demonstration database contains:

| Store | Address | Owner |
|---|---|---|
| RoxRatings City Square | City Square, Kolar, Madhya Pradesh | owner@CitySquare.test |
| RoxRatings Central Market | Central Market, Kolar, Madhya Pradesh | owner@CentralMarket.test |

## Database Schema

The PostgreSQL database contains:

- `users`
- `stores`
- `ratings`
- `password_reset_tokens`

Important relationships:
- A user can submit ratings for stores.
- A store can have one assigned owner.
- A user can rate a store only once; the rating can then be updated.
- Deleting a user/store cascades or clears related records according to the database constraints.

## Project Structure

```text
Rox_Web/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── index.html
├── .gitignore
├── package.json
└── README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/krishnaxchaturvedi/Rox_Web.git
cd Rox_Web
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 4. Configure PostgreSQL

Create a PostgreSQL database and run:

```text
database/schema.sql
```

Example database:

```text
rox_web
```

### 5. Configure backend environment variables

Create:

```text
backend/.env
```

Use the variables defined in:

```text
backend/.env.example
```

Typical configuration includes:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret

MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USER=your_email
MAIL_APP_PASSWORD=your_email_app_password
MAIL_FROM=your_email
```

**Never commit real passwords, API keys, database credentials, or email app passwords.**

### 6. Start the backend

```bash
cd backend
npm run dev
```

### 7. Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Then open the Vite development URL shown in the terminal.

## Environment Variables

The project keeps secrets outside source control.

Required backend configuration includes:

- PostgreSQL connection details
- JWT secret
- SMTP host
- SMTP port
- SMTP username
- SMTP app password
- Sender email address

See `backend/.env.example` for the expected configuration.

## API Overview

### Authentication

```text
POST /auth/login
POST /auth/signup
POST /auth/change-password
POST /auth/forgot-password/request-otp
POST /auth/forgot-password/verify-otp
POST /auth/forgot-password/reset
```

### Stores

Store endpoints support browsing, searching, rating, and owner/admin operations according to the authenticated user's role.

### Ratings

Users can:
- Create a rating
- Update their existing rating
- View overall store ratings

Administrators and store owners receive additional rating information according to their permissions.

## Database Design

The core relationship is:

```text
Users ───────< Ratings >─────── Stores
  │                              │
  └────────── Owner ─────────────┘
```

Each rating belongs to exactly one user and one store, with a unique constraint on the `user_id + store_id` combination.

## Security Notes

- Passwords are never stored as plaintext.
- OTPs are stored as hashes.
- Password reset OTPs expire automatically.
- Reset attempts are limited.
- Authentication is protected with JWT.
- Sensitive environment variables are excluded from Git.
- Real credentials should never be committed to the repository.

## Challenge Coverage

RoxRatings covers the main requirements of the Roxiler FullStack Intern Coding Challenge:

- Role-based authentication
- Admin management
- User management
- Store management
- Store ownership
- Store search/filtering
- Rating creation and updates
- Rating statistics
- Password validation
- Email validation
- Address/name validation
- Password change
- Forgot-password email OTP
- PostgreSQL persistence
- Responsive React frontend

## License

This project was created as a coding challenge / internship assessment project.
