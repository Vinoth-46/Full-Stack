const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/health';
const TOTAL_REQUESTS = 110; // Increased to trigger limit (limit is 100)

async function testDoS() {
  console.log(`[DoS Test] sending ${TOTAL_REQUESTS} requests to ${BASE_URL}...`);

  const promises = [];
  const start = Date.now();

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    promises.push(axios.get(BASE_URL).catch(err => err.response || err));
  }

  const results = await Promise.all(promises);
  const end = Date.now();

  const successes = results.filter(r => r.status === 200).length;
  const failures = results.filter(r => r.status === 429).length; // Check for 429 specifically

  console.log(`[DoS Test] Completed in ${(end - start)}ms`);
  console.log(`[DoS Test] Successes: ${successes}`);
  console.log(`[DoS Test] Blocked (429): ${failures}`);

  if (failures > 0) {
    console.log("✅ Rate Limiting CONFIRMED. Some requests were blocked.");
  } else {
    console.log("⚠️  VULNERABILITY: No requests were blocked.");
  }
}

testDoS();
