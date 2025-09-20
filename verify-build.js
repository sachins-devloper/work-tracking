#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying build process...');

try {
  // Check if frontend dist exists
  const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
  console.log('📁 Checking frontend dist path:', frontendDistPath);
  
  if (fs.existsSync(frontendDistPath)) {
    console.log('✅ Frontend dist folder exists');
    const files = fs.readdirSync(frontendDistPath);
    console.log('📁 Files in dist:', files);
    
    // Check for index.html
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✅ index.html found');
    } else {
      console.log('❌ index.html not found');
    }
  } else {
    console.log('❌ Frontend dist folder not found');
    console.log('🔨 Attempting to build frontend...');
    
    // Try to build frontend
    process.chdir(path.join(__dirname, 'frontend'));
    execSync('npm install', { stdio: 'inherit' });
    execSync('npx vite build', { stdio: 'inherit' });
    
    console.log('✅ Frontend build completed');
  }
  
  console.log('🎉 Build verification completed successfully!');
  
} catch (error) {
  console.error('❌ Build verification failed:', error.message);
  process.exit(1);
}
