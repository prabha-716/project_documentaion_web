# Deployment Guide — Project Management App

Deploy your app for **free** using **Neon** (DB) + **Render** (backend) + **Vercel** (frontend).

---

## Step 1: Set Up PostgreSQL on Neon

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project → note down:
   - **Host** (e.g. `ep-cool-name-123456.us-east-2.aws.neon.tech`)
   - **Database name** (e.g. `neondb`)
   - **Username** (e.g. `neondb_owner`)
   - **Password**
3. Your connection URL will be:
   ```
   jdbc:postgresql://<host>/<database>?sslmode=require
   ```

---

## Step 2: Push Code to GitHub

Make sure your full project (both `backend/` and `frontend/` folders) is pushed to a GitHub repository.

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

---

## Step 3: Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `project-management-api` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Java` |
   | **Build Command** | `./mvnw clean package -DskipTests` |
   | **Start Command** | `java -jar target/project-management-backend-1.0.0.jar` |

4. Add **Environment Variables**:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `jdbc:postgresql://<neon-host>/<db-name>?sslmode=require` |
   | `DATABASE_USERNAME` | Your Neon username |
   | `DATABASE_PASSWORD` | Your Neon password |
   | `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret |
   | `JWT_SECRET` | A strong random string (32+ chars) |
   | `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` (set after Vercel deploy) |
   | `LOG_LEVEL` | `INFO` |

5. Click **Create Web Service** → wait for the build to finish
6. Note your backend URL (e.g. `https://project-management-api.onrender.com`)

---

## Step 4: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Configure:

   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `frontend` |
   | **Framework Preset** | `Next.js` (auto-detected) |

4. Add **Environment Variables**:

   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://project-management-api.onrender.com` |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Your Google OAuth client ID |

5. Click **Deploy**
6. Note your frontend URL (e.g. `https://your-app.vercel.app`)

---

## Step 5: Update CORS & OAuth

### Update Render (backend)
Go back to Render → Environment → set:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Update Google Cloud Console
Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Credentials → your OAuth 2.0 Client:

| Setting | Add |
|---------|-----|
| **Authorized JavaScript origins** | `https://your-app.vercel.app` |
| **Authorized redirect URIs** | `https://project-management-api.onrender.com/login/oauth2/code/google` |

---

## Summary of Environment Variables

### Backend (Render)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL JDBC URL |
| `DATABASE_USERNAME` | DB username |
| `DATABASE_PASSWORD` | DB password |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `JWT_SECRET` | Random string for JWT signing |
| `CORS_ALLOWED_ORIGINS` | Frontend Vercel URL |
| `LOG_LEVEL` | `INFO` for production |

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend Render URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |

---

## Troubleshooting

- **CORS errors?** → Make sure `CORS_ALLOWED_ORIGINS` exactly matches your Vercel URL (no trailing slash)
- **OAuth redirect fails?** → Check Google Console redirect URIs match your Render backend URL
- **DB connection fails?** → Ensure `?sslmode=require` is in the DATABASE_URL for Neon
- **Build fails on Render?** → Check that `./mvnw` has execute permissions (`git update-index --chmod=+x mvnw`)
