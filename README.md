# Campus Eye - Placement Intelligence & Interview Experience Platform

Campus Eye is a full-stack web platform designed to streamline campus placement management and interview intelligence for educational institutions. The platform connects student placement candidates with institutional placement administrators, enabling real-time company tracking, peer-to-peer interview experience sharing, threaded technical discussions, application funnel tracking, and structured preparation monitoring.

---

## Executive Summary

Campus placement drives involve complex workflows, fragmented communication, and significant information asymmetry among students preparing for company recruitment rounds. Campus Eye consolidates recruitment drive logistics and student preparation into a unified platform. 

Administrators maintain authoritative records of visiting companies, package offerings, eligibility criteria, and drive schedules, while also reviewing student-submitted experiences. Students access a searchable database of visiting firms, read and contribute interview round write-ups, participate in threaded technical discussions, track application statuses through a personalized funnel, and monitor preparation across core Computer Science disciplines.

---

## Key System Capabilities

### 1. Recruitment Drive & Timeline Management
- Centralized listing of visiting companies with metadata including salary packages (LPA), minimum CGPA eligibility thresholds, job locations, drive dates, and required technology stacks.
- Real-time parameter filtering supporting text queries, minimum compensation floors, maximum academic requirements, drive status (Upcoming vs. Visited), and one-click technology stack filter chips (`React`, `Java`, `Node.js`, `Python`, `C++`, `SQL`, `System Design`).

### 2. Interview Experience Knowledge Base
- Structured repository of student interview experiences detailing round-by-round technical questions, coding problems, online assessment patterns, and interview strategies.
- Expandable text presentation with word-count controls for long submissions.
- Support for unlisted company experience submissions with administrator approval workflows.

### 3. Threaded Discussion & Knowledge Sharing
- Multi-level nested comment threads on individual interview experiences.
- Atomic voting mechanisms (upvoting and downvoting) for both interview posts and individual comments.
- Dynamic visual feedback for active user vote states.

### 4. Personal Application Funnel Tracking
- Student application tracking pipeline categorizing target companies across five status stages: `Targeting`, `Applied`, `Interviewed`, `Selected`, and `Rejected`.
- In-line status updating and pipeline item management.

### 5. Academic & Skill Preparation Checklist
- Topic-wise preparation tracker covering fundamental and advanced domains:
  - Data Structures & Algorithms (Arrays, Strings, Two Pointers, Sliding Window, Binary Search, Dynamic Programming, Graphs, Trees).
  - Core Computer Science (Object-Oriented Programming, Operating Systems, Database Management Systems, Computer Networks, System Design).
  - Analytical & Querying Skills (Aptitude, SQL).
- Automated progress calculation and percentage visualization.

### 6. Administrator Control & Moderation
- Dashboard interface for evaluating student-submitted unlisted company experiences.
- Approval workflow converting unlisted student submissions into formal system company entries with logo uploads and metadata validation.
- Moderation privileges to reject submissions or remove inappropriate posts and comments.

### 7. Notification System
- Notification bell indicator with live unread count badges.
- System notifications triggered upon administrator approval or status changes.
- Batch "Mark All as Read" functionality.

---

## Technical Stack

| Layer | Component | Specification |
|---|---|---|
| **Frontend Framework** | React 19 | Functional components with Hooks, React Router DOM v7 |
| **Build Tool & Bundler** | Vite 8 | Fast module replacement and production bundling |
| **Styling Engine** | TailwindCSS v4 | Custom utility classes, responsive breakpoints, design system tokens |
| **Animations & FX** | Framer Motion | Smooth layout transitions, tab pill layout shifts, modal fade-ins |
| **HTTP Client** | Axios | Custom instance with 401 response interceptor and token management |
| **Backend Runtime** | Node.js (v22 LTS) | Asynchronous non-blocking event-driven execution |
| **Web Server Framework** | Express.js | RESTful routing, custom middleware pipelines, CORS control |
| **Database** | MongoDB | Document-oriented database using Mongoose ODM |
| **Authentication** | JWT & bcryptjs | Token-based auth stored in HTTP-only cookies and headers, password hashing |
| **Security & Utilities** | Express Rate Limit | IP-based request throttling on sensitive authentication and OTP routes |
| **Email Service** | Nodemailer | SMTP transport for 6-digit OTP verification codes |
| **File Storage** | Multer & Cloudinary | Multipart form data processing and Cloudinary CDN image uploads |

---

## System Security & Database Optimization

### 1. Atomic Operations & Concurrency Control
Voting operations on experiences and comments execute using native MongoDB atomic operators (`$addToSet` and `$pull`). This eliminates race conditions during concurrent user votes and ensures consistent count metrics without requiring heavy multi-document transactions.

### 2. Rate Limiting & Denial of Service Protection
Authentication and password recovery routes incorporate IP-based rate limiting via `express-rate-limit`:
- Password reset OTP request endpoint is limited to 5 requests per 15-minute window per IP.
- Authentication endpoints limit rapid brute-force login attempts.
- Search filter parameters undergo regular expression escaping (`escapeRegex`) to prevent Regular Expression Denial of Service (ReDoS) vulnerability vectors.

