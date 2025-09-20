#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:5001';

console.log('🧪 Testing API endpoints...');
console.log('🌐 Base URL:', BASE_URL);

async function testAPI() {
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test API status
    console.log('\n2. Testing API status...');
    const statusResponse = await axios.get(`${BASE_URL}/api/status`);
    console.log('✅ API status:', statusResponse.data);

    // Test API test endpoint
    console.log('\n3. Testing API test endpoint...');
    const testResponse = await axios.get(`${BASE_URL}/api/test`);
    console.log('✅ API test:', testResponse.data);

    // Test login endpoint (should fail without credentials)
    console.log('\n4. Testing login endpoint...');
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {});
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Login endpoint working (validation error as expected)');
      } else {
        console.log('❌ Login endpoint error:', error.message);
      }
    }

    console.log('\n🎉 API tests completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testAPI();
