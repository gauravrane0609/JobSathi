const mongoose = require("mongoose");

// Use environment variable when set, otherwise fall back to the provided cluster URI
const DEFAULT_MONGO_URI =
  "mongodb+srv://gaurav-app:LuV1fEdiRrISAQEz@cluster0.bqdvrnd.mongodb.net/?appName=Cluster0";
const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

async function connect() {
  try {
    console.log("Connecting to MongoDB with:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);

    // If authentication failed, try automatic fixes:
    // 1) try URL-encoding the password portion
    // 2) try adding an explicit DB name (/jobsathi)
    // 3) try adding authSource=admin
    if (
      (err && /auth/i.test(err.message)) ||
      (err && err.codeName === "AtlasError")
    ) {
      const attempts = [];

      // original uri
      attempts.push(mongoUri);

      // if credentials are present, add encoded-password variant
      const credMatch = mongoUri.match(
        /^mongodb(\+srv)?:\/\/([^:]+):([^@]+)@(.*)$/
      );
      if (credMatch) {
        const scheme = "mongodb" + (credMatch[1] || "");
        const user = credMatch[2];
        const pass = credMatch[3];
        const rest = credMatch[4];
        const encodedPass = encodeURIComponent(pass);
        if (encodedPass !== pass) {
          attempts.push(`${scheme}://${user}:${encodedPass}@${rest}`);
        }
      }

      // also add variants with explicit DB and authSource
      for (const base of [...attempts]) {
        const hasDb = /\/[A-Za-z0-9_-]+(\?|$)/.test(base);
        let uriWithDb = base;
        if (!hasDb) uriWithDb = base.replace(/\/?(\?.*)?$/, "/jobsathi$1");
        attempts.push(uriWithDb);
        const sep = uriWithDb.includes("?") ? "&" : "?";
        if (!uriWithDb.includes("authSource="))
          attempts.push(uriWithDb + sep + "authSource=admin");
      }

      // Deduplicate attempts while preserving order
      const seen = new Set();
      const uniq = attempts.filter((u) => (seen.has(u) ? false : seen.add(u)));

      for (const attempt of uniq) {
        try {
          console.log("Attempting MongoDB connection to:", attempt);
          await mongoose.connect(attempt);
          console.log("MongoDB Connected (attempt)");
          return;
        } catch (err2) {
          console.error(
            "MongoDB connection error (attempt):",
            err2.message || err2
          );
        }
      }

      console.error("All MongoDB connection attempts failed.");
    }

    // rethrow so caller or process manager sees failure
    // (nodemon will keep the process alive between restarts)
  }
}

connect();
