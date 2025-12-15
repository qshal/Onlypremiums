# OnlyPremiums - Premium Software Reseller Platform

A production-ready React application for selling premium software subscriptions at wholesale prices. Built with cutting-edge technologies and requires Supabase database configuration.

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure login/registration with Supabase Auth
- **Product Catalog** - Dynamic product and pricing management
- **Shopping Cart** - Real-time cart with persistent storage
- **Order Management** - Complete order lifecycle tracking
- **Admin Dashboard** - Comprehensive business management tools
- **Payment Integration** - Razorpay payment gateway support

### Modern UI/UX
- **Glassmorphism Design** - Modern glass-effect UI with professional aesthetics
- **Responsive Layout** - Mobile-first design that works on all devices
- **Dark Theme** - Professional dark theme with subtle gradients
- **Smooth Animations** - Framer Motion powered transitions
- **Accessibility** - WCAG compliant with proper ARIA labels

## 🛠 Tech Stack

### Frontend
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **React Router v6** - Modern routing solution

### Backend & Services
- **Supabase** - PostgreSQL database, authentication, and real-time subscriptions
- **Razorpay** - Payment processing
- **Vercel/Netlify** - Deployment platforms

### UI Components & Libraries
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation
- **Framer Motion** - Production-ready motion library

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (required)

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd onlypremiums-main
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
3. **Configure Supabase** (Optional)
   ```bash
   # Add to .env.local
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database setup** (If using Supabase)
   ```bash
   # Run the SQL scripts in supabase/migrations/
   # Or use the provided COMPLETE_WORKFLOW_SETUP.sql
   ```

5. **Start development**
   ```bash
   npm run dev
   ```

## 🎯 Demo Credentials

Test the application with these demo accounts:

- **Regular User**: `user@demo.com` / `password`
- **Admin User**: `admin@demo.com` / `password`

## 📁 Project Structure

```
onlypremiums-main/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Radix UI)
│   │   └── layout/         # Layout components
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── OrderContext.tsx
│   │   ├── ProductContext.tsx
│   │   └── AdminContext.tsx
│   ├── lib/               # Utilities and configurations
│   │   ├── supabase.ts
│   │   ├── payments.ts
│   │   └── utils.ts
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   ├── PlansPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   └── FunctionalAdminPage.tsx
│   ├── types/             # TypeScript definitions
│   └── index.css          # Global styles with glassmorphism
├── supabase/              # Database migrations
├── public/                # Static assets
├── .env.example           # Environment template
├── vercel.json           # Vercel deployment config
├── netlify.toml          # Netlify deployment config
└── package.json          # Dependencies and scripts
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository**
   ```bash
   # Push to GitHub/GitLab
   git push origin main
   ```

2. **Deploy on Vercel**
   - Import project from GitHub
   - Add environment variables
   - Deploy automatically

3. **Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Netlify

1. **Build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**
   - Add the same Supabase variables

### Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains the built application
# Upload to any static hosting service
```

## 🔧 Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run types:supabase` - Generate TypeScript types from Supabase

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to customize the glassmorphism theme:

```css
/* Modern Glass Base */
.glass-neuro {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(148, 163, 184, 0.25);
}
```

### Product Configuration
Update products in `src/contexts/ProductContext.tsx`:

```typescript
const defaultProducts = {
  canva: {
    name: 'Canva Pro',
    icon: '🎨',
    color: 'bg-gradient-to-br from-pink-500 to-rose-500'
  }
};
```

## 🔒 Security Features

- **Environment Variables** - Sensitive data stored securely
- **Input Validation** - Zod schema validation on all forms
- **XSS Protection** - Content Security Policy headers
- **Authentication** - Supabase Auth with JWT tokens
- **HTTPS Only** - Secure connections enforced

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Bundle Size**: Optimized with Vite tree-shaking
- **Loading Speed** - Sub-second initial load
- **SEO Ready** - Meta tags and semantic HTML

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the demo credentials for testing

---

**Built with ❤️ using modern web technologies**