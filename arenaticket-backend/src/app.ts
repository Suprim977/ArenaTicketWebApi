import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import userRoute from "./routes/user.route";
import adminUserRoute from "./routes/admin/user.route";
import { HttpException } from "./exceptions/http-exception";

const app = express();
const API_PREFIX = "/api/v1";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "ArenaTicket API is running",
  });
});

app.get(API_PREFIX, (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "ArenaTicket API v1 is running",
  });
});

app.use(`${API_PREFIX}/auth`, userRoute);
app.use(`${API_PREFIX}/admin/users`, adminUserRoute);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
