const axios = require('axios');

const PLACE_ORDER_URL = 'http://localhost:4000/api/order/place-cod';
// We need a valid token to test price manipulation (since we fixed Auth)
// So we need to register/login a user first.

async function testPriceManipulation() {
  console.log(`[Price Manipulation] Starting test...`);

  const email = `testprice${Date.now()}@example.com`;
  const password = "password123";
  let token = "";
  let foodId = "";
  let realPrice = 0;

  try {
    // 1. Register User
    const regRes = await axios.post('http://localhost:4000/api/user/register', {
        name: "Test User",
        email,
        password
    });
    token = regRes.data.token;
    console.log("[Price Manipulation] User registered, token received.");

    // 2. Get a Food Item ID and Price
    const foodRes = await axios.get('http://localhost:4000/api/food/list');
    if (foodRes.data.data.length > 0) {
        foodId = foodRes.data.data[0]._id;
        realPrice = foodRes.data.data[0].price;
        console.log(`[Price Manipulation] Found food item: ${foodRes.data.data[0].name}, Price: ${realPrice}`);
    } else {
        console.log("[Price Manipulation] No food items found. Cannot test.");
        return;
    }

    // 3. Attempt to place order with manipulated price
    // We send 'amount: 1' but the real price is 'realPrice'
    const payload = {
        userId: "ignored_by_middleware",
        items: [
            { _id: foodId, quantity: 1, price: 1, name: "Manipulated Item" }
            // We are sending price: 1, expecting backend to ignore it.
        ],
        amount: 1, // Manipulated total amount
        address: {
            firstName: "Hacker", lastName: "Man", email: "hacker@test.com",
            street: "Dark Web", city: "Cyber", state: "Net", zipcode: "1337", country: "Internet", phone: "123"
        }
    };

    const orderRes = await axios.post(PLACE_ORDER_URL, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });

    console.log("[Price Manipulation] Order placed. checking result...");

    // 4. Verify the order amount in the DB (via user orders)
    const ordersRes = await axios.post('http://localhost:4000/api/order/user-order', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const myOrders = ordersRes.data.orders;
    const placedOrder = myOrders.find(o => o._id === orderRes.data.orderId);

    if (placedOrder) {
        // Expected: realPrice + 2 (delivery)
        const expectedAmount = realPrice + 2;
        console.log(`[Price Manipulation] Placed Order Amount: ${placedOrder.amount}`);
        console.log(`[Price Manipulation] Expected Amount: ${expectedAmount}`);

        if (placedOrder.amount === expectedAmount) {
            console.log("✅ Price Manipulation BLOCKED. Server recalculated the price.");
        } else if (placedOrder.amount === 1) {
            console.log("⚠️  VULNERABILITY: Price Manipulation SUCCEEDED. Server accepted client amount.");
        } else {
            console.log(`❓ Unexpected amount: ${placedOrder.amount}`);
        }
    } else {
        console.log("❌ Could not find placed order.");
    }

  } catch (err) {
    console.log(`[Price Manipulation] Error:`, err.message);
    if (err.response) console.log(err.response.data);
  }
}

testPriceManipulation();
