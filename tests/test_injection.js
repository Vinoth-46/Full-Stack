const axios = require('axios');

const LOGIN_URL = 'http://localhost:4000/api/user/login';

async function testNoSQLInjection() {
  console.log(`[NoSQL Injection] Attempting authentication bypass at ${LOGIN_URL}...`);

  // Payload: { email: { $gt: "" }, password: ... }
  // This typically bypasses the email check if the backend passes req.body directly to findOne
  // However, userController.js does: userModel.findOne({ email })
  // If 'email' is an object { $gt: "" }, Mongoose might accept it.

  // Note: userController.js extracts: const { email, password } = req.body;
  // If we send JSON { "email": { "$gt": "" }, "password": "randompassword" }
  // userModel.findOne({ email: { "$gt": "" } }) will match the first user it finds.
  // Then bcrypt.compare(password, user.password) happens.
  // Unless we can also bypass password...
  // Wait, if we can match a user, we still need the password.
  // BUT, finding if a user EXISTS is an enumeration vulnerability.
  // Let's see if we get "Invalid credentials" (User found) vs "User not found".

  const payload = {
    email: { "$gt": "" },
    password: "wrongpassword"
  };

  try {
    const res = await axios.post(LOGIN_URL, payload);
    console.log(`[NoSQL Injection] Response:`, res.data);

    if (res.data.message === "Invalid credentials") {
      console.log("⚠️  VULNERABILITY CONFIRMED: NoSQL Injection (User Enumeration). Backend accepted operator in email field.");
    } else if (res.data.message === "User not found") {
        console.log("✅ NoSQL Injection blocked or no user matched.");
    } else {
        console.log("❓ Unexpected response.");
    }
  } catch (err) {
    console.log(`[NoSQL Injection] Error:`, err.message);
  }
}

testNoSQLInjection();
