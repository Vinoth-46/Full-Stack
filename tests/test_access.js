const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const ADD_FOOD_URL = 'http://localhost:4000/api/food/add';

async function testBrokenAccess() {
  console.log(`[Broken Access] Attempting to add food item without auth token at ${ADD_FOOD_URL}...`);

  // Create a dummy image file
  const imagePath = path.join(__dirname, 'test_image.jpg');
  fs.writeFileSync(imagePath, 'dummy image content');

  const form = new FormData();
  form.append('name', 'Hacker Burger');
  form.append('description', 'Injected via broken access control');
  form.append('price', '100');
  form.append('category', 'Hacked');
  form.append('image', fs.createReadStream(imagePath));

  try {
    const res = await axios.post(ADD_FOOD_URL, form, {
      headers: {
        ...form.getHeaders()
        // NO Authorization header!
      }
    });

    console.log(`[Broken Access] Response:`, res.data);

    if (res.data.success) {
      console.log("⚠️  VULNERABILITY CONFIRMED: Broken Access Control. Item added without authentication.");
    } else {
      console.log("✅ Request failed (maybe protected?).");
    }

  } catch (err) {
    console.log(`[Broken Access] Error:`, err.message);
    if (err.response) {
        console.log(`[Broken Access] Status: ${err.response.status}`);
        console.log(`[Broken Access] Data:`, err.response.data);
    }
  } finally {
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }
}

testBrokenAccess();
