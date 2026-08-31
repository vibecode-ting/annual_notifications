# Milestone - Employee Notifications & Dashboard

Milestone is a full-stack, serverless web application designed to help teams track, manage, and celebrate employee milestones (like birthdays and work anniversaries). 

## Features
- **Dashboard & Analytics:** Gain insights into your headcount by department and track upcoming milestones via intuitive charts and metrics.
- **Role-Based Access Control (RBAC):** Distinct roles (`user`, `pro`, `pro_plus`, `admin`) that enforce scalable limits on employee counts.
- **Bulk Employee Management:** Import employees via Excel templates or manage them individually.
- **Customizable Alerts:** Flexible notification structures designed to keep the team engaged.
- **Internationalization (i18n):** Seamlessly switch between English, Burmese, Traditional Chinese, and Vietnamese.

## Tech Stack
- **Frontend Framework:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, custom glassmorphism UI, Lucide icons
- **Charts:** Recharts (Metabase/Grafana-style analytics)
- **Database & Auth:** Firebase (Firestore and Authentication)
- **Deployment:** GitHub Pages & GitHub Actions

## Setup & Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   VITE_FIRESTORE_DB_ID="your-db-id"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## GitHub Pages Deployment

This project is configured to automatically build and deploy to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`). 

### Handling the 404 Error (SPA Routing Fix)
Since this is a Single Page Application (SPA) utilizing `react-router-dom`, standard GitHub pages behavior results in a 404 error when refreshing or directly navigating to sub-routes (like `/employees`). 

**How we fixed it:** 
Our GitHub Actions workflow automatically copies `dist/index.html` to `dist/404.html` during the build step. When GitHub Pages can't find a route, it falls back to serving `404.html`, which hands control back to React Router to properly load the requested view.

### Crucial Note on Environment Variables (Firebase Keys)
Since `.env` files are ignored by git (for security), your GitHub Actions workflow will not have access to your Firebase API keys by default. 

If your deployed app is failing to load database content, you must inject your `.env` secrets into GitHub Actions:
1. Go to your repository **Settings** > **Secrets and variables** > **Actions**.
2. Add your Firebase keys as Repository Secrets.
3. Update `.github/workflows/deploy.yml` to pass those secrets into the build environment:
   ```yaml
   - name: Build (capture output)
     env:
       NODE_ENV: production
       VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
       # ... add the rest of your secrets here
     run: |
       npm run build
       cp dist/index.html dist/404.html
   ```
