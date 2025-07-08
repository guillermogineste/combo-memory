# combo-memory

A modern React application built with Vite and TypeScript.

## 🚀 Tech Stack

- **React** 19.1.0 - Latest React with improved performance and features
- **TypeScript** 5.8.3 - Strong typing for better development experience
- **Vite** 7.0.3 - Fast build tool and development server
- **ESLint** 9.30.1 - Code linting with React-specific rules
- **Yarn** - Package manager (as specified in project requirements)

## 📦 Development Setup

### Prerequisites

- Node.js (v24.3.0 or higher)
- Yarn (v1.22.22 or higher)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd combo-memory
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start the development server:**
   ```bash
   yarn dev
   ```

   The application will be available at `http://localhost:5173`

### Available Scripts

- `yarn dev` - Start the development server with hot reload
- `yarn build` - Build the project for production
- `yarn lint` - Run ESLint to check code quality
- `yarn preview` - Preview the production build locally

## 🏗️ Project Structure

```
combo-memory/
├── src/
│   ├── assets/          # Static assets (images, icons, etc.)
│   ├── App.tsx          # Main App component
│   ├── App.css          # App-specific styles
│   ├── index.css        # Global styles
│   ├── main.tsx         # Application entry point
│   └── vite-env.d.ts    # Vite environment types
├── public/              # Public assets
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tsconfig.app.json    # App-specific TypeScript config
├── tsconfig.node.json   # Node-specific TypeScript config
├── vite.config.ts       # Vite configuration
└── eslint.config.js     # ESLint configuration
```

## 🎯 Features

- ⚡ Fast development with Vite's hot module replacement
- 🔧 TypeScript support for better code quality
- 🎨 Modern React with hooks and functional components
- 🔍 ESLint integration for code consistency
- 📱 Responsive design ready
- 🚀 Optimized production builds

## 🔧 Development Guidelines

- Follow React best practices and hooks patterns
- Use TypeScript for all new components and utilities
- Add proper JSDoc comments for functions and components
- Use `console.log` statements for debugging during development
- Keep components modular and reusable
- Prioritize performance and accessibility

## 🚀 Getting Started

The project includes a sample counter component to demonstrate the setup. You can find it in `src/App.tsx`. Start by modifying this component or creating new ones in the `src/` directory.

For more information about the tools used:
- [Vite Documentation](https://vite.dev/guide/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
