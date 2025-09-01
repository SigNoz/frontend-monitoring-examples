# Expense Manager Backend

A robust backend API for managing personal expenses, built with TypeScript, Node.js, Express, and NeonDB.

## Features

- 🚀 **Fast & Efficient**: Built with TypeScript and Express
- 🗄️ **Database**: PostgreSQL with NeonDB (serverless)
- 🔒 **Secure**: Helmet.js security headers and CORS protection
- 📊 **RESTful API**: Complete CRUD operations for expenses
- 🎯 **Type Safety**: Full TypeScript support with interfaces
- 📈 **Statistics**: Total expenses and category-based filtering

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: NeonDB (PostgreSQL)
- **Security**: Helmet.js, CORS
- **Development**: ts-node-dev for hot reloading

## Prerequisites

- Node.js 18+ 
- NeonDB account and database
- npm or yarn

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your NeonDB credentials:
   ```env
   NEON_DATABASE_URL=postgresql://username:password@hostname/database
   NEON_DATABASE_KEY=your_neon_api_key
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Database Setup**
   - Create a NeonDB database
   - The application will automatically create the required tables on first run

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Expenses

- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/category/:category` - Get expenses by category
- `GET /api/expenses/stats/total` - Get total expenses

### Health Check

- `GET /health` - Server health status

## Data Models

### Expense

```typescript
interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Database Schema

The application automatically creates the following table:

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

All API endpoints return consistent error responses:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Request body validation
- **SQL Injection Protection**: Parameterized queries with NeonDB

## Development Workflow

1. Make changes to TypeScript files in `src/`
2. Development server automatically restarts
3. Build for production with `npm run build`
4. Deploy the `dist/` folder

## Troubleshooting

### Database Connection Issues
- Verify NeonDB credentials in `.env`
- Check if NeonDB service is active
- Ensure database exists and is accessible

### Port Conflicts
- Change `PORT` in `.env` if 3001 is occupied
- Update frontend CORS configuration accordingly

## License

MIT
