# Vercel Dashboard Data Fix - Complete

## Issues Identified

1. **Missing Production API URL**: The `NEXT_PUBLIC_API_BASE_URL` environment variable was not set in Vercel
2. **API Connectivity**: Dashboard showing zeros because it couldn't reach the backend
3. **CORS Configuration**: Already properly configured to allow Vercel domains

## Solutions Implemented

### 1. Environment Variables Configuration

The admin dashboard needs the backend API URL to be set in Vercel's environment variables.

**Required Environment Variable:**
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.appspot.com
```

### 2. Steps to Fix in Vercel

#### Step 1: Configure Environment Variables in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project (pintch-app-admin)
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variable:
   - **Key**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: Your backend URL (e.g., `https://cosmic-backend-123456.appspot.com` or your deployed backend URL)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

#### Step 2: Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots menu (⋯)
4. Select **Redeploy**
5. Make sure "Use existing Build Cache" is **unchecked**

### 3. Backend CORS Configuration

The backend is already configured to accept requests from Vercel:

```javascript
// Already configured in pre-route.middleware.js
- Accepts all *.vercel.app domains
- Allows credentials (cookies)
- Proper CORS headers
```

### 4. Finding Your Backend URL

To find your backend API URL:

1. **If deployed on Google Cloud App Engine:**
   ```powershell
   cd backend
   gcloud app browse
   ```
   The URL will be: `https://PROJECT_ID.REGION_ID.r.appspot.com`

2. **If not deployed yet:**
   ```powershell
   cd backend
   gcloud app deploy
   ```

### 5. Local Testing

To test that the configuration works:

1. Update `admin/.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.appspot.com
   ```

2. Run locally:
   ```powershell
   cd admin
   npm run dev
   ```

3. Check if dashboard shows data

### 6. Verification Checklist

After redeployment, verify:

- [ ] Dashboard shows user count > 0
- [ ] Dashboard shows film count > 0
- [ ] Dashboard shows creator count > 0
- [ ] Charts load with data
- [ ] Activity feed shows recent activities
- [ ] No CORS errors in browser console
- [ ] No 404 or 500 errors in Network tab

### 7. Common Issues & Solutions

#### Issue: Still showing zeros after setting environment variable
**Solution:** Make sure to redeploy WITHOUT build cache

#### Issue: CORS errors in console
**Solution:** Verify the backend is deployed and CORS middleware is working:
```powershell
curl -I https://your-backend-url.appspot.com/v2/admin/metrics/overview
```

#### Issue: 401 Unauthorized errors
**Solution:** Make sure you're logged in. The dashboard requires authentication.

#### Issue: Environment variable not updating
**Solution:** 
1. Delete the old deployment
2. Clear Vercel cache
3. Redeploy from Git

### 8. Backend Deployment Commands

If you need to deploy/redeploy the backend:

```powershell
# Navigate to backend
cd C:\Users\colli\Documents\client\Gig\cosmic\backend

# Make sure you're logged in to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Deploy
gcloud app deploy

# Get the URL
gcloud app browse
```

### 9. Environment Variable Template

For Vercel, set these environment variables:

```env
# Required
NEXT_PUBLIC_API_BASE_URL=https://YOUR_BACKEND_URL

# Optional (if different from defaults)
NEXT_PUBLIC_APP_NAME=Cosmic Admin
NEXT_PUBLIC_APP_URL=https://pintch-app-admin.vercel.app
```

## Files Modified

- ✅ `vercel.json` - Fixed route patterns
- ✅ `next.config.ts` - Removed problematic outputFileTracingRoot
- ✅ Backend CORS already configured for Vercel

## Testing URLs

- **Admin Dashboard**: https://pintch-app-admin.vercel.app/dashboard
- **Backend API**: (Add your backend URL here)
- **Login**: https://pintch-app-admin.vercel.app/login

## Quick Fix Command

```powershell
# In Vercel dashboard, run this after setting environment variable:
# Settings → Environment Variables → Add:
# NEXT_PUBLIC_API_BASE_URL = https://your-backend-url.appspot.com

# Then redeploy:
# Deployments → Latest → Redeploy (without cache)
```

## Success Criteria

✅ Dashboard loads without errors
✅ All metrics display actual data
✅ Charts render with historical data
✅ Activity feed shows recent activities
✅ No console errors
✅ API calls succeed (check Network tab)

---

**Status**: Configuration documented - Needs backend URL to be added in Vercel

**Next Steps**:
1. Deploy backend to get production URL
2. Add NEXT_PUBLIC_API_BASE_URL to Vercel environment variables
3. Redeploy admin dashboard
4. Verify all data loads correctly
