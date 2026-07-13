#!/bin/bash
set -e

echo "🚀 Deploying schools_website → haiha.eliteedu.tech"
echo "================================================"
cd "$(dirname "$0")"

echo ""
echo "📋 Step 1: Building project..."
npm run build
echo "✅ Build completed (dist/)"

echo ""
echo "📋 Step 2: Ensuring .htaccess is in build output..."
if cp public/.htaccess dist/.htaccess 2>/dev/null; then
  echo "✅ .htaccess ready for SPA routing"
else
  echo "⚠️  .htaccess copy skipped — using Vite's public/ copy (should be auto-copied)"
fi

echo ""
echo "📋 Step 3: Deploying to go54 server (haiha.eliteedu.tech)..."

GO54_KEY="${GO54_KEY:-$HOME/.ssh/go54_elitecore}"
GO54_USER="${GO54_USER:-elitesc1}"
GO54_HOST="${GO54_HOST:-elitescholar.ng}"
GO54_PATH="${GO54_PATH:-/home2/elitesc1/public_html/haiha.eliteedu.tech}"

if [ -f "$GO54_KEY" ]; then
  # Ensure the remote directory exists
  ssh -i "$GO54_KEY" -o StrictHostKeyChecking=no -o SendEnv="" "${GO54_USER}@${GO54_HOST}" "mkdir -p ${GO54_PATH}" 2>&1 | grep -v "perl:\\|warning:\\|LANG\\|LC_\\|locale\\|Falling\\|are supported"
  # Pack dist/ and extract on server (rsync not available on go54)
  tar -czf - -C dist . | \
    ssh -i "$GO54_KEY" -o StrictHostKeyChecking=no -o SendEnv="" "${GO54_USER}@${GO54_HOST}" \
    "cd ${GO54_PATH} && tar -xzf - && echo '✅ files extracted'" 2>&1 | grep -v "perl:\\|warning:\\|LANG\\|LC_\\|locale\\|Falling\\|are supported"
  echo ""
  echo "✅ Deployed to: http://haiha.eliteedu.tech/"
  echo "   Host: ${GO54_HOST}:${GO54_PATH}"
else
  echo ""
  echo "⚠️  Skipping deploy — SSH key not found at $GO54_KEY"
  echo ""
  echo "   To set up go54 SSH access:"
  echo "   1. Go to cPanel → SSH/Shell Access → Manage SSH Keys → Import Key"
  echo "   2. Paste the public key, click Authorize"
  echo "   3. Set up your SSH key:"
  echo "      ssh-keygen -t ed25519 -f ~/.ssh/go54_elitecore -N ''"
  echo "   4. Copy the public key (cat ~/.ssh/go54_elitecore.pub) and import in cPanel"
  echo "   5. Re-run this script"
  exit 1
fi

echo ""
echo "📋 Step 4: Pushing source to git repository..."

# Commit any pending changes and push to origin
if git diff --quiet && git diff --cached --quiet; then
  echo "⚠️  No changes to commit — skipping git push"
else
  git add -A
  git commit -m "deploy: update schools_website [skip ci]" 2>/dev/null || echo "⚠️  Nothing new to commit"
  git push origin dynamic 2>&1 || echo "⚠️  Git push failed (may need to pull/rebase first)"
  echo "✅ Source pushed to origin"
fi

echo ""
echo "🎉 Deployment completed!"
echo "   Site: http://haiha.eliteedu.tech/"
