# Zyra Assessment - Backend (Task 1)

This repository contains the backend implementation for the Counselor Student Action Center (Task 1). 

## Setup & Run Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn`

### Installation
1. Clone this repository.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server
Start the development server:
```bash
npm run dev
```
The server will start on `http://localhost:3001` (or your configured `PORT`).

---

## API Contract

### 1. Get Student Action Center
Retrieves the prioritized action center data for a specific student, including their tasks, messages, and computed urgency metrics.

- **Endpoint:** `GET /students/:id/action-center`
- **Path Parameters:**
  - `id` (string): The unique identifier of the student (e.g., `stu_001`).

**Success Response (200 OK):**
```json
{
  "student": {
    "id": "stu_001",
    "name": "Maya Patel",
    "email": "maya.patel@school.edu",
    "grade": 11,
    "gpa": 3.2,
    "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  },
  "tasks": [
    {
      "id": "tsk_001",
      "studentId": "stu_001",
      "title": "Submit FAFSA application",
      "description": "Deadline is approaching. Student has not started the form.",
      "status": "todo",
      "priority": "urgent",
      "dueDate": "2026-06-05",
      "createdAt": "2026-05-13T14:00:00Z",
      "updatedAt": "2026-05-13T14:00:00Z"
    }
  ],
  "messages": [
    {
      "id": "msg_001",
      "studentId": "stu_001",
      "from": "Mrs. Thompson (Math)",
      "subject": "Maya missing assignments",
      "preview": "Maya has not submitted the last three homework sets...",
      "read": false,
      "receivedAt": "2026-05-30T08:30:00Z"
    }
  ],
  "unreadCount": 2,
  "urgentTaskCount": 2
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Student not found"
}
```

---

### 2. Update Task Status
Updates the status of a specific task.

- **Endpoint:** `PATCH /tasks/:taskId/status`
- **Path Parameters:**
  - `taskId` (string): The unique identifier of the task.
- **Request Body:**
```json
{
  "status": "completed" // Must be one of: 'todo', 'in_progress', 'completed'
}
```

**Success Response (200 OK):**
```json
{
  "id": "tsk_001",
  "studentId": "stu_001",
  "title": "Submit Common App Essay",
  "status": "completed",
  "priority": "urgent",
  "dueDate": "2023-11-01T00:00:00Z",
  "updatedAt": "2024-02-12T14:22:00Z" // Updated automatically
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid status. Must be one of: todo, in_progress, completed"
}
```

---

## Architecture Notes
- **Framework & Language:** Built using **Node.js** with **Express**, strictly typed with **TypeScript** for compile-time safety and developer experience.
- **Project Structure:** 
  - `src/routes/` manages the Express routing layer.
  - `src/controllers/` handles request parsing, validation, and HTTP response formatting.
  - `src/services/` encapsulates all business logic and data access.
  - `src/data/` contains the provided exact mock data, strongly typed via interfaces.
- **Design Decisions:**
  - **Service Layer Pattern:** Even though data is currently served from in-memory arrays (as per Task 1 requirements), the data access logic has been abstracted into a `Service` layer. This decoupling makes it trivial to migrate to a real database like **MongoDB** in the future without touching the controllers.
  - **Runtime Validation:** **Zod** is used to validate incoming request bodies (e.g., in the `PATCH` route) to ensure strict API contracts and prevent bad data from reaching the service layer.
  - **Security & Reliability:** The backend is secured with **Helmet** (HTTP headers) and **express-rate-limit** (in-memory rate limiting, designed to easily plug into Redis). CORS is strictly configured to only allow requests from the local development frontend and the production domain.
  - **Computed Metrics:** Metrics like `unreadCount` and `urgentTaskCount` are computed dynamically on the server-side to ensure the client receives ready-to-use numbers without needing to parse heavy array payloads.
  - **Authentication (Note):** In a production environment, the `counselorId` would be extracted from a verified JWT or session cookie and used to scope the student query (e.g., only return students assigned to the logged-in counselor). For the scope of this assessment, it is currently hardcoded on the frontend.
