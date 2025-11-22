import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import { ScanStatus } from "./types";
import { ScanService } from "./services/scanService";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const scanService = new ScanService(pool);
const MAX_PAGE_SIZE = Number(process.env.MAX_PAGE_SIZE) || 50;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Scan API", version: "1.0.0" },
  },
  apis: ["./src/index.ts"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /scans:
 *   get:
 *     summary: Получить список сканов
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *       - in: query
 *         name: pageSize
 *         schema: { type: number }
 *       - in: query
 *         name: ip
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: ["active","inactive"] }
 *     responses:
 *       200:
 *         description: Список сканов
 */
app.get("/scans", async (req: Request, res: Response) => {
  let page = Math.max(Number(req.query.page) || 1, 1);
  let pageSize = Math.min(
    Math.max(Number(req.query.pageSize) || 10, 1),
    MAX_PAGE_SIZE
  );
  const ip = typeof req.query.ip === "string" ? req.query.ip : undefined;
  let status: ScanStatus | undefined;
  if (
    typeof req.query.status === "string" &&
    Object.values(ScanStatus).includes(req.query.status as ScanStatus)
  ) {
    status = req.query.status as ScanStatus;
  }

  try {
    const result = await scanService.getScans(page, pageSize, ip, status);
    res.status(200).json({ ...result, page, pageSize });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * @swagger
 * /scans/{id}:
 *   delete:
 *     summary: Удалить один скан
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200: { description: "Удалено" }
 *       404: { description: "Не найдено" }
 */
app.delete("/scans/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Неверный ID" });

  try {
    const deleted = await scanService.deleteScan(id);
    if (!deleted) return res.status(404).json({ message: "Запись не найдена" });
    res.status(200).json({ message: "Удалено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * @swagger
 * /scans:
 *   delete:
 *     summary: Массовое удаление сканов
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, properties: { ids: { type: array, items: { type: number } } } }
 *     responses:
 *       200: { description: "Удалено" }
 *       400: { description: "Неверные данные" }
 */
app.delete("/scans", async (req: Request, res: Response) => {
  const ids = req.body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Нужно передать массив ids" });
  }

  try {
    const deletedIds = await scanService.deleteScans(ids);
    res
      .status(200)
      .json({ message: `Удалено ${deletedIds.length} записей`, deletedIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.listen(port, () =>
  console.log(`Backend running at http://localhost:${port}`)
);