### 3. Cascading Document Cleanup
Deletion of an experience post automatically triggers cascading deletions of all associated top-level comments and child replies. Similarly, deleting a parent comment recursively cleans up all nested child reply documents from the database.

### 4. Indexing Strategy
Compound MongoDB indexes enhance query resolution speeds:
- `Experience` Schema: `{ status: 1, createdAt: -1 }`, `{ company: 1, status: 1 }`, `{ user: 1, createdAt: -1 }`.
- `Company` Schema: `{ status: 1, visitingDate: 1 }`, `{ offeredPackage: 1 }`, `{ eligibility: 1 }`.
- `User` Schema: Unique sparse index on `email` with enforced `lowercase: true` and `trim: true`.

---

## Repository Structure

```
campus-eye/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection initialization
│   ├── controller/
│   │   ├── authController.js      # Authentication, registration, OTP reset logic
│   │   ├── commentController.js   # Threaded comments, replies, and comment voting
│   │   ├── companyController.js   # Company CRUD and search filtering
│   │   ├── companyStatusController.js # Application funnel tracking logic
│   │   ├── experienceController.js# Experience feed, unlisted approval, post voting
│   │   ├── notificationController.js# User notification fetch and read status updates
│   │   └── userController.js     # User profile and preparation checklist updates
│   ├── middleware/
│   │   ├── adminMiddleware.js    # Administrator role validation guard
│   │   ├── authMiddleware.js     # JWT verification middleware
│   │   ├── multer.js             # File upload parser middleware
│   │   └── rateLimiter.js        # Express rate limiting middleware definitions
│   ├── models/
│   │   ├── commentModel.js       # Comment schema with parent-child references
│   │   ├── companyModel.js       # Company schema with compound indexes
│   │   ├── companyStatusModel.js # Application tracking funnel schema
│   │   ├── experienceModel.js    # Experience schema with voting arrays
│   │   ├── notificationModel.js  # User notification schema
│   │   ├── otpModel.js           # One-Time Password verification schema with TTL
│   │   └── userModel.js          # User schema with academic attributes
│   ├── routes/                   # Express router definitions
│   ├── utils/
│   │   ├── cloudinary.js         # Cloudinary SDK image upload helper
│   │   ├── escapeRegex.js        # ReDoS input sanitization helper
│   │   ├── generateToken.js      # JWT token signer
│   │   └── sendEmail.js          # Nodemailer SMTP transporter
│   └── server.js                 # Server entrypoint and Express configuration
│
└── frontend/
    └── src/
        ├── components/           # Reusable interface components
        │   ├── AddExperienceModal.jsx
        │   ├── ApproveExperienceModal.jsx
        │   ├── CommentNode.jsx
        │   ├── CommentSection.jsx
        │   ├── CompanyCard.jsx
        │   ├── CompanyModal.jsx
        │   ├── CompanyTracker.jsx
        │   ├── EditProfileModal.jsx
        │   ├── ExperienceCard.jsx
        │   ├── FilterBar.jsx
        │   ├── MyExperiences.jsx
        │   ├── Navbar.jsx
        │   ├── Notifications.jsx
        │   ├── PrepCheckList.jsx
        │   └── SkeletonLoaders.jsx
        ├── context/
        │   └── AuthContext.jsx   # Global user state and authentication provider
        ├── pages/
        │   ├── AdminPanel.jsx
        │   ├── ForgotPasswordPage.jsx
        │   ├── HomePage.jsx
        │   ├── InterviewExperience.jsx
        │   ├── LandingPage.jsx
        │   ├── LoginPage.jsx
        │   ├── Profile.jsx
        │   └── Timeline.jsx
        ├── utils/
        │   └── api.js            # Axios client with interceptors
        ├── App.jsx               # Client-side route configuration
        ├── main.jsx              # React DOM root entrypoint
        └── index.css             # TailwindCSS configuration & base styles
```

---

## Installation & Setup Guide

### Prerequisites
- Node.js version 18.x or higher
- MongoDB instance (Local deployment or MongoDB Atlas connection string)
- Cloudinary Account (API Key, Secret, and Cloud Name for image storage)
- SMTP Mail Account (Gmail App Password or SMTP credentials for OTP delivery)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/iamanshkumar/campus-eye.git
cd campus-eye
```

---

### Step 2: Configure the Backend Environment

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` configuration file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database & Security
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campus-eye?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key_here

# Email OTP Transporter (Nodemailer)
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_smtp_app_password

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server in development mode:

```bash
npx nodemon server.js
```

---

### Step 3: Configure the Frontend Environment

Navigate to the `frontend` directory and install dependencies:

```bash
cd ../frontend
npm install
```

Start the frontend Vite development server:

```bash
npm run dev
```

The application client will be accessible at `http://localhost:5173`.

---

## API Specification Reference

### Authentication Endpoints (`/api/auth`)

