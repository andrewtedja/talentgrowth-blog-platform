# Blogify - Talent Growth Blog Platform

A modern, full-stack blog application designed for performance, scalabilty, and a premium user experience. Built with Next.js and Express, utilizing a modular feature-based architecture.

## 🚀 Live Demo

- **Frontend**: [View Live Demo](https://talentgrowth-blog-platform.vercel.app/)
- **Backend API**: [API Base URL](talentgrowth-blog-platform-production.up.railway.app)

## Tech Stack

**Frontend**

- **Framework**: Next.js 16 (App Router, SSR & ISR)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Tailwind Animate
- **State & Data Fetching**: TanStack Query (React Query)
- **Forms & Validation**: React Hook Form, Zod
- **UI Components**: Radix UI (Headless), Lucide React (Icons)
- **Editor**: SimpleMDE (Markdown Editor), React Markdown, Remark GFM
- **Utilities**: clsx, tailwind-merge, class-variance-authority

**Backend**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Validation**: Zod (Shared schema validation)

**Deployment**

- **Frontend**: Vercel (Optimized for Next.js)
- **Backend**: Railway (Reliable container hosting)

---

## How to Run Locally

### Prerequisites

- Node.js (v18+)
- pnpm (Preferred package manager)
- PostgreSQL database (Local or Cloud)

### Steps

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/andrewtedja/talentgrowth-blog-platform
    ```

2.  **Environment Setup**
    Create a `.env` file in the `backend` directory and a `.env.local` file in the `frontend` directory using the following keys:

    **Backend (`backend/.env`)**

    ```env
    PORT=5000
    DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
    JWT_SECRET=your_super_secret_jwt_key
    NODE_ENV=development
    ```

    **Frontend (`frontend/.env.local`)**

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

3.  **Install Dependencies**

    ```bash
    # Install root dependencies (if any)
    pnpm install

    # Install Frontend dependencies
    cd frontend
    pnpm install

    # Install Backend dependencies
    cd ../backend
    pnpm install
    ```

4.  **Database Migration (Backend)**

    ```bash
    cd backend
    pnpm db:push
    ```

5.  **Run Development Servers**
    Open two terminal instances:

    - **Terminal 1 (Backend)**:

      ```bash
      cd backend
      pnpm dev
      ```

    - **Terminal 2 (Frontend)**:
      ```bash
      cd frontend
      pnpm dev
      ```

6.  **Access the Application**
    Open `http://localhost:3000` in your browser.

---

## Backend API Structure

The API follows a RESTful architecture, organized by resources.

- `GET    /api/posts` - Retrieve paginated list of posts (Public)
- `GET    /api/posts/:id` - Retrieve a single post (Public)
- `POST   /api/posts` - Create a new post (Protected)
- `PUT    /api/posts/:id` - Update an existing post (Protected, Author only)
- `DELETE /api/posts/:id` - Delete a post (Protected, Author only)
- `POST   /api/auth/register` - User registration
- `POST   /api/auth/login` - User login

**Interaction:**
The frontend communicates with these endpoints using a typed API client (Axios) integrated with TanStack Query for caching and state management. Authentication headers are automatically verified via middleware.

---

## Design Decisions & Architecture

- **Modular Architecture**: Both frontend and backend codebases are organized by features (e.g., `features/posts`, `features/auth`). This separation of concerns ensures maintainability and easier scalability compared to layer-based structures.
- **Client-Side Caching (TanStack Query)**: Implemented to significantly reduce server load and improve user experience. Data is cached in the browser, providing instant navigation feedback and reducing redundant network requests.
- **Rendering Strategy (SSR & ISR)**: Next.js is utilized for its Server-Side Rendering capabilities to ensure SEO optimization and fast initial page loads. Interactive components hydrate on the client.
- **.http** files for manual QA testing for endpoints instead of using API clients like Bruno/Postman/Insomnia for efficient and fast testing
- **JWT Authentication with httpOnly cookies for secure authentication**: JWT is used for authentication and authorization. The JWT is stored in a httpOnly cookie, which is sent with every request to the server. The server then verifies the JWT and returns the user data, utilizes interceptors to verify the JWT and return the user data
- **Database & ORM**:

  - **PostgreSQL**: Chosen for its robust relational data model integrity, essential for structured blog content, user relationships, and comments. Deployed with Neon (Serverless) for cost-effectiveness and ease of use.
  - **Drizzle ORM**: Selected over Prisma for its lightweight nature, SQL-like syntax, and zero-runtime overhead. It provides strict type safety and efficient query performance.
  - **DB Indexing**: Database columns frequently used in filtering and sorting (like `created_at` and `author_id`) are indexed to ensure sub-millisecond query performance as the dataset grows.

- **Styling Strategy**:
  - **Tailwind CSS**: Used for rapid, atomic styling directly in markup.
  - **Radix UI**: Adopted for accessible, unstyled headless primitives (Dialogs, Slots) to build a custom design system with full control over accessibility (a11y).
  - **Class Variance Authority (CVA)**: Implemented to manage complex component variants (Primary/Secondary buttons, sizes) in a type-safe manner.
- **Deployment Strategy**:
  - **Frontend on Vercel**: Chosen for its native support for Next.js, Edge Network, and automatic optimizing of assets.
  - **Backend on Railway**: Selected for its stable persistent container support, easy environment management, and cost-effectiveness compared to Heroku.
- **Responsive Design**: The UI is built mobile-first, ensuring a seamless experience across all devices, from mobile phones to large desktop screens.

---

## Future Improvements

- **Advanced Caching**: Implement Redis for server-side caching of API responses to further reduce database load.
- **Rich Text Features**: Enhance the editor with image uploads to cloud storage (AWS S3) and drag-and-drop functionality.
- **Social Features**: Add likes, social sharing, and nested comments.

---

## 📂 Project Structure

```text
├── frontend/
│   ├── src/
│   │   ├── _components/    # Shared UI components (Radix + Tailwind)
│   │   ├── _utils/         # Helper functions
│   │   ├── app/            # Next.js App Router pages & layouts
│   │   ├── core/           # Global providers, contexts, and types
│   │   └── features/       # Feature-specific components (auth, posts)
│   └── ...
├── backend/
│   ├── src/
│   │   ├── db/             # Database connection & schema (Drizzle)
│   │   ├── middleware/     # Auth & error handling middleware
│   │   ├── routes/         # Express API route definitions
│   │   └── validations/    # Zod schemas for request validation
│   └── ...
└── README.md
```

---

## Author

Andrew Tedjapratama

## License

MIT License
