import "dotenv/config";
import express from "express";
import cors from "cors";

import { routes } from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome to the Trails API!");
});

app.use((err, req, res, next) => {
  const constraint = err.meta?.driverAdapterError?.constraint?.index;
  if (err.code === "P2002") {
    return res
      .status(409)
      .json({ error: `Unique constraint violated ${constraint}` });
  }
  if (err.code === "P2003") {
    return res.status(409).json({
      error: `Related records still reference this row: ${constraint}`,
    });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ error: `Record not found` });
  }
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
