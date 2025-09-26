import express from "express";
import pickupsRouter from "./routes/pickups.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/pickups", pickupsRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});