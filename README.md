# Premium Creative Agency Website

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg)

A sophisticated, full-stack web application designed for creative agencies and digital studios. Built with modern technologies and inspired by high-end design principles, this project delivers a premium user experience with comprehensive content management capabilities.

## 🌟 Features

### Frontend
- ✨ **Premium Design**: Minimalist, luxury-inspired UI with smooth animations
- 📱 **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- 🎭 **Interactive Animations**: Parallax effects, scroll-triggered reveals, and microinteractions
- 🔍 **SEO Optimized**: Dynamic meta tags, structured data, and performance optimization
- 🎨 **Modern Typography**: Editorial fonts with generous spacing and hierarchy

### Backend
- 🔐 **Admin Panel**: Secure authentication and project management
- 🚀 **RESTful API**: Clean, scalable backend architecture
- 📁 **File Upload**: Image gallery management with multiple file support
- 🔑 **Authentication**: JWT-based secure user authentication
- 🗄️ **Database Management**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

| Frontend | Backend | Database | Tools |
|----------|---------|----------|-------|
| Next.js 14+ | Express.js | MongoDB | TypeScript |
| Tailwind CSS | Node.js | Mongoose | Framer Motion |
| React | JWT Auth | - | Lucide Icons |

### Frontend Technologies
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **SEO**: Next.js built-in optimization

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: CORS, Helmet, bcryptjs

## 📁 Project Structure

```
premium-agency-website/
├── 📁 frontend/                 # Next.js frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable UI components
│   │   ├── 📁 pages/          # Next.js pages
│   │   ├── 📁 styles/         # Global styles and Tailwind config
│   │   ├── 📁 utils/          # Utility functions
│   │   └── 📁 types/          # TypeScript type definitions
│   ├── 📁 public/             # Static assets
│   └── 📄 package.json
├── 📁 backend/                 # Express.js backend application
│   ├── 📁 src/
│   │   ├── 📁 controllers/    # Request handlers
│   │   ├── 📁 models/         # Mongoose models
│   │   ├── 📁 routes/         # API routes
│   │   ├── 📁 middleware/     # Custom middleware
│   │   └── 📁 utils/          # Backend utilities
│   ├── 📁 uploads/            # File upload directory
│   └── 📄 package.json
├── 📄 .env.example            # Environment variables template
└── 📄 README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm/yarn
- **MongoDB** (local or cloud instance)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shafiq079/AgencyWebsite.git
   cd AgencyWebsite
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **Admin Panel**: http://localhost:3000/admin

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/premium-agency
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📖 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/login` | Admin login | ❌ |
| `POST` | `/api/auth/register` | Register new admin | ✅ |

### Project Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/projects` | Get all projects | ❌ |
| `GET` | `/api/projects/:id` | Get single project | ❌ |
| `POST` | `/api/projects` | Create new project | ✅ |
| `PUT` | `/api/projects/:id` | Update project | ✅ |
| `DELETE` | `/api/projects/:id` | Delete project | ✅ |

## 🎨 Design Philosophy

This website follows design-first principles inspired by luxury brands and high-end creative agencies:

- **Minimalism**: Clean layouts with generous white space
- **Typography**: Editorial fonts with careful hierarchy  
- **Animations**: Subtle, purposeful motion design
- **Color Palette**: Elegant combination of dark navy, soft whites, and accent colors
- **Visual Storytelling**: Large, impactful imagery with overlays

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Request rate limiting
- ✅ Input validation and sanitization
- ✅ Secure file upload handling

## 📱 Responsive Design

- 📱 Mobile-first approach
- 💻 Optimized for all screen sizes
- 👆 Touch-friendly interactions
- ⚡ Performance optimized for mobile networks

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy to Railway, Heroku, or your preferred platform
```

### Environment Setup for Production
1. Set up MongoDB Atlas or your preferred database
2. Configure environment variables in your hosting platform
3. Update CORS settings for production domains
4. Set up file upload storage (AWS S3, Cloudinary, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from [Mont-Fort](https://mont-fort.com)
- Icons from [Lucide React](https://lucide.dev)
- Typography from Google Fonts
- Color palette inspired by luxury design systems

## 📞 Support

For support, email support@yourcompany.com or create an issue in this repository.

## 🔗 Links

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Live Demo](https://your-demo-link.com)
- [API Documentation](https://your-api-docs-link.com)

---

**Built with ❤️ for creative agencies and digital studios**
