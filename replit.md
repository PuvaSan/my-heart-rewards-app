# Heart Rewards - Goal Tracker for Children

## Overview

Heart Rewards is a child-friendly goal-setting web application built with a full-stack architecture. The app empowers children to create and manage their own tasks and rewards using a "hearts" currency system. It follows a high-trust philosophy where children have full control over their goal-setting process, with minimal parental oversight through a simple confirmation gate.

## System Architecture

The application follows a monorepo structure with a clear separation between client and server:

- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured but currently using in-memory storage)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Client-side localStorage with React state
- **Build Tool**: Vite for frontend, esbuild for backend

## Key Components

### Frontend Architecture
- **React SPA**: Single-page application with wouter for routing
- **Component Library**: shadcn/ui components for consistent UI
- **State Management**: Local React state with localStorage persistence
- **Type Safety**: Full TypeScript coverage
- **Styling**: Tailwind CSS with custom color scheme (coral, teal, sunny, mint themes)

### Backend Architecture
- **Express Server**: RESTful API structure (routes not yet implemented)
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Database Ready**: Drizzle ORM configured for PostgreSQL migration
- **Type Safety**: Shared TypeScript types between client and server

### Database Schema
Currently using in-memory storage, but PostgreSQL schema is defined:
- **Users table**: Basic user authentication structure (id, username, password)
- **Extensible**: Ready for task and reward tables when backend integration is completed

## Data Flow

1. **Client-Side Management**: All current functionality runs in the browser
2. **Local Storage**: App state persists in localStorage
3. **Component Communication**: Props and state lifting for data flow
4. **Future Server Integration**: Ready for API integration with existing storage interface

Current data entities:
- **Tasks**: id, text, rewardValue (hearts earned)
- **Rewards**: id, text, cost (hearts required)
- **App State**: hearts count, tasks array, rewards array

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React Query for future API calls
- **UI Components**: Radix UI primitives, shadcn/ui, Lucide icons
- **Styling**: Tailwind CSS, class-variance-authority
- **Forms**: React Hook Form with Zod validation
- **Routing**: wouter for lightweight routing

### Backend Dependencies
- **Database**: Drizzle ORM, @neondatabase/serverless, connect-pg-simple
- **Validation**: Zod for schema validation
- **Build Tools**: tsx for development, esbuild for production

### Development Tools
- **Replit Integration**: Vite plugins for Replit environment
- **TypeScript**: Full type safety across the stack
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

- **Platform**: Replit with autoscale deployment
- **Build Process**: 
  - Frontend: Vite build to `dist/public`
  - Backend: esbuild bundle to `dist/index.js`
- **Environment**: 
  - Development: `npm run dev` (frontend and backend)
  - Production: `npm run start`
- **Database**: PostgreSQL 16 module configured in Replit
- **Port Configuration**: Internal port 5000, external port 80

## Changelog

Changelog:
- June 14, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.