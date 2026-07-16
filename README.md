# CrowdFundHub — Client

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white" alt="Vercel" />
</p>

**CrowdFundHub** is a crowdfunding platform where Creators launch campaigns for projects, causes, and products, and Supporters back them using platform credits. This is the **client-side** React application — the server/API lives in a separate repository, linked below.

## 📌 Project Links

| | |
|---|---|
| 🔗 Live Site | https://crowd-fund-hub-client.vercel.app |
| 🔗 Server Repository | https://github.com/fahim3101/CrowdFundHub-server |
| 🔗 Server API | https://crowd-fund-hub-server.vercel.app |
| 🔐 Admin Email | admin@gmail.com |
| 🔐 Admin Password | Admin123 |

## ✨ Features

- 🎠 **Animated homepage** — hero carousel (Swiper), top-funded campaigns, testimonial slider, category browser, and a platform-stats section, all with scroll-triggered entrance animation.
- 🔐 **Dual authentication** — email/password and Google sign-in via Firebase, with a custom JWT issued by the server for API access.
- 🔁 **Persistent sessions** — reloading a private route never bounces the user back to `/login`; the app waits for Firebase to resolve before deciding.
- 🧭 **Three distinct role-based dashboards** — Supporter, Creator, and Admin, each with its own sidebar navigation and set of pages.
- 💸 **Live credit system** — real-time credit balance shown in the navbar, updated instantly after every purchase or contribution.
- 📢 **Notification center** — a floating, click-outside-to-close notification popup fed by the server's notification feed.
- 🖼️ **imgBB-powered image uploads** — used on both registration (profile photo) and campaign creation (cover image).
- 💳 **Stripe Elements checkout** — a real card-payment UI for buying credit packages.
- 🔍 **Search, filter & sort** — Explore Campaigns supports live search, category filtering, and multiple sort orders.
- 📄 **Pagination** — a supporter's contribution history is paginated rather than dumped in one long list.
- 📱 **Fully responsive** — mobile, tablet, and desktop layouts, including a collapsible dashboard sidebar.
- 🎨 **Custom design system** — a distinct "ledger" visual identity (deep pine green, warm gold, and a signature progress-bar motif) instead of a generic template look.

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication |
| HTTP | Axios (with a token-attaching interceptor) |
| Carousels | Swiper |
| Payments | Stripe.js / React Stripe Elements |
| Icons | Lucide React |
| Notifications (toast) | react-hot-toast |
| Hosting | Vercel |

## 📁 Folder Structure

```
client/
├── src/
│   ├── api/                # axios instance + imgBB upload helper
│   ├── components/         # Navbar, Footer, CampaignCard, Reveal, etc.
│   ├── contexts/           # AuthContext (Firebase + JWT + role/credits)
│   ├── firebase/           # Firebase config
│   ├── hooks/               # useAuth, useAxiosSecure, useInView
│   ├── layouts/             # MainLayout, DashboardLayout
│   ├── pages/
│   │   ├── Home/             # Hero, TopFunded, Testimonials, etc.
│   │   └── Dashboard/         # role-specific dashboard pages
│   ├── routes/               # Router, PrivateRoute, RoleRoute
│   ├── index.css
│   └── main.jsx
├── index.html
├── tailwind.config.js
└── vercel.json                # SPA rewrite rules
```

## 🗺️ Routes

| Path | Description |
|---|---|
| `/` | Homepage |
| `/explore-campaigns` | Browse live campaigns |
| `/campaign/:id` | Campaign details + contribution form |
| `/login`, `/register` | Auth pages |
| `/dashboard/supporter-home`, `/my-contributions`, `/purchase-credit`, `/payment-history` | Supporter dashboard |
| `/dashboard/creator-home`, `/add-campaign`, `/my-campaigns`, `/withdrawals` | Creator dashboard |
| `/dashboard/admin-home`, `/manage-users`, `/manage-campaigns`, `/withdrawal-requests`, `/reports` | Admin dashboard |

## ⚙️ Environment Variables

Create a `.env` file:

```dotenv
VITE_apiKey=
VITE_authDomain=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=
VITE_API_URL=
VITE_IMGBB_API_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

## 🚀 Getting Started Locally

```bash
git clone <this-repo-url>
cd client
npm install
cp .env.example .env   # then fill in the values above
npm run dev
```

Runs at `http://localhost:5173`. The [server repository](#) must be running (locally or deployed) for the app to function.

## ☁️ Deployment

Deployed on **Vercel**. `vercel.json` handles SPA client-side routing so deep links (e.g. `/dashboard/my-campaigns`) don't 404 on refresh. Push to `main` to trigger an automatic redeploy.

## 📄 License

MIT