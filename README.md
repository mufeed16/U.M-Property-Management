# UM Cottage - Property Management System

A full-stack web application for managing a boarding house / cottage property — rooms, tenants, and admin operations. **LIVE freelance project** with animated stats, notification bell, rent heatmap, viewer role, 8 real tenants, and 48 payments.

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router      |
| Backend  | Node.js, Express.js                             |
| Database | MongoDB Atlas (live) + local dev (MongoDB)      |
| Auth     | JWT (JSON Web Tokens) + bcryptjs                |
| Hosting  | Vercel (frontend) + Render (backend)            |

## Project Structure

```
UM COTTAGE/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/         # Axios API config
│       ├── components/  # Reusable UI components
│       ├── context/     # React context (auth state)
│       ├── hooks/       # Custom hooks
│       ├── pages/       # Route pages
│       └── App.jsx      # Router setup
└── server/          # Express backend
    └── src/
        ├── config/      # DB connection (Atlas for prod, local for dev)
        ├── controllers/ # Route handlers
        ├── middleware/   # Auth & error middleware
        ├── models/      # Mongoose schemas
        ├── routes/      # API route definitions
        ├── utils/       # Helper utilities
        ├── index.js     # Server entry point
        └── seed.js      # Database seeder (local dev only)
```

## Prerequisites

- **Node.js** (v18+)
- **MongoDB** running locally on default port (`mongodb://localhost:27017`) for development
- For production: MongoDB Atlas cluster (already set up with real data)

## Setup Procedure (Local Development)

### 1. Clone the repository

```bash
git clone <repo-url>
cd "UM COTTAGE"
```

### 2. Setup environment variables

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/um_cottage
JWT_SECRET=your_jwt_secret_here
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Seed the database (for local development only)

```bash
cd server
npm run seed
```

> ⚠️ **Important**: Never run `npm run seed` on production or after code changes — only use for initializing local development data. Live data is preserved in MongoDB Atlas.

### 5. Start the application

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
Server runs at `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
Client runs at `http://localhost:5173`

### 6. Open in browser

Navigate to `http://localhost:5173` and log in with the admin credentials.

## Deployment (Live)

The application is automatically deployed on git push to:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas (real data)

**Live Demo**: https://um-cottage-propertymanagement.vercel.app

Environment variables for production are set in the respective platforms (Vercel/Render) and include:
- `MONGO_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Production JWT secret
- Other platform-specific variables

After deployment, users may need to hard-refresh (Ctrl+Shift+R) to see updates due to browser caching.

### Viewer Access (Live Site)
To check the live site with viewer privileges:
- **URL**: https://um-cottage-propertymanagement.vercel.app
- **Email**: viewer@umcottage.com
- **Password**: viewer123

> ⚠️ **Note**: Viewer role has read-only access to rooms, tenants, and dashboard statistics.

## API Endpoints

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | `/api/auth/login`     | Login               |
| POST   | `/api/auth/register`  | Register new user   |
| GET    | `/api/rooms`          | List all rooms      |
| POST   | `/api/rooms`          | Create a room       |
| PUT    | `/api/rooms/:id`      | Update a room       |
| DELETE | `/api/rooms/:id`      | Delete a room       |
| GET    | `/api/tenants`        | List all tenants    |
| POST   | `/api/tenants`        | Add a tenant        |
| PUT    | `/api/tenants/:id`    | Update a tenant     |
| DELETE | `/api/tenants/:id`    | Remove a tenant     |
| GET    | `/api/dashboard`      | Dashboard stats     |
| GET    | `/api/health`         | Health check        |

## Scripts

| Directory | Command         | Description                  |
|-----------|-----------------|------------------------------|
| server    | `npm run dev`   | Start server with nodemon    |
| server    | `npm start`     | Start server (production)    |
| server    | `npm run seed`  | Seed database with demo data (local dev only) |
| client    | `npm run dev`   | Start Vite dev server        |
| client    | `npm run build` | Build for production         |
| client    | `npm run lint`  | Run ESLint                   |


> 🔒 **Security**: Rotate any passwords/API keys shared in chat. Live credentials are managed via platform secrets.