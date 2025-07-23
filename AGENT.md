# Red-Fi Project - Agent Guidelines

## Commands
- **Frontend Dev**: `cd Frontend && npm run dev` (Vite dev server)
- **Frontend Build**: `cd Frontend && npm run build` (Production build)
- **Frontend Lint**: `cd Frontend && npm run lint` (ESLint check)
- **Backend Start**: `cd Backend && npm start` (Express server)

## Architecture
- **Frontend**: React 19.1 + Vite + TailwindCSS + React Router + Supabase
- **Backend**: Node.js/Express speedtest server (minimal)
- **Database**: Supabase (PostgreSQL) with RLS policies
- **Authentication**: Supabase Auth with context providers

## Structure
- Frontend/src organized by feature: components/, pages/, services/, context/, hooks/
- Triple context pattern: AuthProvider > RoleProvider > AlertaProvider
- Service layer for API calls, custom hooks for complex logic
- Role-based access control (básico/premium plans)

## Code Style
- **Imports**: External libs first, then local components/services
- **Components**: PascalCase files, destructured props with defaults
- **Functions**: camelCase, async/await pattern
- **Styling**: TailwindCSS utility classes, conditional classNames
- **Error handling**: try/catch with user-friendly error messages via AlertaContext
- **No semicolons**, template literals preferred, ES6+ syntax
