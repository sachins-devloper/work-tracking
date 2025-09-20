#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🏗️ Building frontend...');

try {
  // Change to frontend directory
  process.chdir(path.join(__dirname, 'frontend'));
  
  // Install dependencies if needed
  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the frontend
  console.log('🔨 Building React app...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('✅ Frontend build completed successfully!');
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}
