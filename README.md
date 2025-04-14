# Roadside Assistance Service System

A comprehensive web application for managing roadside assistance services, connecting customers with mechanics, and handling service requests.

## Features

### Customer Features
- User registration and authentication
- Profile management
- Service request creation
- View service history (ongoing and completed)
- Book services with specific mechanics
- Track service status

### Mechanic Features
- Mechanic registration and authentication
- Profile management
- View and accept pending service requests
- Manage ongoing services
- View service history
- Update service status

## Project Structure

### Frontend
- `views/` - HTML pages
  - Customer pages:
    - `loginuser.html` - Customer login
    - `registeruser.html` - Customer registration
    - `userprofile.html` - Customer profile
    - `dashcust.html` - Customer dashboard
    - `reqcust.html` - Service request form
    - `user-history.html` - Service history
  - Mechanic pages:
    - `meclogin.html` - Mechanic login
    - `mecprofile.html` - Mechanic profile
    - `request-service.html` - Pending requests
    - `ongoing.html` - Ongoing services
    - `mechanic-history.html` - Service history
  - Shared:
    - `api.js` - API integration
    - `styles.css` - Common styles

### Backend
- `backend/` - Server and database
  - `server.js` - Express server setup
  - `controllers/` - Business logic
    - `customerController.js` - Customer operations
    - `mechanicController.js` - Mechanic operations
    - `serviceController.js` - Service operations
  - `routes/` - API endpoints
    - `customerRoutes.js` - Customer routes
    - `mechanicRoutes.js` - Mechanic routes
    - `serviceRoutes.js` - Service routes
  - `middleware/` - Authentication and validation
  - `config/` - Database and environment configuration

## Database Schema

### Tables
1. `customers` - Customer information
2. `mechanics` - Mechanic information
3. `services` - Service requests and status
4. `service_history` - Completed services

## API Endpoints

### Customer Endpoints
- `POST /customers/register` - Register new customer
- `POST /customers/login` - Customer login
- `GET /customers/profile` - Get customer profile
- `PUT /customers/profile` - Update customer profile
- `GET /customers/history` - Get service history

### Mechanic Endpoints
- `POST /mechanics/register` - Register new mechanic
- `POST /mechanics/login` - Mechanic login
- `GET /mechanics/profile` - Get mechanic profile
- `PUT /mechanics/profile` - Update mechanic profile
- `GET /mechanics/services` - Get mechanic's services

### Service Endpoints
- `POST /services/create` - Create new service request
- `GET /services/mechanic/:name` - Get services by mechanic
- `GET /services/mechanic/:name/pending` - Get pending services
- `GET /services/mechanic/:name/accepted` - Get accepted services
- `GET /services/mechanic/:name/completed` - Get completed services
- `PUT /services/:id/status` - Update service status

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure database:
- Create PostgreSQL database
- Update database configuration in `backend/config/db.js`

3. Set environment variables:
```bash
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=roadside_assistance
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
node backend/server.js
```

5. Access the application:
- Customer interface: `http://localhost:5000/loginuser.html`
- Mechanic interface: `http://localhost:5000/meclogin.html`

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript
  - Font Awesome Icons

- Backend:
  - Node.js
  - Express.js
  - PostgreSQL
  - JWT Authentication

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation
- Protected routes
- Secure session management

## Future Enhancements

1. Real-time notifications
2. Mobile application
3. Payment integration
4. Rating and review system
5. Location-based mechanic search
6. Chat functionality
7. Service scheduling
8. Emergency roadside assistance 