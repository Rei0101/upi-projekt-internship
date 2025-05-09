# Schedule-IT

Schedule-IT is a system designed to help students and professors organize their schedules, notes, consultation appointments, exam dates, and other academic obligations.

## Table of Contents

- [Project Introduction](#project-introduction)
- [Functionality Overview](#functionality-overview)
- [Implemented Features](#implemented-features)
- [Development Timeline](#development-timeline)
- [Testing and Validation](#testing-and-validation)
- [Known Issues](#known-issues)
- [GitHub Repository](#github-repository)
- [Setup Instructions](#setup-instructions)

## Project Introduction

Schedule-IT is designed to assist students and professors with academic planning. It offers tools to manage schedules, class groups, personal notes, consultation hours, and exam information.

## Functionality Overview

### For Students

- Log in to the system  
- View personal schedule  
- View and edit notes  
- Change exercise group times (independently or via request)  
- View information about quizzes and exams  

### For Professors

- Log in to the system  
- View personal schedule  
- View and edit notes  
- Independently change lecture/exercise times  
- View information about quizzes and exams  

## Implemented Features

The following features were developed during the project:

- Functional note system  
- Quiz and exam information display  
- Group switching for students (independent or request-based)  
- Login and schedule management for professors  

## Development Timeline

| Week       | Tasks Completed                                                                 |
|------------|----------------------------------------------------------------------------------|
| Weeks 1–2  | Initial PostgreSQL database created and seeded with data                        |
| Week 3     | Student login and schedule view implemented                                     |
| Week 4     | Testing setup and Sprint Demo preparation                                       |
| Week 5     | Notes functionality and quiz/exam views implemented                             |
| Week 6     | Group switching for students, added professor functionality                     |
| Week 7     | Final demo, project completion, and testing                                     |

## Testing and Validation

- **Backend**: Tested using **Jest** and **Supertest** to validate API communication  
- **Frontend**: Tested using **Vitest** and **@testing-library/react** to ensure UI stability  

## Known Issues

A major unresolved issue is session persistence after refresh.  
When a logged-in user refreshes the page, their schedule disappears and access is lost until they log in again. Multiple attempts to fix this led to more complex issues, so the problem remains in the final demo.

## Setup Instructions

### 1. PostgreSQL Database Setup

This project uses PostgreSQL as the primary database.

#### Steps:

1. Download and install PostgreSQL: https://www.postgresql.org/download/  
2. During installation, set the password to `internship`, or update it later:  
   ```sql  
   ALTER USER postgres WITH PASSWORD 'internship';  
   ```
3. Open pgAdmin4  
4. Create a new database called `ScheduleIT-DB`  
5. Right-click the database → Query Tool → Paste content from:  
   - `ScheduleIT-DB SQL code`  
   - `mock entries` files  
6. Verify tables loaded under:  
   `ScheduleIT-DB → Schemas → public → Tables`

### 2. Installing Dependencies and Running the Project

#### Steps:

1. Create a new folder (name doesn’t matter)  
2. Open the folder and launch Git Bash  
3. Clone the repository:  
   ```bash  
   git clone https://github.com/Rei0101/upi-projekt-internship.git  
   ```
4. Open the project in Visual Studio Code  
5. Open two terminals:  
   - One for backend  
   - One for frontend

6. In the first terminal:  
   ```bash  
   cd backend  
   npm install  
   npm start  
   ```

7. In the second terminal:  
   ```bash  
   cd frontend  
   npm install  
   npm run dev  
   ```

8. Click the local development URL provided in the terminal to open the project in your browser.

### Login Credentials

Login credentials can be found:

- In your PostgreSQL database  
- In the `.txt` file named `mock unosi` at:  
  `upi-projekt-internship/backend/src/models/baza`
