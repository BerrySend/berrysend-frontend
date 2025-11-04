# BerrySend Frontend

Mathematical route optimization platform for blueberry exports from Peru.

## 🏗️ Architecture

This project follows **Domain-Driven Design (DDD)** principles with clear **Bounded Contexts**:

### Bounded Contexts

1. **Port Management** - Infrastructure and logistics management
2. **Route Optimization** - Mathematical algorithms and optimization engine
3. **Shipment Planning** - Shipment creation and management
4. **Visualization** - Data visualization and reporting

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone 
cd berrysend-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API base URL
# VITE_API_BASE_URL=http://localhost:8080/api
```

### Development

```bash
# Start development server
npm run dev

# Access the application at http://localhost:5173
```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🎨 Tech Stack

- **Vue 3** - Progressive JavaScript framework (Composition API)
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management library
- **Axios** - HTTP client for API requests
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework

## 📦 Key Dependencies

- **vue**: ^3.4.0 - Core framework
- **vue-router**: ^4.2.5 - Routing
- **pinia**: ^2.1.7 - State management
- **axios**: ^1.6.2 - HTTP client


## 🎯 Features

### Port Management Module
- ✅ View all ports in the system
- ✅ Filter ports by type (Origin, Destination, Intermediate)
- ✅ Search ports by name or country
- ✅ Create, update, and delete ports
- ✅ Manage port connections

### Route Optimization Module
- 🚧 Configure optimization algorithms (Dijkstra)
- 🚧 Set optimization objectives (minimize time/cost)
- 🚧 Execute optimization engine
- 🚧 View algorithm performance metrics

### Visualization Module
- 🚧 Interactive route map
- 🚧 Network graph visualization
- 🚧 Transport mode toggle (maritime/air)
- 🚧 Real-time optimization results

### Shipment Planning Module
- 🚧 Create shipment plans
- 🚧 Assign routes to shipments
- 🚧 Track shipment status


## 🤝 Contributing

1. Follow the established code structure
2. Write meaningful commit messages
3. Document all new functions and components
4. Ensure code passes linting: `npm run lint`
5. Format code before committing: `npm run format`

## 📄 License

Copyright © 2025 BerrySend. All rights reserved.