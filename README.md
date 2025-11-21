## KindLink

Community-driven platform that connects NGOs, animal shelters, and local donors in real time. Built with Next.js App Router, MongoDB, NextAuth, and TailwindCSS.

### Features
- **Landing Page**: Beautiful hero section with mission statement and example posts
- **Authentication**: Full user registration and login with NextAuth (credentials-based)
- **Community Feed**: Real-time feed of posts from NGOs and shelters
- **Create Posts**: Protected route for authenticated users to post needs
- **MongoDB Integration**: All data persisted in MongoDB with Mongoose
- **Responsive Design**: Mobile-first design with brand color palette

### Tech Stack
- Next.js 15 (App Router) + React 19
- TypeScript + TailwindCSS (v4)
- MongoDB + Mongoose
- NextAuth v5 (Auth.js) for authentication
- Zod for request validation
- bcryptjs for password hashing

### Prerequisites
1. Node.js 18+ and npm
2. MongoDB connection string (Atlas recommended)
3. `AUTH_SECRET` value for NextAuth (generate with `openssl rand -base64 32` or use [this generator](https://generate-secret.vercel.app/32))

### Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` in the project root with:
   ```bash
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster-url/dbname
   AUTH_SECRET=your_generated_secret
   NEXTAUTH_URL=http://localhost:3000
   ```
   **Note**: Generate `AUTH_SECRET` using:
   ```bash
   openssl rand -base64 32
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Visit http://localhost:3000

### Deployment to Vercel (Recommended)

#### Option 1: Deploy via Vercel Dashboard
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repository
4. Add environment variables in the Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `AUTH_SECRET`: Generated secret (use `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
5. Click "Deploy" - Vercel will automatically build and deploy

#### Option 2: Deploy via Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Run deployment:
   ```bash
   vercel
   ```
3. Follow prompts to link your project
4. Set environment variables when prompted or via dashboard

#### Pre-Deployment Checklist
- [ ] Test production build locally: `npm run build && npm start`
- [ ] Verify all environment variables are set in Vercel
- [ ] Ensure MongoDB Atlas allows connections from Vercel IPs (or use 0.0.0.0/0 for development)
- [ ] Test registration and login flows
- [ ] Verify posts appear in the feed after creation

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `AUTH_SECRET` | Secret for NextAuth session encryption | Yes | Generated 32+ char string |
| `NEXTAUTH_URL` | Your app's URL (production only) | Production | `https://kindlink.vercel.app` |

### MongoDB Setup (Atlas)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist IP addresses:
   - For local: Add your current IP
   - For Vercel: Add `0.0.0.0/0` (allows all IPs) or use Vercel's IP ranges
5. Get connection string and replace `<password>` with your user password

### Production Build
Test your production build locally before deploying:
```bash
npm run build
npm start
```
Visit http://localhost:3000 and test all features.

### Troubleshooting

**Build fails:**
- Ensure all environment variables are set
- Check MongoDB connection string format
- Verify Node.js version (18+)

**Authentication not working:**
- Verify `AUTH_SECRET` is set and consistent
- Check `NEXTAUTH_URL` matches your production domain
- Ensure MongoDB connection is working

**Posts not appearing:**
- Check MongoDB connection
- Verify posts are being saved (check MongoDB Atlas dashboard)
- Check browser console for errors

### Roadmap
- [x] Authentication system with NextAuth
- [x] MongoDB integration for posts and users
- [ ] Role-based access for NGOs vs donors
- [ ] File uploads for post images
- [ ] Real-time updates (WebSockets or Server-Sent Events)
- [ ] Email notifications
- [ ] Search and filtering
- [ ] User profiles and dashboards
