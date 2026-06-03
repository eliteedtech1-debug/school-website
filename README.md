# 🏫 School Management System

A complete school management system with integrated public website and admin dashboard. Built with React, Node.js, and MySQL.

## ✨ Features

### 🌐 Public Website
- **Home Page** - School overview and highlights
- **About Us** - School information, mission, vision
- **Gallery** - Photos and videos showcase
- **Apply** - Online application form
- **Results** - Student results portal
- **Pricing** - Fee structure and payment plans
- **Contact** - Contact form and information

### 🔐 Admin Dashboard
- **Dashboard** - Statistics and overview
- **Applications** - Manage student applications
- **Gallery** - Upload and manage media
- **Staff** - Staff member management
- **Pricing** - Fee structure management
- **Content** - Website content management
- **Contact** - Handle contact messages
- **Settings** - User and system settings

### 👑 Super Admin Features
- **Multi-School Management** - Manage multiple schools
- **Theme Customization** - Customize school themes
- **School Duplication** - Clone schools with themes
- **System Monitoring** - Health and performance monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MySQL (v8.0+)
- npm or yarn

### Installation

1. **Clone and install dependencies**:
```bash
git clone <your-repo-url>
cd school-project
npm install --legacy-peer-deps
```

2. **Set up environment**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up backend**:
```bash
cd backend
npm install
cp .env.example .env
# Configure database settings in .env
```

4. **Start the application**:
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend (from root)
npm run dev
```

## 🌍 Access Points

- **Public Website**: `http://localhost:5173`
- **Admin Login**: `http://localhost:5173/admin/login`
- **API**: `http://localhost:5000/api`

### Demo Credentials
- **Email**: `admin@school.com`
- **Password**: `password123`

## 📁 Project Structure

```
school-project/
├── src/
│   ├── admin/                 # Admin dashboard
│   │   ├── components/        # Admin components
│   │   ├── contexts/          # Admin contexts
│   │   └── pages/             # Admin pages
│   ├── componetes/            # Public website components
│   └── App.jsx                # Main application
├── backend/                   # Backend API
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   └── server.js              # Express server
└── package.json               # Dependencies
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Navigation
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Sequelize** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads

## 🔧 Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd backend
npm start            # Start production server
npm run dev          # Start development server
npm run seed         # Seed database
```

### Environment Variables

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=School Management System

# Backend (backend/.env)
DB_HOST=localhost
DB_NAME=school_cms
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

## 🚀 Deployment

### Single Application Deployment

Since the admin dashboard is integrated into the main application:

1. **Build frontend**: `npm run build`
2. **Deploy backend**: Deploy to your hosting platform
3. **Configure environment**: Set production environment variables
4. **Database**: Set up production MySQL database

### Hosting Options
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, DigitalOcean, AWS, Railway
- **Database**: PlanetScale, AWS RDS, DigitalOcean Managed Database

## 📚 Documentation

- [Installation Guide](INSTALLATION.md) - Detailed setup instructions
- [API Documentation](backend/README.md) - Backend API reference
- [Database Schema](backend/models/README.md) - Database structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the [Installation Guide](INSTALLATION.md)
2. Review the troubleshooting section
3. Open an issue on GitHub

---

**Built with ❤️ for educational institutions**# schools_website
