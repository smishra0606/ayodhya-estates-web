# Ayodhya Estate — Panchi Vihar

Full-stack React + Express real-estate site (dynamic gallery, admin panel, inquiry form).

## Table of contents
- Project overview
- Features
- Tech stack
- Quick start (dev)
- Environment variables
- Seeding & data
- Folder structure
- Deployment
- Troubleshooting

---

## Project overview

Ayodhya Estate is a converted design-to-code project implementing the Panchi Vihar real-estate site as a React frontend with an Express + MongoDB backend. The app provides a public homepage with a dynamic gallery and an admin panel to upload/manage images (Cloudinary) and view inquiries.

See the full project overview: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

## Features

- Responsive React frontend with exact color & font choices
- Dynamic gallery backed by Cloudinary + MongoDB
- Password-protected admin panel for uploads and management
- Inquiry form that saves to MongoDB and can send email notifications
- Seed script to populate initial project data

## Tech stack

- Frontend: React 18 (Create React App), React Router, Axios
- Backend: Node.js, Express, Mongoose (MongoDB)
- Storage: Cloudinary for images
- Email: Nodemailer (Gmail) / configurable providers

---

## Quick start (development)

Prerequisites:
- Node.js v16+ installed
- MongoDB (local) or MongoDB Atlas
- Cloudinary account (cloud name, api key, api secret)

Install all dependencies (root installs both client and server):

```bash
npm run install-all
```

Create environment file for the server. Copy the example then edit credentials:

```bash
cd server
copy .env.example .env
# (edit server/.env with your values)
```

Start both dev servers from the project root:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

To run frontend only:

```bash
npm run client
```

To run server only (nodemon recommended):

```bash
npm run server
```

To build the frontend for production:

```bash
npm run build
```

---

## Environment variables

Create `server/.env` with at least the following keys (see `server/.env.example`):

```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_PASSWORD=your_admin_password
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_TO=destination_for_inquiries
```

- `MONGODB_URI` — MongoDB connection string (local or Atlas)
- `ADMIN_PASSWORD` — password used to access the admin panel (change in production)
- Cloudinary keys are required for image uploads; see [server/config/cloudinary.js](server/config/cloudinary.js)

---

## Seeding & initial data

A seed script is provided to populate example project data (projects collection):

```bash
node server/seed.js
```

The seed script uses `server/.env` to connect to MongoDB. It inserts a `Panchi Vihar` project and related connectivity data.

---

## Folder structure (high-level)

```
.
├─ client/             # React app (public, src, package.json)
├─ server/             # Express app (routes, models, config)
├─ database/           # migrations (if used)
├─ package.json        # root scripts (dev, install-all, build)
```

Key files:
- Frontend entry: [src/index.js](src/index.js)
- Server entry: [server/server.js](server/server.js)
- DB config: [server/config/db.js](server/config/db.js)
- Cloudinary config: [server/config/cloudinary.js](server/config/cloudinary.js)
- Seed script: [server/seed.js](server/seed.js)

---

## Admin panel

- Visit `/admin` on the frontend (e.g., http://localhost:3000/admin)
- Authenticate using the `ADMIN_PASSWORD` in `server/.env`
- Admin features: upload images (to Cloudinary), set status labels, delete images, view inquiries

---

## API (summary)

Gallery:
- `GET /api/gallery` — list public images
- `POST /api/gallery/upload` — upload (admin)
- `DELETE /api/gallery/:id` — delete (admin)

Inquiry:
- `POST /api/inquiry` — submit lead
- `GET /api/inquiry` — list inquiries (admin)

Admin:
- `POST /api/admin/login` — authenticate with password

Refer to `API_DOCS.md` (if present) for full details.

---

## Deployment

See the deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)

Recommended production workflow:
- Host frontend on Vercel or Netlify
- Host backend on Render, Heroku, or similar
- Use MongoDB Atlas for production DB
- Use Cloudinary for image hosting

---

## Troubleshooting (common issues)

- MongoDB connection error: verify `MONGODB_URI` and that Atlas IP whitelist or local mongod is running
- Cloudinary upload fails: verify cloud name/api key/api secret in `server/.env`
- Email not sending: enable 2FA and generate an app password for Gmail, or switch to SendGrid
- Ports in use: ensure ports 3000 (client) and 5000 (server) are free or change in env

---

## Contributing & next steps

- Update `client/public/assets/hero/` with your hero images and adjust `Hero.css` background
- Change hardcoded connectivity times in `client/src/components/Highlights.jsx` if required
- Add tests or CI as a follow-up

If you want, I can:
- run the app locally to verify startup
- commit the README update
- add a small CONTRIBUTING.md

---

Files referenced: [SETUP.md](SETUP.md) • [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) • [DEPLOYMENT.md](DEPLOYMENT.md)

Jai Shri Ram 🙏
