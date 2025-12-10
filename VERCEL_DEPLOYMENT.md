# Vercel Deployment Guide - Admin Dashboard

## Issue Fixed: Login Network Error

### Problem
When deployed to Vercel, the admin login showed "Network error. Please check your connection" because the environment variable `NEXT_PUBLIC_API_BASE_URL` was not configured.

### Solution

#### 1. Configure Environment Variables in Vercel

Go to your Vercel project dashboard:

1. Navigate to: **Settings** → **Environment Variables**
2. Add the following variable:

```
Name: NEXT_PUBLIC_API_BASE_URL
Value: https://cosmo-backend-atuu.onrender.com
```

3. Select which environments to apply it to:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click **Save**

#### 2. Redeploy Your Application

After adding the environment variable, you need to trigger a new deployment:

**Option A: Via Dashboard**
- Go to **Deployments** tab
- Click **...** (three dots) on the latest deployment
- Select **Redeploy**

**Option B: Via Git Push**
```bash
git add .
git commit -m "Configure environment variables"
git push
```

#### 3. Verify the Fix

After deployment completes:

1. Open your admin dashboard: https://pintch-app-admin.vercel.app
2. Try logging in with admin credentials
3. Check browser console (F12) for API logs:
   ```
   [API] Using base URL: https://cosmo-backend-atuu.onrender.com
   [API] POST /v2/auth/admin/login
   ```

---

## Environment Variables Reference

### Production (.env)
```env
NEXT_PUBLIC_API_BASE_URL=https://cosmo-backend-atuu.onrender.com
NEXT_PUBLIC_APP_NAME=Phintch Admin
NEXT_PUBLIC_APP_URL=https://pintch-app-admin.vercel.app
```

### Local Development (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
NEXT_PUBLIC_APP_NAME=Phintch Admin
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Troubleshooting

### Still Getting Network Errors?

1. **Check Backend Status**
   - Visit: https://cosmo-backend-atuu.onrender.com
   - Should return: `{"message": "Cosmic Backend API v2"}`

2. **Verify Environment Variable**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Confirm `NEXT_PUBLIC_API_BASE_URL` is set correctly
   - Make sure it's applied to Production environment

3. **Check Browser Console**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for: `[API] Using base URL: ...`
   - Should show production backend URL, not localhost

4. **CORS Issues**
   - Backend must allow requests from Vercel domain
   - Check backend CORS configuration

### Backend URL Changed?

If your backend URL changes:

1. Update in Vercel: Settings → Environment Variables → Edit `NEXT_PUBLIC_API_BASE_URL`
2. Update local `.env` file
3. Redeploy

---

## Security Note

- ✅ `.env` files are in `.gitignore` (not committed to Git)
- ✅ Environment variables in Vercel are encrypted
- ✅ Use different values for development and production
- ✅ Never expose sensitive API keys in frontend environment variables (they're visible to clients)

---

## Quick Reference

**Admin Login Endpoint:** `POST /v2/auth/admin/login`
**Creator Login Endpoint:** `POST /v2/auth/creator/login`

**Expected Request:**
```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

**Expected Response:**
```json
{
  "admin": { ... },
  "token": "jwt_token_here"
}
```

---

## Changes Made

### Files Updated:

1. **admin/src/lib/constants.ts**
   - Fixed fallback port: `5000` → `5001`
   - Improved console logging for API base URL

2. **admin/.env**
   - Updated app name: "Cosmic" → "Phintch"
   - Confirmed production backend URL

3. **admin/package.json**
   - Updated Next.js: `16.0.6` → `16.0.7` (security fix CVE-2025-66478)
   - Updated `eslint-config-next` to match

### Why This Fixed the Issue

The error "Network error. Please check your connection" appeared because:

1. ❌ Vercel had no `NEXT_PUBLIC_API_BASE_URL` environment variable
2. ❌ Code fell back to `http://localhost:5001`
3. ❌ Browser tried to connect to localhost (doesn't exist in production)
4. ❌ Request failed with network error

After fix:
1. ✅ Vercel has `NEXT_PUBLIC_API_BASE_URL` set
2. ✅ Code uses production backend URL
3. ✅ Browser connects to correct backend
4. ✅ Login works correctly

---

**Last Updated:** December 10, 2025
**Status:** ✅ Fixed and Ready for Production
