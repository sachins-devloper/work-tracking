#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing build process...');

try {
  // Test frontend build
  console.log('📦 Testing frontend build...');
  process.chdir(path.join(__dirname, 'frontend'));
  
  // Check if vite is available
  console.log('🔍 Checking if vite is available...');
  try {
    execSync('npx vite --version', { stdio: 'pipe' });
    console.log('✅ Vite is available');
  } catch (error) {
    console.error('❌ Vite not found:', error.message);
    process.exit(1);
  }
  
  // Test build
  console.log('🔨 Testing vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Check if dist folder was created
  const distPath = path.join(__dirname, 'frontend', 'dist');
  if (fs.existsSync(distPath)) {
    console.log('✅ Frontend build successful!');
    console.log('📁 Dist folder created at:', distPath);
  } else {
    console.error('❌ Dist folder not found');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
}
