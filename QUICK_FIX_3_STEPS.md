# Quick Start - Fix Dashboard Data in 3 Steps

## ⚡ The Problem
Dashboard at https://pintch-app-admin.vercel.app/dashboard shows all zeros.

## ⚡ The Solution
Add one environment variable to Vercel.

---

## 🎯 STEP 1: Get Your Backend URL

### Option A: If Backend is Already Deployed

Open PowerShell and run:
```powershell
cd C:\Users\colli\Documents\client\Gig\cosmic\backend
gcloud app describe
```

**Look for this line:**
```
defaultHostname: your-project-123456.uc.r.appspot.com
```

**Your full backend URL is:**
```
https://your-project-123456.uc.r.appspot.com
```

Copy this URL!

### Option B: If Backend Not Deployed Yet

Deploy it first:
```powershell
cd C:\Users\colli\Documents\client\Gig\cosmic\backend
gcloud app deploy
```

When deployment finishes, it will show your URL.

---

## 🎯 STEP 2: Add Environment Variable in Vercel

1. **Go to Vercel:** https://vercel.com/dashboard

2. **Click your project** in the list (pintch-app-admin or similar)

3. **Click "Settings"** tab at the top

4. **Click "Environment Variables"** in the left sidebar

5. **Click "Add New"** button

6. **Fill in the form:**
   ```
   Name:  NEXT_PUBLIC_API_BASE_URL
   Value: https://your-backend-url.appspot.com
   ```
   (Paste the URL from Step 1)

7. **Select environments:** ✓ Production ✓ Preview ✓ Development

8. **Click "Save"**

---

## 🎯 STEP 3: Redeploy (Important!)

1. **Click "Deployments"** tab at the top

2. **Find the top deployment** in the list (most recent)

3. **Click the three dots (⋯)** on the right side

4. **Click "Redeploy"**

5. **UNCHECK the box** that says "Use existing Build Cache"

6. **Click "Redeploy"** button to confirm

7. **Wait 2-3 minutes** for deployment to complete

---

## ✅ Verify It Works

1. Visit: https://pintch-app-admin.vercel.app/dashboard

2. **Hard refresh** the page:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **You should now see:**
   - ✓ User count (not zero)
   - ✓ Film count (not zero)
   - ✓ Creator count
   - ✓ Charts with data
   - ✓ Activity feed

4. **If still showing zeros:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for: `[Config] API Base URL:`
   - If it says `localhost`, go back to Step 3 and redeploy WITHOUT cache

---

## 🆘 Still Not Working?

### Check Backend is Running
```powershell
curl https://your-backend-url.appspot.com/v2/admin/metrics/overview
```

Should return JSON or 401 error (both are OK - means backend is alive)

### Check Console Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Common errors:
   - **CORS:** Backend URL is wrong
   - **404:** Backend URL is wrong
   - **401:** You need to login first (go to /login)
   - **Network error:** Backend is down

### Make Sure You're Logged In
1. Go to: https://pintch-app-admin.vercel.app/login
2. Login with your admin credentials
3. Then go to dashboard

---

## 📝 What This Fix Does

- ✅ Tells Vercel where your backend API is located
- ✅ Allows dashboard to fetch real data
- ✅ Fixes the "all zeros" problem permanently

## 🎓 Why It Was Broken

- Without `NEXT_PUBLIC_API_BASE_URL`, the app defaults to `localhost:5000`
- `localhost` doesn't exist in Vercel's production environment
- All API calls failed silently
- Dashboard showed zeros as fallback

## 📋 Checklist

- [ ] Got backend URL from Step 1
- [ ] Added environment variable in Vercel (Step 2)
- [ ] Redeployed WITHOUT cache (Step 3)
- [ ] Waited 2-3 minutes for deployment
- [ ] Hard refreshed the dashboard page
- [ ] Dashboard shows real data now!

---

**Time:** ~5 minutes
**Difficulty:** ⭐ Easy
**Result:** ✅ Dashboard works perfectly

For more details, see: `FIX_SUMMARY.md`
