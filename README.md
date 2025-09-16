# Prison Management System - Next.js

A comprehensive digital solution for prison administration and management, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Modules
- **Dashboard** - Real-time statistics, charts, and system overview
- **Inmates Management** - Complete inmate records, profiles, and tracking
- **Staff Management** - Employee directory, schedules, and information
- **Visitor Management** - Registration, approvals, and visit scheduling
- **Medical Records** - Health tracking, treatments, and appointments
- **Security Incidents** - Incident reporting and investigation tracking
- **Resources Management** - Inventory and resource allocation
- **Reports** - Analytics and compliance reporting

### Technical Features
- **Role-Based Authentication** - Secure login with different permission levels
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Data** - Live updates and interactive dashboards
- **Modern UI** - Clean, professional interface with Tailwind CSS
- **Type Safety** - Full TypeScript implementation for reliability

## 🛠 Tech Stack

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API
- **Date Handling**: date-fns

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🔐 Demo Accounts

The system includes pre-configured demo accounts for testing:

| Username | Password | Role | Access Level |
|----------|----------|------|--------------|
| admin | admin123 | Administrator | Full system access |
| warden | warden123 | Warden | Management operations |
| officer1 | officer123 | Security Officer | Operational access |
| medical1 | medical123 | Medical Staff | Medical records access |

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Dashboard page
│   ├── inmates/                 # Inmate management
│   ├── staff/                   # Staff management
│   ├── visitors/                # Visitor management
│   ├── medical/                 # Medical records
│   ├── login/                   # Authentication
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page redirect
├── components/                   # Reusable components
│   ├── Header.tsx               # Application header
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── MainLayout.tsx           # Main layout wrapper
│   └── ProtectedRoute.tsx       # Route protection
└── contexts/                     # React contexts
    ├── AuthContext.tsx          # Authentication state
    └── DataContext.tsx          # Application data
```

## 🔧 Key Features Implemented

### Authentication System
- Secure login/logout functionality
- Role-based access control
- Protected routes and permissions
- Persistent sessions with localStorage

### Data Management
- Comprehensive CRUD operations for all entities
- Search and filtering capabilities
- Real-time dashboard statistics
- Mock data for development and testing

### User Interface
- Responsive design with Tailwind CSS
- Interactive charts and visualizations
- Modern, clean interface design
- Mobile-first approach

### Navigation
- File-based routing with Next.js App Router
- Role-based menu visibility
- Breadcrumb navigation
- Quick action buttons

## 🎯 Migration from React

This project was successfully migrated from a traditional React application to Next.js with the following improvements:

- **Better Performance**: Optimized with Next.js App Router
- **Type Safety**: Full TypeScript implementation
- **Modern Styling**: Tailwind CSS for responsive design
- **File-based Routing**: Simplified navigation structure
- **Production Ready**: Optimized build process

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📊 System Objectives

✅ **Centralized Digital Management** - Secure, unified platform for all prison operations  
✅ **Process Automation** - Reduced manual paperwork and streamlined workflows  
✅ **Improved Coordination** - Enhanced communication between departments  
✅ **Resource Planning** - Efficient allocation and tracking of resources  
✅ **Real-time Reporting** - Accurate, up-to-date operational insights  

## 🔒 Security Features

- Role-based authentication and authorization
- Protected routes and API endpoints
- Secure session management
- Data validation and sanitization

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🆘 Support

For technical support or questions about the Prison Management System, please refer to the documentation or contact the development team.

---

**Prison Management System** - A modern, secure, and comprehensive solution for correctional facility management.
