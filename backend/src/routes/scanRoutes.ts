import { Router, Request, Response, NextFunction } from "express";
import { ScanService } from "../services/scanService";
import { parseNumber } from "../utils/parseNumber";
import { MAX_PAGE_SIZE } from "../config";
import { ScanStatus } from "../types";
import { z } from "zod";

const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const scanRoutes = (scanService: ScanService) => {
  const router = Router();

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
  router.get(
    "/",
    asyncHandler(async (req: Request, res: Response) => {
      const page = parseNumber(req.query.page, 1, 1);
      const pageSize = parseNumber(req.query.pageSize, 10, 1, MAX_PAGE_SIZE);
      const ip = typeof req.query.ip === "string" ? req.query.ip : undefined;
      let status: ScanStatus | undefined;
      if (
        typeof req.query.status === "string" &&
        Object.values(ScanStatus).includes(req.query.status as ScanStatus)
      ) {
        status = req.query.status as ScanStatus;
      }

      const result = await scanService.getScans(page, pageSize, ip, status);
      res.status(200).json({ ...result, page, pageSize });
    })
  );

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
  router.delete(
    "/:id",
    asyncHandler(async (req: Request, res: Response) => {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Неверный ID" });

      const deleted = await scanService.deleteScan(id);
      if (!deleted)
        return res.status(404).json({ message: "Запись не найдена" });

      res.status(200).json({ message: "Удалено" });
    })
  );

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
  router.delete(
    "/",
    asyncHandler(async (req: Request, res: Response) => {
      const idsSchema = z.object({ ids: z.array(z.number()).min(1) });
      const parsed = idsSchema.safeParse(req.body);
      if (!parsed.success)
        return res.status(400).json({ message: "Неверные данные" });

      const deletedIds = await scanService.deleteScans(parsed.data.ids);
      res
        .status(200)
        .json({ message: `Удалено ${deletedIds.length} записей`, deletedIds });
    })
  );

  return router;
};
