# E-Commerce Admin Portal

## Backend (NestJS)

**Main dependencies:**
- NestJS: Node.js framework for scalable server-side applications
- Prisma: ORM for database management
- SQLite: Default database (see `prisma/schema.prisma`)
- Jest: Testing framework

**Setup & Run:**
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Run the backend server (development):
   ```bash
   npm run start:dev
   ```

---

## Frontend (Next.js)

**Main dependencies:**
- Next.js: React framework for SSR and SSG
- React: UI library
- Tailwind CSS: Utility-first CSS framework
- Axios: HTTP client for API requests
- React Hook Form & Zod: Form validation
- Radix UI: Accessible UI primitives

**Setup & Run:**
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend server (development):
   ```bash
   npm run dev
   ```

---

Access the frontend at [http://localhost:3000](http://localhost:3000)

---

**Requirements:**
- Node.js >= 18.x
- npm >= 9.x
- SQLite running locally (or update `prisma/schema.prisma` for your DB)

**Important:**
- Ensure backend is running before using the frontend for API features.
- Environment variables may be required (see `.env.example` in each project).
- For production, review security and performance settings in both projects.
