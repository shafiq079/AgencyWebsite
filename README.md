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

For support, email shafiqsheeeqi079.com or create an issue in this repository.

## 🔗 Links
- [My Portfolio](https://shafiq-webdev.vercel.app/)
- [Live Demo](https://your-demo-link.com)

# Enhanced Project Showcase System

A full-stack Next.js + TypeScript project with an enhanced admin panel for creating and managing professional project portfolios.

## ✨ New Features

### 🏗️ Section Builder System
The project now includes a powerful section builder that allows developers to create dynamic, structured project showcases:

#### Section Types Available:
- **Overview**: Full-width paragraph content for project descriptions
- **Features**: Bullet list or grid layout for highlighting key features
- **Gallery**: Image grid with lightbox functionality for project visuals
- **Testimonial**: Quote blocks with author information
- **Custom**: Markdown or rich content rendering for flexible layouts

#### Admin Panel Features:
- **Dynamic Section Management**: Add, edit, delete, and reorder sections
- **Live Preview**: Preview how sections will appear before publishing
- **Rich Content Support**: Support for markdown-like formatting in custom sections
- **Image Management**: Upload and manage images for gallery sections
- **Drag & Drop Reordering**: Easy section reordering with up/down buttons

#### Public Display:
- **Responsive Layouts**: Each section type has its own optimized layout
- **Smooth Animations**: Framer Motion animations for engaging user experience
- **Lightbox Gallery**: Interactive image viewing for gallery sections
- **Developer Contact Info**: Clear display of developer information with mailto links

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd project
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Environment Setup**
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Start the development servers**
```bash
# Backend
cd backend
npm run dev

# Frontend (in new terminal)
cd frontend
npm run dev
```

## 📁 Project Structure

```
project/
├── backend/
│   ├── models/
│   │   └── Project.js          # Updated with sections schema
│   ├── routes/
│   │   └── projects.js         # Updated to handle sections
│   └── server.js
├── frontend/
│   ├── app/
│   │   ├── admin/projects/
│   │   │   ├── new/page.tsx    # Enhanced with section builder
│   │   │   └── edit/[id]/page.tsx
│   │   └── work/[slug]/page.tsx # Enhanced with section display
│   ├── components/
│   │   └── projects/
│   │       ├── SectionBuilder.tsx      # Admin section management
│   │       ├── SectionPreview.tsx      # Live preview modal
│   │       └── sections/
│   │           ├── SectionRenderer.tsx # Dynamic section rendering
│   │           ├── OverviewSection.tsx
│   │           ├── FeaturesSection.tsx
│   │           ├── GallerySection.tsx
│   │           ├── TestimonialSection.tsx
│   │           └── CustomSection.tsx
│   └── types/
│       └── project.ts          # Updated with Section interface
```

## 🎯 Usage

### Creating a Project with Sections

1. **Navigate to Admin Panel**
   - Go to `/admin/projects/new`
   - Fill in basic project information

2. **Add Sections**
   - Scroll to the "Project Sections" area
   - Click "Add Section"
   - Choose section type and fill in content
   - Use "Preview" button to see how it will look

3. **Manage Sections**
   - Reorder sections using ↑/↓ buttons
   - Edit sections by clicking the ✏️ button
   - Delete sections with the 🗑️ button

4. **Publish Project**
   - Set status to "Published"
   - Click "Create Project"

### Section Types Guide

#### Overview Section
Perfect for project descriptions and context:
```
Type: Overview
Title: Project Overview
Content: This project was developed for a leading tech company...
```

#### Features Section
Great for highlighting key features (use bullet points):
```
Type: Features
Title: Key Features
Content: • Responsive design
• Real-time updates
• User authentication
• API integration
```

#### Gallery Section
Showcase project visuals:
```
Type: Gallery
Title: Project Screenshots
Content: Browse through the project interface
[Upload images through the admin panel]
```

#### Testimonial Section
Display client feedback:
```
Type: Testimonial
Title: Client Feedback
Content: "This project exceeded our expectations and delivered exactly what we needed."
```

#### Custom Section
Flexible content with markdown support:
```
Type: Custom
Title: Technical Details
Content: ## Architecture
**Frontend**: React with TypeScript
**Backend**: Node.js with Express
**Database**: MongoDB

[[GitHub Repository|https://github.com/user/project]]
```

## 🔧 Technical Details

### Database Schema
The Project model now includes a sections array:
```javascript
sections: [{
  type: String,        // 'overview', 'features', 'gallery', 'testimonial', 'custom'
  title: String,       // Section title
  content: String,     // Section content
  images: [{           // Optional images for gallery sections
    url: String,
    alt: String,
    caption: String
  }],
  order: Number        // Display order
}]
```

### API Endpoints
- `POST /api/projects` - Create project with sections
- `PUT /api/projects/:id` - Update project with sections
- `GET /api/projects/:slug` - Get project with sections for display

### Component Architecture
- **SectionBuilder**: Admin interface for managing sections
- **SectionRenderer**: Public display component that renders sections based on type
- **Section Components**: Individual components for each section type
- **SectionPreview**: Modal preview for admin panel

## 🎨 Customization

### Adding New Section Types
1. Add new type to the Section interface in `types/project.ts`
2. Create a new component in `components/projects/sections/`
3. Update the SectionRenderer to handle the new type
4. Add the type to the sectionTypes array in SectionBuilder

### Styling
All components use Tailwind CSS with custom color variables:
- `--navy`: #1a365d
- `--copper`: #b87333
- `--soft-white`: #f8fafc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.


---

