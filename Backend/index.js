// Load required modules
const express = require('express'); // Web server framework
const admin = require('firebase-admin'); // Firebase admin SDK (for Firestore)
const bodyParser = require('body-parser'); // Parses incoming JSON
const cors = require('cors'); // Allows cross-origin requests

const app = express();
app.use(cors()); // Allow frontend from other origins to call this backend
app.use(bodyParser.json()); // Parse JSON request body

// ✅ MANUALLY REQUIRED FILE:
// 👉 You must download this from Firebase Console > Project Settings > Service Accounts
// 👉 Save as 'serviceAccountKey.json' in the same folder
const serviceAccount = require("./dsi-registration-firebase-adminsdk-fbsvc-5db198b7f8.json");

// ✅ Initialize Firebase Admin with credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ✅ Get Firestore database instance
const db = admin.firestore();

// ✅ Main API endpoint to handle form submission
app.post('/register', async (req, res) => {
  // Destructure submitted name and phone from request body
  const { name, phone } = req.body;

  // Simple validation check
  if (!name || !phone) {
    return res.status(400).send("Missing data");
  }

  // Save to Firestore under the 'registrations' collection
  await db.collection('registrations').add({
    name,
    phone,
    timestamp: new Date()
  });

  // (Optional) This is where you can call SMS API (e.g., Twilio, Sendeasy)

  // Return success message
  res.status(200).send({ message: "Registered" });
});

// ✅ Start Express server on port 3000 (local)
app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
