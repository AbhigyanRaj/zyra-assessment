# Zyra Assessment

This repository contains the implementation for the Zyra Software Engineer Assessment, including **Task 1: Core Assessment** and **Task 2: Backend Bonus**. It consists of a React frontend and a Node.js backend.

## Project Structure

- `/frontend` - React application built with Vite, TypeScript, and Tailwind CSS.
- `/backend` - Node.js REST API built with Express and TypeScript.

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend server will start on `http://localhost:3001`.

### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will start on `http://localhost:5173`.

## Architecture Overview

- **Frontend**: Utilizes `Zustand` for client state management and `@tanstack/react-query` for server state and optimistic UI updates. The styling is powered by Tailwind CSS v4, adhering to a strict, accessible design system.
- **Backend**: Built on Express with a clear Controller-Service architecture. Input validation is handled via `zod`. Security middleware (`helmet`, `cors`, `express-rate-limit`) is configured for production readiness.

For detailed API documentation and backend architecture notes, see the [Backend README](./backend/README.md).
