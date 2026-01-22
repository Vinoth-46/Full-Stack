const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/health';
const TOTAL_REQUESTS = 100;

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
  const failures = results.filter(r => r.status !== 200).length;

  console.log(`[DoS Test] Completed in ${(end - start)}ms`);
  console.log(`[DoS Test] Successes: ${successes}`);
  console.log(`[DoS Test] Failures: ${failures}`);

  if (successes === TOTAL_REQUESTS) {
    console.log("⚠️  VULNERABILITY CONFIRMED: No Rate Limiting detected. All requests were accepted.");
  } else {
    console.log("✅ Rate Limiting might be active.");
  }
}

testDoS();
