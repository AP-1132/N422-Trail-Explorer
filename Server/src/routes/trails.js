import { Router } from "express";
import { prisma } from "../db.js";

export const trailsRouter = Router();

trailsRouter.get("/", async (req, res) => {
  const trails = await prisma.trail.findMany();
  res.json(trails);
});

trailsRouter.post("/", async (req, res) => {
  const { name, distanceMiles, difficulty, region } = req.body;
  const newTrail = await prisma.trail.create({
    data: {
      name,
      distanceMiles,
      difficulty,
      region,
    },
  });
  res.status(201).json(newTrail);
});
