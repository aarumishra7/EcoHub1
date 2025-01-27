# EcoHub: Sustainable Online Marketplace

**Ecohub** is a sustainable online marketplace designed to connect buyers, sellers, and financial institutions supporting eco-friendly projects. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), EcoMarket offers a seamless platform for trading sustainable materials and facilitating green financing.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [DocuSign Integration](#docusign-integration)
- [Authentication & Authorization](#authentication--authorization)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration**: Separate sign-up processes for buyers, sellers (validated via GST Number), and financial institutions offering eco-friendly loans and grants.
- **Product Listings**: Sellers can list sustainable materials with detailed descriptions and pricing.
- **Order Management**: Buyers can place orders, track shipments, and manage purchase history.
- **Profile Management**: Users can update personal information, manage addresses, and view order history.
- **Agreements**: Integration with DocuSign for digital signatures on agreements between parties.
- **Responsive Design**: Intuitive UI with green and white color schemes, glassmorphism design elements, smooth transitions, and hover effects.

## Tech Stack

- **Frontend**:
  - [React.js](https://reactjs.org/): For building dynamic user interfaces.
  - **Styling**: CSS with glassmorphism design principles, smooth transitions, and hover effects.

- **Backend**:
  - [Node.js](https://nodejs.org/): JavaScript runtime for server-side operations.
  - [Express.js](https://expressjs.com/): Web framework for building APIs and handling requests.

- **Database**:
  - [MongoDB](https://www.mongodb.com/): NoSQL database for storing user data, product listings, orders, and agreements.

- **Authentication & Authorization**:
  - [JSON Web Tokens (JWT)](https://jwt.io/): For secure user authentication and session management.

- **Digital Signatures**:
  - [DocuSign eSignature API](https://developers.docusign.com/docs/esign-rest-api/): For managing digital agreements and signatures.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/ecomarket.git
   cd ecomarket
   ```

2. **Install Dependencies**:

   - Backend:

     ```bash
     cd backend
     npm install
     ```

   - Frontend:

     ```bash
     cd ../frontend
     npm install
     ```

3. **Environment Variables**:

   Create a `.env` file in the `backend` directory with the following variables:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   DOCUSIGN_CLIENT_ID=your_docusign_client_id
   DOCUSIGN_CLIENT_SECRET=your_docusign_client_secret
   DOCUSIGN_REDIRECT_URI=your_docusign_redirect_uri
   ```

4. **Start the Application**:

   - Backend:

     ```bash
     cd backend
     npm start
     ```

   - Frontend:

     ```bash
     cd ../frontend
     npm start
     ```


## Usage

- **User Registration**: Navigate to the registration page to create a buyer, seller, or financial institution account. Sellers will need to provide a valid GST Number for verification.

- **Product Listings**: Sellers can add new products via the dashboard, including details like name, description, price, and images.

- **Placing Orders**: Buyers can browse products, add them to the cart, and proceed to checkout to place orders.

- **Agreements**: Upon placing an order or initiating a financial transaction, relevant agreements will be generated and sent for digital signatures via DocuSign.

## API Endpoints

- **User Authentication**:
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Authenticate a user and return a JWT.

- **Product Management**:
  - `GET /api/products`: Retrieve all products.
  - `POST /api/products`: Add a new product (seller only).
  - `PUT /api/products/:id`: Update a product (seller only).
  - `DELETE /api/products/:id`: Delete a product (seller only).

- **Order Management**:
  - `GET /api/orders`: Retrieve all orders (buyer and seller specific).
  - `POST /api/orders`: Place a new order (buyer only).
  - `PUT /api/orders/:id`: Update order status (seller only).

- **Agreement Management**:
  - `POST /api/agreements`: Create a new agreement and initiate DocuSign process.
  - `GET /api/agreements/:id/status`: Check the status of an agreement.

## DocuSign Integration

EcoMarket integrates with the DocuSign eSignature API to facilitate digital signing of agreements. Upon certain actions (e.g., placing an order, initiating a loan), the system:

1. **Generates an Agreement**: Creates a document outlining the terms of the transaction.

2. **Creates a DocuSign Envelope**: Sends the document to the specified recipients for signatures.

3. **Monitors Status**: Tracks the signing process and updates the agreement status accordingly.

For detailed implementation, refer to the [DocuSign eSignature API documentation](https://developers.docusign.com/docs/esign-rest-api/).

## Authentication & Authorization

Authentication is handled using JSON Web Tokens (JWT). Upon successful login, a token is issued to the user, which must be included in the Authorization header of subsequent requests to protected endpoints.

Authorization is role-based:

- **Buyers**: Can browse products, place orders, and manage their profiles.

- **Sellers**: Can manage product listings, view orders related to their products, and manage their profiles.

- **Financial Institutions**: Can offer loans and grants for sustainable projects.
