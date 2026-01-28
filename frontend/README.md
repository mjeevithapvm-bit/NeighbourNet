# NeighbourNet 2.0 Frontend

A modern React web application for the NeighbourNet community platform.

## Features

- **User Authentication**: Register and login functionality
- **Dashboard**: Overview of community activities
- **Products**: Share and browse community products/services
- **Emergency Alerts**: Send and view emergency notifications
- **Responsive Design**: Works on all devices
- **Clean UI**: Modern, colorful interface with Tailwind CSS

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls (planned)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

## API Integration

The frontend communicates with the NeighbourNet backend API through a Vite proxy configuration. All API calls use relative paths (`/api/...`) which are automatically proxied to `http://127.0.0.1:8000/api/`.

**Proxy Configuration:**
- Frontend runs on: `http://localhost:5173`
- Backend API: `http://127.0.0.1:8000`
- API calls in code: `/api/users/login`, `/api/products/`, etc.
- Proxy handles CORS automatically

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Products.tsx
│   │   └── Emergency.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Features Overview

### Authentication
- User registration and login
- JWT token-based authentication (stored in localStorage)
- Protected routes

### Dashboard
- Welcome message for logged-in users
- Quick action buttons
- Recent products and emergency alerts preview

### Products
- Add new products/services
- Browse available products
- View product details

### Emergency
- Send emergency alerts
- View active and resolved emergencies
- Real-time notifications (planned)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of NeighbourNet 2.0 - All rights reserved.