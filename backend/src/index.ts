import express from "express";
import cors from "cors";
import { ScanService } from "./services/scanService";
import { scanRoutes } from "./routes/scanRoutes";
import { swaggerUiServe, swaggerUiSetup } from "./swagger";
import { pool } from "./db";
import { PORT } from "./config";

const app = express();
app.use(cors());
app.use(express.json());

const scanService = new ScanService(pool);
app.use("/scans", scanRoutes(scanService));
app.use("/api-docs", swaggerUiServe, swaggerUiSetup);

app.use((err: any, res: express.Response) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Ошибка сервера";
  res.status(status).json({ message });
});

app.listen(PORT, () =>
  console.log(`Backend running at http://localhost:${PORT}`)
);
