# Campus Eye

> The all-in-one command center for campus placement preparation — built for students, by a student.

Campus Eye is a full-stack web platform that bridges the information gap during campus placements. Admins (college placement coordinators) post visiting company details, while students share interview experiences, discuss in threaded comment sections, track their target companies, and monitor their preparation through a topic-wise checklist.

---

## Features

### Admin
- Post visiting companies with logo, package, tech stack, eligibility (CGPA), visiting date, and description
- Edit existing company details
- Delete any experience or comment as a moderator

### Students
- **Company Timeline** — Browse all companies visiting campus with filters (package, CGPA, status, tech stack)
- **Interview Vault** — Read and write interview experiences linked to specific companies
- **Comment Section** — Threaded discussion with upvote/downvote on each experience
- **Company Tracker** — Wishlist companies and track application progress through a personal funnel (Targeting → Applied → Interviewed → Selected/Rejected)
- **Prep Checklist** — Topic-wise preparation tracker covering DSA, Core CS subjects, and System Design
- **Profile** — View and edit personal details, upload a profile picture

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TailwindCSS, Framer Motion, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (stored in httpOnly cookies), bcryptjs |
| **File Uploads** | Multer + Cloudinary |
| **Dev Tools** | Nodemon, dotenv |

---

## Project Structure

```
campus-eye/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controller/      # Route handlers
│   ├── middleware/       # Auth, admin guard, multer/cloudinary
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # JWT generation, sendToken
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── context/     # AuthContext (global user state)
        ├── pages/       # Page-level components
        └── App.jsx
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB URI (Atlas or local)
- Cloudinary account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/iamanshkumar/campus-eye.git
cd campus-eye
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:

```bash
npx nodemon server.js
```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/logout` | Logout | Public |
| GET | `/api/companies` | Get all companies (with filters) | Required |
| POST | `/api/companies` | Add a company | Admin |
| PUT | `/api/companies/:id` | Update a company | Admin |
| GET | `/api/experiences` | Get all experiences | Public |
| POST | `/api/experiences` | Post an experience | Required |
| DELETE | `/api/experiences/:id` | Delete an experience | Owner / Admin |
| PUT | `/api/experiences/:id/upvote` | Toggle upvote | Required |
| GET | `/api/comments/:experienceId` | Get threaded comments | Public |
| POST | `/api/comments` | Post a comment/reply | Required |
| DELETE | `/api/comments/:commentId` | Delete a comment | Owner / Admin |
| GET | `/api/status` | Get tracked companies | Required |
| POST | `/api/status` | Track a company | Required |
| PUT | `/api/status/:companyId` | Update tracking status | Required |
| DELETE | `/api/status/:companyId` | Remove tracked company | Required |
| PUT | `/api/user/checklist` | Update prep checklist | Required |
| PUT | `/api/user/profile` | Update profile | Required |

---

## Roles

| Role | Capabilities |
|---|---|
| `student` | Read companies, post experiences, comment, track companies, manage checklist |
| `admin` | All student permissions + add/edit companies, moderate all content |

> Roles are assigned at the database level. Set `role: "admin"` directly in MongoDB for the admin account.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Ansh Kumar**
- GitHub: [@iamanshkumar](https://github.com/iamanshkumar)
- Project: [campus-eye](https://github.com/iamanshkumar/campus-eye)
