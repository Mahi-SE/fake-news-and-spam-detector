const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
import cors from "cors";
app.use(cors());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = "AIzaSyBEzCgUEKUieqGWa1UykDqFOPmpE2agbCQ";
const GOOGLE_SAFE_BROWSING_KEY = "AIzaSyChYjlF3vE--OkmeQrkXS8zbWQcLMC_onsn";

app.post("/check-text", async (req, res) => {
  const text = req.body.text;

  try {
    const result = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
      {
        contents: [{
          parts: [{ text: `Analyze this and tell: Real, Fake or Suspicious with short reason only: ${text}` }]
        }]
      }
    );

    res.json({ result: result.data.candidates[0].content.parts[0].text });
  } catch (err) {
    res.json({ error: "AI Error" });
  }
});

app.post("/check-link", async (req, res) => {
  const url = req.body.url;

  try {
    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSING_KEY}`,
      {
        client: { clientId: "hackathon", clientVersion: "1.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }]
        }
      }
    );

    if (response.data.matches) res.json({ result: "⚠️ Scam / Dangerous Link" });
    else res.json({ result: "✅ Safe Link" });

  } catch {
    res.json({ error: "Link Check Failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});
