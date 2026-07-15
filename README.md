\# LensLog — Frontend



The React frontend for \*\*LensLog\*\*, a photography community platform — share photos, like and comment on others' work, search the community, and manage your profile.



\*\*Live app:\*\* https://lenslog-frontend.vercel.app

\*\*Backend repo:\*\* https://github.com/ishaansehrawat18/lenslog-backend



> ⚠️ The backend is hosted on Render's free tier and spins down after \~15 minutes of inactivity. If the app feels slow to load data on first use, the API is just waking up — give it 30-60 seconds.



\---



\## Features



\- User registration/login with persistent sessions (JWT stored in localStorage)

\- Home feed of all posts, newest first

\- Create, edit, and delete your own posts with image upload

\- Like/unlike posts with instant optimistic UI updates

\- Comment on posts, delete your own comments

\- Search for users and posts (debounced live search)

\- Public profile pages for any user (`/users/:username`)

\- Edit your own profile (name, username, bio, profile picture)

\- Toast notifications for success/error feedback

\- Confirmation dialogs before destructive actions (delete post/comment)

\- Responsive error handling: 404 page, error boundary, session-expiry auto-redirect

\- Lazy-loaded routes for faster initial page load



\---



\## Tech Stack



| Layer | Technology |

|---|---|

| Framework | React 18 (Vite) |

| Routing | React Router v6 |

| HTTP client | Axios |

| State management | React Context API (Auth, Toast, Confirm) |

| Styling | Plain CSS |



\---



\## Folder Structure

lenslog\_frontend/

├── src/

│ ├── components/ # Reusable UI pieces (Navbar, PostCard, LikeButton, CommentBox, etc.)

│ ├── context/ # AuthContext, ToastContext, ConfirmContext

│ ├── hooks/ # useAuth, useToast, useConfirm

│ ├── pages/ # Route-level pages (Home, Login, Profile, PostDetails, etc.)

│ ├── routes/ # AppRoutes.jsx (lazy-loaded routing), ProtectedRoute.jsx

│ ├── services/ # Axios wrappers per API resource (authService, postService, etc.)

│ ├── utils/ # Small helpers (resolveImageUrl)

│ ├── App.jsx # Provider composition + layout

│ ├── main.jsx # App entry point, ErrorBoundary + BrowserRouter

│ └── index.css # Global styles

├── vercel.json # SPA rewrite rule for client-side routing

└── package.json





\---



\## Installation



\### Prerequisites

\- Node.js (v18+)

\- The backend API running (locally or deployed) — see the \[backend README](https://github.com/ishaansehrawat18/lenslog-backend)



\### Steps



1\. Clone the repository:

```bash

&#x20;  git clone https://github.com/ishaansehrawat18/lenslog-frontend.git

&#x20;  cd lenslog-frontend

```



2\. Install dependencies:

```bash

&#x20;  npm install

```



3\. Create a `.env` file in the root:

```env

&#x20;  VITE\_API\_URL=http://localhost:5000

```

&#x20;  (Point this at your deployed backend URL instead if you're not running the API locally.)



4\. Start the development server:

```bash

&#x20;  npm run dev

```

&#x20;  The app will run on `http://localhost:5173`.



5\. To build for production:

```bash

&#x20;  npm run build

```

&#x20;  Output goes to `dist/`.



\---



\## Environment Variables



| Variable | Description | Example |

|---|---|---|

| `VITE\_API\_URL` | Base URL of the backend API | `http://localhost:5000` or `https://lenslog-backend.onrender.com` |



\---



\## Deployment Notes



This app is deployed on \*\*Vercel\*\*. A `vercel.json` rewrite rule is required for client-side routing to work correctly on direct navigation/refresh:



```json

{

&#x20; "rewrites": \[

&#x20;   { "source": "/(.\*)", "destination": "/index.html" }

&#x20; ]

}

```



Without this, visiting a route like `/login` directly (rather than navigating there via a link inside the app) would return a 404, since Vercel would otherwise look for a physical file/folder matching that path instead of letting React Router handle it client-side.



\---



\## Known Limitations



\- No pagination/infinite scroll on the Home feed yet — fine for small datasets

\- Comment counts aren't shown on feed cards (only on the full Post Details page), to avoid an extra API call per card in the feed

\- No notifications system (e.g. "someone liked your post")



\---



\## License



This project was built as a learning/portfolio project. No formal license applied.











