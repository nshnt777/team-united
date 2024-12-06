# Team United

**Team United** is a sports-based social media platform where users can connect based on shared hobbies and sports interests. The platform enables users to form teams, communicate with teammates, book venues, and participate in local sports activities.

## Features

### User Management

- Sign up and log in with ease.
- Edit your profile with details such as username, email, age, and hobbies.

### Team Collaboration

- Create and join teams based on sports interests.
- Request to join teams with approval workflows for team leaders.
- Leave teams you're no longer part of.

### Communication

- **Team Chat:** WhatsApp-like chat interface for seamless communication within teams.
- Infinite scroll in chat to load messages efficiently while maintaining scroll position.

### Venue Booking

- Explore venues based on your sport preferences.
- View venue details, including location and available dates/slots.
- Book venues for your team for specific slots.

### Events and Activities

- Organize and discover local sports events and tournaments.
- List your team's participation in local championships or activities.

### Popular Teams

- Explore the most popular teams based on member count.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js, Node.js, Prisma ORM
- **Database:** PostgreSQL
- **Monorepo:** Turborepo

## Folder Structure

```plaintext
/ Team United
├── apps
│   ├── socket-server (WebSocket server for chatting)
│   └── user-app (user facing app)
├── packages
│   ├── db (Database models and seeding)
│   ├── ui (Reusable UI components)
│   └── validation (zod validations) 
└── README.md
```

## Installation

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nshnt777/team-united.git
   cd team-united
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**<br>
   Clone the .env.examples file in /packages/db and /apps/user-app, rename them to .env, and and configure the required variables:

   #### In /packages/db
   ```plaintext
   DATABASE_URL=your_database_url
   ```

   #### In /apps/user-apps
   ```plaintext
   JWT_SECRET=your_jwt_key
   NEXTAUTH_URL=your_base_url
   GEOCODING_API_KEY=your_api_key_from_OpenCage
   ```

4. **Set up PostgreSQL database:**

    - Create a PostgreSQL database.
        ```CREATE DATABASE team_united;```
    - Update the DATABASE_URL in /packages/db/.env with your database connection string.

5. **Initialize Prisma:**
   Navigate to /packages/db and run the following commands:
    ```bash
    npx prisma db push
    npm run seed
    ```

6. **Run the app locally:**
   ```bash
   npm run dev
   ```
7. **Access the app:**
   Open http://localhost:3000 in your browser.
