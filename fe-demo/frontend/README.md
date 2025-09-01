# Expense Manager Frontend

A sleek and professional expense management application built with React, TypeScript, and Vite. Features a beautiful UI with modern design principles and excellent user experience.

## Features

- 🎨 **Beautiful UI**: Modern, professional design with smooth animations
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- 🔍 **Advanced Search**: Search expenses by title or description
- 🏷️ **Category Management**: Organize expenses with predefined categories
- 📊 **Statistics Dashboard**: View total expenses, monthly spending, and averages
- ⚙️ **Signoz Integration**: Configure monitoring settings via settings modal
- ✏️ **Full CRUD**: Create, read, update, and delete expenses
- 🎯 **Type Safety**: Full TypeScript support with proper interfaces

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── SettingsModal.tsx # Signoz configuration modal
├── pages/              # Page components
│   ├── HomePage.tsx    # Dashboard with expenses list
│   └── ExpenseFormPage.tsx # Create/edit expense form
├── services/           # API and external services
│   ├── api.ts          # Expense API client
│   └── signozConfig.ts # Signoz configuration service
├── types/              # TypeScript type definitions
│   └── index.ts        # Main types and interfaces
├── utils/              # Utility functions
│   └── index.ts        # Formatting and helper functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Key Components

### Layout Component
- Navigation header with Signoz branding
- Responsive mobile navigation
- Settings gear icon for Signoz configuration

### HomePage Component
- Statistics dashboard with key metrics
- Advanced filtering and search capabilities
- Sortable expense list with beautiful cards
- Category-based organization

### ExpenseFormPage Component
- Form validation with Zod schema
- Real-time error handling
- Responsive form layout
- Support for both create and edit modes

### SettingsModal Component
- Signoz configuration management
- Local storage persistence
- Input validation and error handling
- Professional modal design

## Signoz Integration

The application includes a settings modal for configuring Signoz monitoring:

1. **Signoz Ingestion URL**: Your Signoz instance endpoint
2. **Signoz Ingestion Key**: Authentication key for data ingestion
3. **Service Name**: Identifier for your frontend service

Configuration is stored in browser localStorage and persists between sessions.

## Styling

The application uses Tailwind CSS with custom component classes:

- `.btn-primary`: Primary action buttons
- `.btn-secondary`: Secondary action buttons
- `.btn-danger`: Destructive action buttons
- `.input-field`: Form input styling
- `.card`: Content container styling
- `.modal-overlay`: Modal background
- `.modal-content`: Modal content container

## Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Responsive grid layouts for all screen sizes
- **Touch Friendly**: Optimized for touch interactions
- **Navigation**: Collapsible navigation for mobile

## Performance Features

- **Lazy Loading**: Components load only when needed
- **Memoization**: Expensive calculations are memoized
- **Debounced Search**: Search input is debounced for performance
- **Optimized Rendering**: Efficient re-rendering with React best practices

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Workflow

1. Make changes to TypeScript/React files
2. Development server automatically reloads
3. Use browser dev tools for debugging
4. Build for production when ready

## Troubleshooting

### Common Issues

**API Connection Errors**
- Ensure backend is running on correct port
- Check CORS configuration in backend
- Verify API URL in environment variables

**Build Errors**
- Clear node_modules and reinstall dependencies
- Check TypeScript configuration
- Verify all imports are correct

**Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check PostCSS configuration
- Verify CSS import order

## Contributing

1. Follow TypeScript best practices
2. Use consistent naming conventions
3. Add proper error handling
4. Include loading states for async operations
5. Test responsive design on multiple devices

## License

MIT
