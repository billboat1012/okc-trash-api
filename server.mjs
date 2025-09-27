import express from "express";
import pickupsRouter from "./routes/pickups.mjs";
const app = express();
app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/pickups", pickupsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});