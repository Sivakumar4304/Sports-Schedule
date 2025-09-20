# Sports Schedule Management App

A web application to manage sports sessions, allowing users to create, join, and leave sessions. Admins can also add new sports to the system.

## Features

- **User Roles**: Admin and Regular User
- **Admin Capabilities**:
  - Add new sports
  - Create sessions
  - Edit or delete sessions
- **User Capabilities**:
  - View available sessions
  - Join sessions
  - Leave joined sessions
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Session details and participants update dynamically

## Tech Stack

- **Frontend**: Next.js, React, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Cookie-based sessions
- **Version Control**: Git, GitHub

## Folder Structure

Frontend/
├─ public/ # Static assets
├─ src/app/ # Next.js app folder
│ ├─ components/ # React components
│ ├─ styles/ # CSS files
│ ├─ login/ # Login page
│ ├─ signup/ # Signup page
│ └─ [id]/dashboard/ # Dashboard page
├─ package.json
└─ README.md



## How to Run

1. Navigate to the frontend folder:

```bash
cd Frontend

2.Install dependencies:
npm install
3.Run the development server:
npm run dev
4.http://localhost:3000
