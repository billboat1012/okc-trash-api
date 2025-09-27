import express from "express";
import pickupsRouter from "./routes/pickups.mjs";
const app = express();

const port = process.env.PORT || 4000 

app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/pickups", pickupsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})