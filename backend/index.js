import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import symptomRoutes from "./routes/symptom.js";
import db from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Symptom Checker Backend" });
});

// API routes
app.use("/api/symptoms", symptomRoutes);

// db structure
if (!db.data) db.data = { history: [] };

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
