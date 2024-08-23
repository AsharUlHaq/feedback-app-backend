import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { z } from "zod";
import { ENV } from "./utils/env.util";
import { protect } from "./middleware/protect.middleware";
import { authRoutes } from "./modules/auth/auth.route";
import { feedbackRoutes } from "./modules/feedback/fb.route";
import { sentimentalAnalysis } from "./modules/analysis/sentiments/sentiment.route";
import { summaryRoutes } from "./modules/analysis/summary/summary.route";

const app = express();
app.use(express.json());

app.get("/", protect, (req, res) => {
  console.log("HTTP METHOD - " + req.method + " URL - " + req.url);
  //@ts-ignore
  console.log(req.userId);

  return res.json({ message: "Authorization Completed" });
});

app.use(cors());
app.use(bodyParser.json());
app.use("/", authRoutes);
app.use("/", feedbackRoutes);
app.use("/", sentimentalAnalysis);
app.use("/", summaryRoutes);

app.listen(ENV.PORT, () => {
  console.log(`Application running at http://localhost:${ENV.PORT}`);
});
