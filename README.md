# Ayodhya Estate - Panchi Vihar

A divine real estate platform for Ayodhya Estate featuring Panchi Vihar plots.

## 🕉️ Features

- **Exact Design Preservation**: Maintains original Saffron (#FF9933), Gold (#FFD700), and Royal White color scheme
- **Google Fonts**: Playfair Display for headings, Poppins for body text
- **Dynamic Gallery**: Admin-uploaded images via Cloudinary
- **Admin Panel**: Protected route for managing property images
- **Inquiry Form**: Integrated contact form for lead collection
- **Responsive Design**: Mobile-friendly masonry gallery

## 📁 Project Structure

```
Ayodhya Estate/
├── client/              # React frontend
│   ├── public/
│   │   └── assets/      # Place your local images here
│   │       ├── hero/    # Lord Ram banner etc.
│   │       └── site/    # Site photos
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Homepage & Admin panel
│   │   ├── styles/      # CSS modules
│   │   └── utils/       # API calls
│   └── package.json
├── server/              # Express backend
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── config/          # Cloudinary config
│   └── server.js
└── package.json
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment Variables

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSWORD=your_admin_password
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### 3. Add Your Images
Place your local images in:
- `client/public/assets/hero/` - Lord Ram banner, hero backgrounds
- `client/public/assets/site/` - Site photos, development images

### 4. Run the Application
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔐 Admin Access

Navigate to `/admin` and enter your admin password (set in `.env`)

### Admin Features:
- Upload images to Cloudinary
- Add status labels (e.g., "New Plot", "Saryu Facing", "Sold Out")
- Add plot descriptions
- Manage gallery dynamically

## 📊 Key Design Elements (Preserved)

### Connectivity Times (Hardcoded):
- ✈️ Ayodhya Airport: **15 Mins**
- 🕌 Ram Mandir: **30 Mins**
- 💧 Saryu Ghat: **35 Mins**
- 🛕 Kanak Bhawan: **32 Mins**
- 🙏 Hanuman Garhi: **30 Mins**

### Color Scheme:
- Saffron: `#FF9933`
- Gold: `#FFD700`
- Royal White: `#fffefc`

## 📧 Inquiry Form

The inquiry form sends leads to your configured email. Make sure to:
1. Enable 2-factor authentication on Gmail
2. Generate an app-specific password
3. Add credentials to `server/.env`

## 🎨 Customization

Replace placeholder images by updating paths in:
- `client/public/assets/` folder
- Component imports in `src/components/Hero.jsx`

## 📝 Notes

- No pricing is displayed (as per spiritual offering approach)
- Gallery is fully dynamic from admin uploads
- All fonts and colors match original design exactly
- Mobile-responsive masonry layout preserved
