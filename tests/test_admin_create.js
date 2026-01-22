const axios = require('axios');

async function createAdmin() {
  console.log("Creating Admin User...");
  try {
    const res = await axios.post('http://localhost:4000/api/user/register', {
      name: "Admin User",
      email: "admin@vinotreats.com",
      password: "adminpassword123"
    });
    console.log("Register Response:", res.data);

    if (res.data.success) {
        // Verify role
        if (res.data.user.role === 'admin') { // Note: backend doesn't return 'role' in the user object response in my previous code?
            // Wait, let's check userController.js response.
            // It sends: user: { name, email, cartData }. It does NOT send role.
            // But I can check if I can access an admin route.
            console.log("User registered. Verifying Admin access...");
            const token = res.data.token;

            try {
               const listRes = await axios.get('http://localhost:4000/api/order/list', {
                   headers: { Authorization: `Bearer ${token}` }
               });
               if (listRes.data.success) {
                   console.log("✅ Admin Access Verified! (Accessed /api/order/list)");
               }
            } catch (err) {
               console.log("❌ Admin Access Failed:", err.message);
               if (err.response) console.log(err.response.data);
            }
        } else {
             // If I can't check role directly, I rely on the route check above.
             // But let's check the route with the token anyway.
             const token = res.data.token;
             try {
                const listRes = await axios.get('http://localhost:4000/api/order/list', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (listRes.data.success) {
                    console.log("✅ Admin Access Verified! (Accessed /api/order/list)");
                }
             } catch (err) {
                console.log("❌ Admin Access Failed:", err.message);
                if (err.response) console.log(err.response.data);
             }
        }
    } else {
        // If user already exists, try logging in
        if (res.data.message === "User already exists") {
            console.log("User exists. Logging in...");
            const loginRes = await axios.post('http://localhost:4000/api/user/login', {
                email: "admin@vinotreats.com",
                password: "adminpassword123"
            });

            if (loginRes.data.success) {
                 const token = loginRes.data.token;
                 console.log("Logged in. Verifying Admin access...");
                 try {
                    const listRes = await axios.get('http://localhost:4000/api/order/list', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (listRes.data.success) {
                        console.log("✅ Admin Access Verified! (Accessed /api/order/list)");
                    }
                 } catch (err) {
                    console.log("❌ Admin Access Failed:", err.message);
                    if (err.response) console.log(err.response.data);
                 }
            } else {
                console.log("Login failed:", loginRes.data);
            }
        }
    }

  } catch (err) {
    console.log("Error:", err.message);
    if (err.response) console.log(err.response.data);
  }
}

createAdmin();
