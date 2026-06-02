const AUTH_PRO_URL = 'https://p01--auth-pro--f2ksfrkf9d45.code.run';

async function testAuth() {
  const email = `test_${Date.now()}@example.com`;
  
  // 1. Signup
  const res1 = await fetch(`${AUTH_PRO_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', redirectUrl: 'http://localhost' })
  });
  console.log("Signup:", await res1.text());

  // 2. Login
  const res2 = await fetch(`${AUTH_PRO_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' })
  });
  console.log("Login:", await res2.text());
}

testAuth();
