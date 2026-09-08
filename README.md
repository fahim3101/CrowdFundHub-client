# CrowdFundHub — Client

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black" alt="Firebase Auth" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white" alt="Vercel" />
</p>

**CrowdFundHub** is a crowdfunding platform where **Creators** launch campaigns for projects, causes, and products, and **Supporters** back them with platform credits. This is the **client-side** React application — the API lives in a separate repository, linked below.

## 📌 Project Links

| | |
|---|---|
| 🔗 Live Site | https://crowd-fund-hub-client.vercel.app |
| 🔗 Server Repository | https://github.com/fahim3101/CrowdFundHub-server |
| 🔗 Server API | https://crowd-fund-hub-server.vercel.app |
| 🔐 Demo Admin Email | admin@gmail.com |
| 🔐 Demo Admin Password | Admin123 |

## ✨ Features

- 🎠 **Animated homepage** — hero carousel (Swiper), top-funded campaigns, testimonial slider, category browser, impact stats, and how-it-works section, all with scroll-triggered entrance animations.
- 🔐 **Dual authentication** — email/password and Google sign-in via Firebase. The Firebase ID token is exchanged with the server for a short-lived JWT that authorizes every API call.
- 🔁 **Persistent sessions** — hard-reloading a private route never bounces the user to `/login`; the app waits for Firebase to resolve before routing.
- 🧭 **Three role-based dashboards** — Supporter, Creator, and Admin, each with its own sidebar navigation and pages, guarded by route-level role checks.
- 💸 **Live credit system** — the navbar balance updates instantly after every purchase or contribution.
- 📢 **Notification center** — a floating, click-outside-to-close popup fed by the server's notification feed, with an unread badge.
- 🖼️ **imgBB image uploads** — profile photos at registration and cover images for campaigns.
- 💳 **Stripe Elements checkout** — a real card-payment UI for buying credit packages; pricing stays authoritative on the server.
- 🔍 **Search, filter & sort** — the Explore page supports live search, category filtering, and multiple sort orders.
- 📄 **Pagination** — contribution history is paginated instead of dumped in one long list.
- 🧑‍💼 **My Profile for every role** — view and edit name/photo plus role-relevant stats.
- 📱 **Fully responsive** — mobile, tablet, and desktop layouts with a collapsible dashboard sidebar.
- 🎨 **Custom design system** — a distinct "ledger" identity (deep pine green, warm gold, signature progress-bar motif) instead of a generic template.

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 (private + role-guarded routes) |
| Styling | Tailwind CSS 3 |
| Auth | Firebase Authentication (email/password + Google) |
| HTTP | Axios with a JWT-attaching interceptor |
| Carousels | Swiper |
| Payments | Stripe.js + React Stripe Elements |
| Icons | Lucide React |
| Toasts | react-hot-toast |
| Hosting | Vercel |

## 📁 Folder Structure

```
client/
├── src/
│   ├── api/                # axiosSecure instance + imgBB upload helper
│   ├── components/         # Navbar, Footer, CampaignCard, CheckoutForm,
│   │                       # NotificationBell, Reveal, skeletons, badges…
│   ├── contexts/           # AuthContext (Firebase + JWT + role/credits)
│   ├── firebase/           # Firebase client config (VITE_* env vars)
│   ├── hooks/              # useAuth, useAxiosSecure, useInView
│   ├── layouts/            # MainLayout, DashboardLayout
│   ├── pages/
│   │   ├── Home/             # Home, Hero, TopFunded, Testimonials,
│   │   │                     # ExploreByCategory, ImpactInNumbers, HowItWorks
│   │   └── Dashboard/         # SupporterHome, CreatorHome, AdminHome,
│   │                          # MyCampaigns, MyContributions, AddCampaign,
│   │                          # Withdrawals, WithdrawalRequests, ManageUsers,
│   │                          # ManageCampaigns, Reports, PurchaseCredit,
│   │                          # PaymentHistory, Profile, DashboardRedirect
│   ├── routes/             # Router, PrivateRoute, RoleRoute
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
| `/explore-campaigns` | Browse live campaigns (search / filter / sort) |
| `/campaign/:id` | Campaign details + contribution form |
| `/login`, `/register` | Auth pages |
| `/dashboard/supporter-home`, `/my-contributions`, `/purchase-credit`, `/payment-history` | Supporter dashboard |
| `/dashboard/creator-home`, `/add-campaign`, `/my-campaigns`, `/withdrawals` | Creator dashboard |
| `/dashboard/admin-home`, `/manage-users`, `/manage-campaigns`, `/withdrawal-requests`, `/reports` | Admin dashboard |
| `/dashboard/profile` | My Profile — all roles (view + edit name/photo, role stats) |

## ⚙️ Environment Variables

Create a `.env` file (see `.env.example`). Never commit real values:

```dotenv
VITE_apiKey=
VITE_authDomain=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=
VITE_API_URL=http://localhost:5000   # no trailing slash; use the deployed API in production
VITE_IMGBB_API_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

> These are Firebase/imgBB/Stripe **publishable** keys — safe for the browser. The matching secrets live only in the server's `.env`.

## 🚀 Getting Started Locally

```bash
git clone https://github.com/fahim3101/CrowdFundHub-client.git
cd CrowdFundHub-client
npm install
cp .env.example .env   # then fill in the values above
npm run dev
```

Runs at `http://localhost:5173`. The server must be running too — locally (`CrowdFundHub-server` with `npm run dev`) or the deployed API via `VITE_API_URL`.

## ☁️ Deployment

Deployed on **Vercel**. `vercel.json` contains SPA rewrites so deep links (e.g. `/dashboard/my-campaigns`) don't 404 on refresh. Pushing to `main` triggers an automatic redeploy — remember to mirror `.env` values in the Vercel dashboard and redeploy after changing them.

## 📄 License

MIT
