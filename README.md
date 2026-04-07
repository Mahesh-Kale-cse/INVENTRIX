# 🚀 INVENTRIX - Smart Inventory & Sales Forecasting System

<div align="center">

![INVENTRIX Logo](https://img.shields.io/badge/INVENTRIX-Production--Ready-brightgreen?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql)

A complete, production-ready inventory management system with real-time updates, AI-powered sales forecasting, and comprehensive analytics.

</div>

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, STAFF)
- Secure password encryption with BCrypt
- Token refresh mechanism

### 📦 Product Management
- CRUD operations for products
- Category management
- Stock tracking with low-stock alerts
- Image upload support
- SKU management
- Search and filter products

### 📊 Sales Analytics
- Real-time sales tracking
- Daily, monthly, and custom date range reports
- Revenue calculations
- Top-selling products analysis
- Sales trend visualization

### 🤖 AI-Powered Predictions
- Sales forecasting using moving average algorithm
- Demand prediction for next month
- Trend analysis (UP, DOWN, STABLE)
- Confidence score calculation

### 🔔 Real-time Updates
- WebSocket integration for live notifications
- Stock level alerts
- Sales updates
- System notifications

### 📈 Dashboard
- Key performance metrics
- Interactive charts and graphs
- Low stock alerts
- Revenue tracking
- Category distribution

### 🌙 UI/UX Features
- Dark mode support
- Responsive design
- Modern gradient UI
- Smooth animations
- Toast notifications
- Loading states

---

## 🛠 Tech Stack

### Backend
- **Spring Boot 3.2.0** - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **MySQL** - Relational database
- **JWT** - Token-based auth
- **WebSocket** - Real-time communication
- **Lombok** - Reduce boilerplate code
- **Maven** - Dependency management

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Hook Form** - Form validation
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **SockJS + STOMP** - WebSocket client
- **Tailwind CSS** - Styling (via inline)

---

## 📁 Project Structure

```
INVENTRIX/
│
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/inventrix/
│   │   ├── controller/              # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── ProductController.java
│   │   │   ├── SalesController.java
│   │   │   └── DashboardController.java
│   │   │
│   │   ├── service/                 # Business Logic
│   │   │   ├── ProductService.java
│   │   │   ├── SalesService.java
│   │   │   └── UserService.java
│   │   │
│   │   ├── repository/              # Data Access
│   │   │   ├── UserRepository.java
│   │   │   ├── ProductRepository.java
│   │   │   └── SalesRepository.java
│   │   │
│   │   ├── entity/                  # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Product.java
│   │   │   ├── Sales.java
│   │   │   ├── Category.java
│   │   │   └── Warehouse.java
│   │   │
│   │   ├── dto/                     # Data Transfer Objects
│   │   │   ├── LoginRequest.java
│   │   │   ├── ProductRequest.java
│   │   │   └── SalesRequest.java
│   │   │
│   │   ├── security/                # Security Config
│   │   │   ├── JwtUtil.java
│   │   │   ├── JwtFilter.java
│   │   │   └── SecurityConfig.java
│   │   │
│   │   └── InventrixApplication.java
│   │
│   ├── src/main/resources/
│   │   └── application.properties
│   │
│   └── pom.xml
│
├── frontend/                         # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.js
│   │   │
│   │   ├── pages/                   # Page Components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Sales.jsx
│   │   │   └── Alerts.jsx
│   │   │
│   │   ├── services/                # API Services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── salesService.js
│   │   │   └── webSocketService.js
│   │   │
│   │   ├── context/                 # React Context
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── database/
│   └── schema.sql                   # Database Schema
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- Maven 3.6+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/inventrix.git
cd inventrix
```

### 2. Database Setup

**Create MySQL Database:**
```sql
CREATE DATABASE inventrix_db;
USE inventrix_db;
```

**Run the schema (optional - auto-created by Spring Boot):**
```bash
mysql -u root -p inventrix_db < database/schema.sql
```

**Update database credentials in `backend/src/main/resources/application.properties`:**
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

Backend will start on **http://localhost:8080**

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will start on **http://localhost:3000**

---

## 🎯 Default Credentials

The system will auto-create an admin user on first run:

**Admin Account:**
- Username: `admin`
- Password: `admin123`
- Role: ADMIN

**Staff Account:**
- Username: `staff`
- Password: `staff123`
- Role: STAFF

⚠️ **Important:** Change these credentials in production!

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get current user
```

### Products
```
GET    /api/products          - Get all products
GET    /api/products/:id      - Get product by ID
POST   /api/products          - Create product (ADMIN)
PUT    /api/products/:id      - Update product (ADMIN)
DELETE /api/products/:id      - Delete product (ADMIN)
GET    /api/products/low-stock - Get low stock products
GET    /api/products/search   - Search products
```

### Sales
```
GET    /api/sales             - Get all sales
POST   /api/sales             - Record new sale
GET    /api/sales/dashboard   - Get dashboard stats
GET    /api/sales/monthly     - Get monthly sales data
GET    /api/sales/prediction  - Get AI predictions
```

### WebSocket Topics
```
/topic/products     - Product updates
/topic/sales        - Sales updates
/topic/alerts       - System alerts
```

---

## 🎨 Features Showcase

### Dashboard
- Real-time KPI cards
- Sales trend charts
- Category distribution
- Quick actions

### Product Management
- Add/Edit/Delete products
- Image upload
- Stock management
- Search and filter
- Category organization

### Sales Analytics
- Interactive charts
- Date range filtering
- Revenue reports
- Export to CSV

### AI Predictions
- Moving average forecasting
- Confidence scores
- Trend analysis
- Next month predictions

---

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/inventrix_db
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# CORS
cors.allowed.origins=http://localhost:3000
```

### Frontend Configuration (`.env`)
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=http://localhost:8080/ws
```

---

## 📱 Responsive Design

INVENTRIX is fully responsive and works seamlessly on:
- 💻 Desktop (1920px+)
- 💻 Laptop (1366px - 1919px)
- 📱 Tablet (768px - 1365px)
- 📱 Mobile (320px - 767px)

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🚢 Deployment

### Backend (Heroku/AWS)
```bash
# Build JAR
mvn clean package

# Deploy JAR to server
java -jar target/inventrix-backend-1.0.0.jar
```

### Frontend (Vercel/Netlify)
```bash
# Build production
npm run build

# Deploy build folder
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- Recharts Library
- Lucide Icons
- JWT.io

---

## 📞 Support

For support, email support@inventrix.com or create an issue in the repository.

---

<div align="center">

**Made with ❤️ by Your Name**

⭐ Star this repo if you find it helpful!

</div>
