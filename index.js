const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000 || process.env.PORT;

// List of allowed frontend origins for CORS
const allowedOrigins = [
  "https://thaibasiljp.com",
  "http://thaibasiljp.com",
  "http://127.0.0.1:5500",
];

// Normalize referer function to handle trailing slashes
const normalizeReferer = (referer) => referer?.replace(/\/+$/, "");

// Helper function to check if the user's OS is Windows
const isWindowsOS = (userAgent) => {
  const isWindows = userAgent.includes("Windows");
  console.log(`Is Windows OS: ${isWindows}`);
  return isWindows;
};

// Helper function to check if the referer is allowed
const isAllowedReferrer = (referer) => {
  if (!referer) {
    console.log("Referer is allowed: true (no referer)");
    return true; // Proceed if no referer
  }

  const hostname = new URL(referer).hostname;
  const isAllowed = !(hostname === "www.google.com");
  console.log(`Referer is allowed: ${isAllowed} (hostname: ${hostname})`);
  return isAllowed;
};

// Helper function to check for the gclid parameter
const hasGclidParam = (req) => {
  const hasGclid = !!req.query.gclid;
  console.log(`Has GCLID parameter: ${hasGclid}`);
  return hasGclid;
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Apply the CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies (needed for gclid parameter in URL)
app.use(express.urlencoded({ extended: true }));

// Route to handle the POST request
app.post(
  "/",
  (req, res) => {
    const referer = normalizeReferer(req.headers.referer);
    const userAgent = req.headers["user-agent"]; // Get the User-Agent from the request headers
    const { timezone } = req.body;

    console.log(`Referer: ${referer}, Timezone: ${timezone}, User-Agent: ${userAgent}`);

    // Log timezone condition
    const isTokyoTimezone = timezone === "Asia/Tokyo";
    console.log(`Is Tokyo/Asia Timezone: ${isTokyoTimezone}`);

    // Check all conditions and log them
    if (isAllowedReferrer(referer)) {
      res.sendFile(path.join(__dirname, "altmod.html"));
    } else {
      res.sendFile(path.join(__dirname, "index.html"));
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
