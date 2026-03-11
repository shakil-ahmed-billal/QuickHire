# QuickHire - Modern Job Portal

QuickHire is a comprehensive, modern job portal designed to connect employers with talented individuals. Built with a robust full-stack architecture, it offers a seamless experience for browsing jobs, applying for positions, and managing job postings.

## 🚀 Live Demo

- **Frontend:** [https://quickhire-bd.vercel.app/](https://quickhire-bd.vercel.app/)
- **Backend API:** [https://api-quickhire-bd.vercel.app](https://api-quickhire-bd.vercel.app)

---

## 🔐 Admin Credentials (Demo)

For evaluation purposes, use the following credentials to access the admin functionality:

- **Email:** `admin@quickhire.com`
- **Password:** `password123`

> [!IMPORTANT]
> These credentials are provided for the demo environment and were generated during the initial database seeding.

---

## ✨ Features

- **Job Browsing:** Explore featured and latest job opportunities across various categories.
- **Category Filtering:** Find jobs easily by navigating through specialized categories like Design, Technology, Engineering, and more.
- **Job Details:** Detailed information for each job post, including company info, requirements, and salary.
- **Responsive Design:** A premium, mobile-first experience that looks great on all devices.
- **Admin Dashboard:** Centralized management for job posts and categories.
- **Dynamic Seeding:** Pre-populated data with real assets uploaded to Cloudinary.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Library:** [React 19](https://reactjs.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Components:** [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/), [Base UI](https://base-ui.com/)
- **State/Data Fetching:** Axios

### Backend
- **Runtime:** Node.js
- **Server Framework:** [Express](https://expressjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (with `@prisma/adapter-pg`)
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt
- **Image Management:** [Cloudinary](https://cloudinary.com/) (using `multer` and `multer-storage-cloudinary`)
- **Validation:** [Zod](https://zod.dev/)

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (Latest LTS)
- pnpm / npm / yarn
- PostgreSQL Database

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd QuickHire
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   cp .env.example .env # Configure your DB and Cloudinary keys
   pnpm install
   pnpm prisma generate
   pnpm dlx prisma db seed # Seed the database with admin credentials
   pnpm dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   pnpm install
   pnpm dev
   ```

The application will be accessible at `http://localhost:3000`.

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.
