# Dashboard Data Fix Verification Script
# Run this to check if everything is configured correctly

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  COSMIC ADMIN - Configuration Check" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: Environment files
Write-Host "[1/5] Checking environment files..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "  ✓ .env.local exists" -ForegroundColor Green
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_API_BASE_URL=(.+)") {
        $apiUrl = $matches[1].Trim()
        Write-Host "  ✓ API URL configured: $apiUrl" -ForegroundColor Green
        
        if ($apiUrl -like "*localhost*") {
            Write-Host "  ⚠ WARNING: Using localhost URL" -ForegroundColor Yellow
            Write-Host "    This is OK for local development" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ✗ NEXT_PUBLIC_API_BASE_URL not found in .env.local" -ForegroundColor Red
    }
} else {
    Write-Host "  ⚠ .env.local not found (will use defaults)" -ForegroundColor Yellow
}
Write-Host ""

# Check 2: Backend connectivity
Write-Host "[2/5] Checking backend connectivity..." -ForegroundColor Yellow
if ($apiUrl) {
    try {
        Write-Host "  Testing: $apiUrl" -ForegroundColor Gray
        $response = Invoke-WebRequest -Uri "$apiUrl/v2/admin/metrics/overview" -Method GET -UseBasicParsing -ErrorAction Stop
        Write-Host "  ✓ Backend is reachable (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host "  ✓ Backend is reachable (401 Unauthorized - login required)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Cannot reach backend: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "    Status Code: $statusCode" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ⊘ Skipping (no API URL configured)" -ForegroundColor Gray
}
Write-Host ""

# Check 3: Node modules
Write-Host "[3/5] Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✓ node_modules exists" -ForegroundColor Green
    
    # Check package.json
    if (Test-Path "package.json") {
        $package = Get-Content "package.json" -Raw | ConvertFrom-Json
        Write-Host "  ✓ Project: $($package.name)" -ForegroundColor Green
    }
} else {
    Write-Host "  ✗ node_modules not found" -ForegroundColor Red
    Write-Host "    Run: npm install" -ForegroundColor Yellow
}
Write-Host ""

# Check 4: Build files
Write-Host "[4/5] Checking build configuration..." -ForegroundColor Yellow
if (Test-Path "next.config.ts") {
    Write-Host "  ✓ next.config.ts exists" -ForegroundColor Green
}
if (Test-Path "vercel.json") {
    Write-Host "  ✓ vercel.json exists" -ForegroundColor Green
}
if (Test-Path "tsconfig.json") {
    Write-Host "  ✓ tsconfig.json exists" -ForegroundColor Green
}
Write-Host ""

# Check 5: Vercel deployment
Write-Host "[5/5] Checking for Vercel deployment..." -ForegroundColor Yellow
if (Test-Path ".vercel") {
    Write-Host "  ✓ .vercel directory exists (project is linked)" -ForegroundColor Green
    
    if (Test-Path ".vercel/project.json") {
        $vercelProject = Get-Content ".vercel/project.json" -Raw | ConvertFrom-Json
        Write-Host "  ✓ Project ID: $($vercelProject.projectId)" -ForegroundColor Green
        Write-Host "  ✓ Org ID: $($vercelProject.orgId)" -ForegroundColor Green
    }
} else {
    Write-Host "  ⊘ Not linked to Vercel (OK if deploying via Git)" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Summary & Next Steps" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Local Development:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host "  Then visit: http://localhost:3000/dashboard" -ForegroundColor Gray
Write-Host ""

Write-Host "Production (Vercel):" -ForegroundColor White
Write-Host "  1. Make sure NEXT_PUBLIC_API_BASE_URL is set in Vercel" -ForegroundColor Gray
Write-Host "  2. Redeploy without cache" -ForegroundColor Gray
Write-Host "  3. Visit: https://pintch-app-admin.vercel.app/dashboard" -ForegroundColor Gray
Write-Host ""

Write-Host "To deploy backend:" -ForegroundColor White
Write-Host "  cd ..\backend" -ForegroundColor Gray
Write-Host "  gcloud app deploy" -ForegroundColor Gray
Write-Host ""

Write-Host "For detailed instructions, see:" -ForegroundColor White
Write-Host "  - DASHBOARD_FIX_NOW.md (quick fix)" -ForegroundColor Gray
Write-Host "  - VERCEL_FIX_COMPLETE.md (detailed guide)" -ForegroundColor Gray
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
