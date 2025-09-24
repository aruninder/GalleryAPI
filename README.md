# 🖼️ Product Gallery API

A full-stack MERN application for managing a product gallery with user authentication, image uploads, and product management features.

## 🚀 Features

### Backend Features
- ✅ **User Authentication** - JWT-based registration and login system
- ✅ **Password Security** - Bcrypt password hashing
- ✅ **Image Upload** - Multer + Cloudinary integration for image handling
- ✅ **Product Management** - Full CRUD operations for products
- ✅ **Category Filtering** - Filter products by category
- ✅ **Search Functionality** - Search products by title and description
- ✅ **User Authorization** - Users can only edit/delete their own products
- ✅ **API Documentation** - Well-documented RESTful API endpoints

### Frontend Features
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **User Authentication** - Login/Register modals
- ✅ **Product Gallery** - Grid layout with product cards
- ✅ **Image Display** - Cloudinary-hosted images
- ✅ **Category Filtering** - Dropdown filter by category
- ✅ **Search** - Real-time product search
- ✅ **Product Management** - Add/Delete products (authenticated users)

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with responsive design
- **Vanilla JavaScript** - Dynamic functionality
- **Fetch API** - HTTP requests

## 📁 Project Structure

```
product-gallery-api/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   └── productController.js   # Product CRUD operations
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Product.js            # Product schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   └── products.js           # Product routes
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── upload.js             # Multer configuration
│   │   └── errorHandler.js       # Error handling
│   ├── config/
│   │   ├── database.js           # MongoDB connection
│   │   └── cloudinary.js         # Cloudinary configuration
│   └── server.js                 # Main server file
├── frontend/
│   ├── index.html                # Frontend UI
│   └── app.js                    # Frontend JavaScript
├── .env                          # Environment variables
├── .env.example                  # Environment variables template
└── package.json                  # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-gallery-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your credentials:
   ```env
   MONGODB_URI=mongodb://localhost:27017/product-gallery
   JWT_SECRET=your-super-secret-jwt-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   PORT=4000
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

5. **Run the application**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:4000
   - API: http://localhost:4000/api

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "shopName": "John's Shop" // optional
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=10&category=Electronics&search=laptop
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Protected)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: Product Title
description: Product Description
category: Electronics
price: 299.99
image: <file>
```

#### Update Product (Protected)
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: Updated Title
description: Updated Description
category: Fashion
price: 199.99
image: <file> // optional
```

#### Delete Product (Protected)
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

#### Get Products by Category
```http
GET /api/products/category/:category
```

## 📱 Usage

### For Users
1. **Register/Login** - Create an account or log in
2. **Browse Products** - View all products in the gallery
3. **Filter & Search** - Use category filter and search functionality
4. **Add Products** - Authenticated users can add new products with images
5. **Manage Products** - Edit or delete your own products

### For Developers
1. **API Testing** - Use Postman or similar tools to test API endpoints
2. **Database** - MongoDB collections: `users` and `products`
3. **Image Storage** - Images are automatically uploaded to Cloudinary
4. **Authentication** - JWT tokens for secure API access

## 🔧 Environment Setup

### MongoDB Setup Options

**Option 1: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/product-gallery`

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at https://mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env

### Cloudinary Setup
1. Sign up at https://cloudinary.com
2. Get your cloud name, API key, and API secret from dashboard
3. Update Cloudinary credentials in .env

## 🧪 Testing with Postman

1. **Import Collection** - Create a new Postman collection
2. **Set Environment Variables**:
   - `base_url`: http://localhost:4000/api
   - `token`: (will be set after login)
3. **Test Authentication**:
   - Register a new user
   - Login and copy the token
   - Set token in Authorization header
4. **Test Product Operations**:
   - Create products with image uploads
   - Get all products
   - Update/Delete products

## 🎨 Categories Available

- Electronics
- Fashion
- Home & Garden
- Sports
- Books
- Toys
- Health & Beauty
- Food & Beverages
- Automotive
- Other

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- File type validation for uploads
- User authorization for product operations
- CORS configuration
- Error handling without sensitive data exposure

## 🐛 Known Issues

- Image upload size limit: 5MB
- Frontend could be enhanced with a modern framework
- No user profile management yet
- No product ratings/reviews

## 🔮 Future Enhancements

- User profile management
- Product ratings and reviews
- Shopping cart functionality
- Payment integration
- Admin panel
- Email verification
- Password reset functionality
- Product favorites/bookmarks
- Enhanced search with filters
- Real-time notifications
