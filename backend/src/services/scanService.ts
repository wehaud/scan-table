import { Pool, QueryResult } from "pg";
import { Scan, ScanStatus } from "../types";

export class ScanService {
  constructor(private pool: Pool) {}

  /**
   * Получить список сканов с фильтрацией и пагинацией
   * @param page номер страницы (1-based)
   * @param pageSize количество элементов на странице
   * @param ip фильтр по IP (подстрока)
   * @param status фильтр по статусу ("active" | "inactive")
   * @returns объект с данными и общим количеством записей
   */
  async getScans(
    page: number,
    pageSize: number,
    ip?: string,
    status?: ScanStatus
  ): Promise<{ data: Scan[]; total: number }> {
    try {
      const offset = (page - 1) * pageSize;
      const filters: string[] = [];
      const values: any[] = [];

      if (ip) {
        values.push(`%${ip}%`);
        filters.push(`ip LIKE $${values.length}`);
      }

      if (status) {
        if (!Object.values(ScanStatus).includes(status)) {
          throw new Error("Invalid status");
        }
        values.push(status);
        filters.push(`status = $${values.length}`);
      }

      const whereClause = filters.length
        ? `WHERE ${filters.join(" AND ")}`
        : "";

      const totalResult: QueryResult<{ count: string }> = await this.pool.query(
        `SELECT COUNT(*) FROM scans ${whereClause}`,
        values
      );
      const total = Number(totalResult.rows[0].count);

      const result: QueryResult<Scan> = await this.pool.query(
        `SELECT
          id,
          ip,
          status,
          to_char(created_at, 'DD.MM.YYYY') AS "createdAt"
        FROM scans ${whereClause}
        ORDER BY id
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}`,
        [...values, pageSize, offset]
      );

      return { data: result.rows, total };
    } catch (error) {
      console.error("Error in getScans:", error);
      throw error;
    }
  }

  /**
   * Удалить скан по ID
   * @param id ID записи
   * @returns true если удалено, false если записи не было
   */
  async deleteScan(id: number): Promise<boolean> {
    try {
      const result: QueryResult<Scan> = await this.pool.query(
        "DELETE FROM scans WHERE id = $1 RETURNING *",
        [id]
      );

      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error(`Error deleting scan with id=${id}:`, error);
      throw error;
    }
  }

  /**
   * Массовое удаление сканов по массиву ID
   * @param ids массив ID записей
   * @returns массив удалённых ID
   */
  async deleteScans(ids: number[]): Promise<number[]> {
    try {
      if (!ids.length) return [];

      const result: QueryResult<{ id: number }> = await this.pool.query(
        "DELETE FROM scans WHERE id = ANY($1::int[]) RETURNING id",
        [ids]
      );

      return result.rows.map((r) => r.id);
    } catch (error) {
      console.error("Error in deleteScans:", error);
      throw error;
    }
  }
}
