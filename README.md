# DCA Trading Dashboard

Vue 3 + Vite + TypeScript frontend for the DCA Trading Service.

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Project Structure

- `src/api/` - API client and service modules
- `src/stores/` - Pinia stores for state management
- `src/router/` - Vue Router configuration
- `src/views/` - Page components
- `src/components/` - Reusable components

## Features

- JWT Authentication with auto-refresh
- Strategy management (CRUD)
- Order tracking
- Statistics and analytics
- Responsive design