| Method | Route | Description | Authorization |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user account | Public |
| POST | `/api/auth/login` | Authenticate user and issue JWT token | Public |
| POST | `/api/auth/logout` | Clear authentication token cookie | Public |
| GET | `/api/auth/profile` | Retrieve current authenticated user profile | Required |
| POST | `/api/auth/forget-password` | Generate and dispatch 6-digit OTP code | Public (Rate Limited) |
| POST | `/api/auth/reset-password` | Validate OTP code and update password | Public (Rate Limited) |

### Company Management Endpoints (`/api/companies`)

| Method | Route | Description | Authorization |
|---|---|---|---|
| GET | `/api/companies` | Query visiting companies with search & filter params | Required |
| GET | `/api/companies/:id` | Retrieve detailed information for a single company | Required |
| POST | `/api/companies` | Create a new company record (Multipart logo upload) | Admin Only |
| PUT | `/api/companies/:id` | Update an existing company record | Admin Only |
| DELETE | `/api/companies/:id` | Remove a company record from the database | Admin Only |

### Experience Vault Endpoints (`/api/experiences`)

| Method | Route | Description | Authorization |
|---|---|---|---|
| GET | `/api/experiences` | Fetch approved interview experiences (Paginated) | Required |
| GET | `/api/experiences/me` | Fetch experiences authored by current user | Required |
| GET | `/api/experiences/admin/status` | Fetch pending or rejected experience submissions | Admin Only |
| POST | `/api/experiences` | Submit a new interview experience (Listed/Unlisted) | Required |
| PUT | `/api/experiences/:id/approve` | Approve unlisted submission & create company entry | Admin Only |
| PUT | `/api/experiences/:id/reject` | Reject an experience submission | Admin Only |
| PUT | `/api/experiences/:id/upvote` | Toggle upvote state on an experience post | Required |
| PUT | `/api/experiences/:id/downvote` | Toggle downvote state on an experience post | Required |
| DELETE | `/api/experiences/:id` | Delete an experience post and cascading comments | Owner / Admin |

### Comment Discussion Endpoints (`/api/comments`)

| Method | Route | Description | Authorization |
|---|---|---|---|
| GET | `/api/comments/:experienceId` | Fetch threaded comments and nested replies | Required |
| POST | `/api/comments` | Post a top-level comment or nested reply | Required |
| PUT | `/api/comments/:id/upvote` | Toggle upvote state on a comment | Required |
| PUT | `/api/comments/:id/downvote` | Toggle downvote state on a comment | Required |
| DELETE | `/api/comments/:commentId` | Delete a comment and recursive nested replies | Owner / Admin |

### Application Funnel Endpoints (`/api/status`)

| Method | Route | Description | Authorization |
|---|---|---|---|
| GET | `/api/status` | Retrieve user's tracked company application funnel | Required |
| POST | `/api/status` | Add a company to application funnel | Required |
| PUT | `/api/status/:companyId` | Update application stage (`targeting` to `selected`) | Required |
| DELETE | `/api/status/:companyId` | Remove a company from application funnel | Required |

### User Profile & Checklist Endpoints (`/api/user`)

| Method | Route | Description | Authorization |
|---|---|---|---|
| PUT | `/api/user/profile` | Update user personal and academic profile details | Required |
| PUT | `/api/user/checklist` | Update preparation checklist topic completion states | Required |

### Notification Endpoints (`/api/notifications`)

| Method | Route | Description | Authorization |
|---|---|---|---|
| GET | `/api/notifications/me` | Fetch user notification history | Required |
| PUT | `/api/notifications/:id/read` | Mark individual notification as read | Required |
| PUT | `/api/notifications/read-all` | Mark all user notifications as read | Required |

---

## User Roles & Permission Matrix

| Action / Resource | Student Role | Administrator Role |
|---|:---:|:---:|
| Browse Company Timeline & Filter | Granted | Granted |
| Track Companies in Application Funnel | Granted | Granted |
| Maintain Preparation Checklist | Granted | N/A |
| Submit Interview Experience | Granted | Granted |
| Post Comments & Nested Replies | Granted | Granted |
| Upvote / Downvote Posts & Comments | Granted | Granted |
| Delete Personal Posts & Comments | Granted | Granted |
| Create / Edit Official Listed Companies | Denied | Granted |
| Review Pending Unlisted Experiences | Denied | Granted |
| Approve / Reject Student Submissions | Denied | Granted |
| Moderate Any Post or Comment | Denied | Granted |

---

## Production Build & Verification

To verify frontend compilation and build integrity for production deployment:

```bash
cd frontend
npm run build
```

The production output bundle will be generated in `frontend/dist/`.

---

## License

Distributed under the MIT License. See `LICENSE` for further information.

---

## Author & Maintainer

**Ansh Kumar**
- Project Repository: [https://github.com/iamanshkumar/campus-eye](https://github.com/iamanshkumar/campus-eye)
- GitHub Profile: [@iamanshkumar](https://github.com/iamanshkumar)
