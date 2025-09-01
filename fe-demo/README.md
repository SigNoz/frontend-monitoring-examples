# Expense Manager - Full Stack Application

A complete, production-ready expense management application built with modern technologies. Features a beautiful React frontend and a robust Node.js backend with NeonDB integration.

## 🚀 Features

### Frontend
- **Beautiful UI/UX**: Sleek, professional design with smooth animations
- **Responsive Design**: Works perfectly on all devices
- **Advanced Search & Filtering**: Find expenses quickly and efficiently
- **Statistics Dashboard**: Visual insights into spending patterns
- **Signoz Integration**: Monitoring configuration via settings modal
- **Full CRUD Operations**: Create, read, update, and delete expenses

### Backend
- **RESTful API**: Clean, well-documented endpoints
- **TypeScript**: Full type safety and modern JavaScript features
- **NeonDB Integration**: Serverless PostgreSQL database
- **Security**: Helmet.js security headers and CORS protection
- **Error Handling**: Comprehensive error handling and validation
- **Performance**: Optimized database queries and indexing

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **React Router** for navigation
- **Lucide React** for icons
- **Axios** for HTTP requests

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **NeonDB** (PostgreSQL) database
- **Helmet.js** for security
- **CORS** configuration
- **UUID** generation

## 📁 Project Structure

```
signoz-fe-monitoring-demo/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── database/       # Database connection & schema
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript interfaces
│   │   └── index.ts        # Server entry point
│   ├── package.json        # Backend dependencies
│   ├── tsconfig.json       # TypeScript config
│   └── README.md           # Backend documentation
├── frontend/                # React + TypeScript app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API clients & utilities
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Helper functions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # App entry point
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- NeonDB account (for database)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your NeonDB credentials
# NEON_DATABASE_URL=postgresql://username:password@hostname/database
# NEON_DATABASE_KEY=your_neon_api_key

# Start development server
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Database Setup

1. Create a NeonDB database at [neon.tech](https://neon.tech)
2. Copy your connection string to the backend `.env` file
3. The application will automatically create the required tables on first run

## 📖 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Expenses
- `GET /expenses` - Get all expenses
- `GET /expenses/:id` - Get expense by ID
- `POST /expenses` - Create new expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `GET /expenses/category/:category` - Get expenses by category
- `GET /expenses/stats/total` - Get total expenses

#### Health Check
- `GET /health` - Server health status

### Request/Response Format

```typescript
// Create Expense Request
{
  "title": "Grocery Shopping",
  "amount": 45.67,
  "category": "Food & Dining",
  "date": "2024-01-15",
  "description": "Weekly groceries from Walmart"
}

// API Response
{
  "success": true,
  "data": { ... },
  "message": "Expense created successfully"
}
```

## 🎨 Frontend Features

### Dashboard
- **Statistics Cards**: Total expenses, monthly spending, averages, count
- **Search & Filtering**: Real-time search with category filtering
- **Sorting**: Sort by date, amount, or title
- **Responsive Grid**: Beautiful expense cards with category icons

### Expense Management
- **Form Validation**: Real-time validation with helpful error messages
- **Category Selection**: Predefined categories with visual indicators
- **Date Picker**: Easy date selection
- **Rich Descriptions**: Optional detailed descriptions

### Signoz Integration
- **Settings Modal**: Accessible via gear icon in header
- **Configuration Fields**:
  - Signoz Ingestion URL
  - Signoz Ingestion Key
  - Service Name
- **Local Storage**: Configuration persists between sessions
- **Validation**: Input validation with error handling

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **Environment Variables**: Secure configuration management

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Responsive layouts for all screen sizes
- **Touch Friendly**: Optimized touch interactions
- **Navigation**: Collapsible mobile navigation

## 🚀 Performance Features

- **Database Indexing**: Optimized queries with proper indexes
- **Memoization**: Expensive calculations are memoized
- **Lazy Loading**: Components load only when needed
- **Debounced Search**: Performance-optimized search input

## 🧪 Development

### Backend Development
```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start            # Start production server
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Variables

#### Backend (.env)
```env
NEON_DATABASE_URL=postgresql://username:password@hostname/database
NEON_DATABASE_KEY=your_neon_api_key
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection**
- Verify NeonDB credentials
- Check if NeonDB service is active
- Ensure database exists and is accessible

**CORS Errors**
- Verify CORS_ORIGIN in backend .env
- Check frontend API URL configuration
- Ensure both servers are running

**Build Errors**
- Clear node_modules and reinstall
- Check TypeScript configuration
- Verify all imports are correct

## 📈 Monitoring & Observability

The application is designed with Signoz integration in mind:

1. **Frontend Monitoring**: Configure via settings modal
2. **Backend Monitoring**: Health check endpoint available
3. **Database Monitoring**: Connection status logging
4. **Error Tracking**: Comprehensive error logging

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use consistent naming conventions
3. Add proper error handling
4. Include loading states for async operations
5. Test responsive design on multiple devices
6. Update documentation for any changes

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **NeonDB** for serverless PostgreSQL
- **Tailwind CSS** for beautiful styling
- **React Team** for the amazing framework
- **Vite** for fast development experience

---

**Happy Expense Tracking! 💰📊**
